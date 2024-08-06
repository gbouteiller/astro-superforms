<script lang="ts" context="module">
  import type {FormPath, SuperForm} from "sveltekit-superforms"
  type T = Record<string, unknown>
  type U = FormPath<T>
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import {cn} from "@/lib/utils.js"
  import * as FormPrimitive from "formsnap"
  import type {HTMLAttributes} from "svelte/elements"

  type $$Props = Omit<FormPrimitive.FieldProps<T, U>, "form"> & HTMLAttributes<HTMLDivElement> & {sf: SuperForm<T>}

  export let sf: SuperForm<T>
  export let name: U

  let className: $$Props["class"] = undefined
  export {className as class}
</script>

<FormPrimitive.Field form={sf} {name} let:constraints let:errors let:tainted let:value>
  <div class={cn("space-y-2", className)}>
    <slot {constraints} {errors} {tainted} {value} />
  </div>
</FormPrimitive.Field>
