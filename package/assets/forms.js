import { page } from "$app/stores";
import { navigate } from "astro:transitions/client";
import * as devalue from "devalue";
import { tick } from "svelte";

// APPLY ACTION ****************************************************************************************************************************
export async function applyAction(result) {
  if (import.meta.env.SSR) throw new Error("Cannot call applyAction(...) on the server");
  // console.log("applyAction", result);

  if (result.type === "error") {
    // const url = new URL(location.href)
    // const {branch, route} = current
    // if (!route) return
    // const error_load = await load_nearest_error_page(current.branch.length, branch, route.errors)
    // if (error_load) {
    //   const navigation_result = get_navigation_result_from_branch({
    //     url,
    //     params: current.params,
    //     branch: branch.slice(0, error_load.idx).concat(error_load.node),
    //     status: result.status ?? 500,
    //     error: result.error,
    //     route,
    //   })
    //   current = navigation_result.state
    //   root.$set(navigation_result.props)
    //   tick().then(reset_focus)
    // }
  } else if (result.type === "redirect") navigate(result.location);
  else {
    page.update((previous) => ({ ...previous, form: result.data, status: result.status }));
    await tick();
    if (result.type === "success") reset_focus();
  }
}

// DESERIALIZE *****************************************************************************************************************************
export function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) parsed.data = devalue.parse(parsed.data);
  return parsed;
}

// ENHANCE *********************************************************************************************************************************
export function enhance(_form, submit) {
  const _formClone = HTMLElement.prototype.cloneNode.call(_form);

  if (import.meta.env.DEV && _formClone.method !== "post")
    throw new Error('use:enhance can only be used on <form> fields with method="POST"');

  async function handleSubmit(event) {
    const _submitter = event.submitter ? event.submitter : undefined;

    const method = _submitter?.hasAttribute("formmethod") ? _submitter.formMethod : _formClone.method;
    if (method !== "post") return;

    event.preventDefault();

    const formData = new FormData(_form);

    const { origin, searchParams } = new URL(_submitter?.hasAttribute("formaction") ? _submitter.formAction : _formClone.action);
    const action = new URL(origin + `/_actions/${searchParams.get("_astroAction")}`);

    const enctype = _submitter?.hasAttribute("formenctype") ? _submitter.formEnctype : _formClone.enctype;

    if (import.meta.env.DEV && enctype !== "multipart/form-data")
      for (const value of formData.values())
        if (value instanceof File)
          throw new Error(
            'Your form contains <input type="file"> fields, but is missing the necessary `enctype="multipart/form-data"` attribute. This will lead to inconsistent behavior between enhanced and native forms. For more details, see https://github.com/sveltejs/kit/issues/9819.',
          );

    const submitter_name = _submitter?.getAttribute("name");
    if (submitter_name) formData.append(submitter_name, _submitter?.getAttribute("value") ?? "");

    const controller = new AbortController();

    let cancelled = false;
    const cancel = () => (cancelled = true);

    const callback = await submit({ action, cancel, controller, formData, formElement: _form, submitter: _submitter });
    if (cancelled) return;

    let result;

    try {
      const headers = new Headers({ accept: "application/json" });
      if (enctype !== "multipart/form-data")
        headers.set(
          "Content-Type",
          /^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype) ? enctype : "application/x-www-form-urlencoded",
        );
      const body = enctype === "multipart/form-data" ? formData : new URLSearchParams(formData);
      const response = await fetch(action, { method: "POST", headers, cache: "no-store", body, signal: controller.signal });
      result = devalue.parse(await response.text());
      if (result.type === "error") result.status = response.status;
    } catch (error) {
      if (error?.name === "AbortError") return;
      result = { type: "error", error };
    }

    callback({ result });
  }

  HTMLFormElement.prototype.addEventListener.call(_form, "submit", handleSubmit);
  return { destroy: () => HTMLFormElement.prototype.removeEventListener.call(_form, "submit", handleSubmit) };
}

// INTERNAL ********************************************************************************************************************************
function reset_focus() {
  const autofocus = document.querySelector("[autofocus]");
  if (autofocus) {
    // @ts-ignore
    autofocus.focus();
  } else {
    // Reset page selection and focus
    // We try to mimic browsers' behaviour as closely as possible by targeting the
    // first scrollable region, but unfortunately it's not a perfect match — e.g.
    // shift-tabbing won't immediately cycle up from the end of the page on Chromium
    // See https://html.spec.whatwg.org/multipage/interaction.html#get-the-focusable-area
    const root = document.body;
    const tabindex = root.getAttribute("tabindex");

    root.tabIndex = -1;
    // @ts-expect-error
    root.focus({ preventScroll: true, focusVisible: false });

    // restore `tabindex` as to prevent `root` from stealing input from elements
    if (tabindex !== null) {
      root.setAttribute("tabindex", tabindex);
    } else {
      root.removeAttribute("tabindex");
    }

    // capture current selection, so we can compare the state after
    // snapshot restoration and afterNavigate callbacks have run
    const selection = getSelection();

    if (selection && selection.type !== "None") {
      const ranges = [];

      for (let i = 0; i < selection.rangeCount; i += 1) {
        ranges.push(selection.getRangeAt(i));
      }

      setTimeout(() => {
        if (selection.rangeCount !== ranges.length) return;

        for (let i = 0; i < selection.rangeCount; i += 1) {
          const a = ranges[i];
          const b = selection.getRangeAt(i);

          // we need to do a deep comparison rather than just `a !== b` because
          // Safari behaves differently to other browsers
          if (
            a.commonAncestorContainer !== b.commonAncestorContainer ||
            a.startContainer !== b.startContainer ||
            a.endContainer !== b.endContainer ||
            a.startOffset !== b.startOffset ||
            a.endOffset !== b.endOffset
          ) {
            return;
          }
        }

        // if the selection hasn't changed (as a result of an element being (auto)focused,
        // or a programmatic selection, we reset everything as part of the navigation)
        // fixes https://github.com/sveltejs/kit/issues/8439
        selection.removeAllRanges();
      });
    }
  }
}
