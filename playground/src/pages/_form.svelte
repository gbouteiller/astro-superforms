<script lang="ts" context="module">
  // TYPES *********************************************************************************************************************************
  export interface FormProps {
    children?: Snippet
    sv: SuperValidated<SigninValues, {code: string; text: string}>
  }
</script>

<script lang="ts">
  import * as Card from "@/components/ui/card"
  import * as Form from "@/components/ui/form"
  import {Input} from "@/components/ui/input"
  import {zSigninValues, type SigninValues} from "@/lib/auth"
  import {cn} from "@/lib/utils"
  import {actions, getActionProps} from "astro:actions"
  import type {Snippet} from "svelte"
  import {toast} from "svelte-sonner"
  import {superForm, type SuperValidated} from "sveltekit-superforms"
  import {zodClient} from "sveltekit-superforms/adapters"

  // PROPS *********************************************************************************************************************************
  let {children, sv}: FormProps = $props()

  // VARS **********************************************************************************************************************************
  const sf = superForm(sv, {
    validators: zodClient(zSigninValues),
    onError: ({result}) => {
      console.log("onError", result)
      // if (message && !valid) toast.error(message.code)
    },
    onResult: (data) => {
      console.log("onResult", data.result)
      // data.result.data = {form: data.result.form}
    },
    onUpdate: ({result, form: {message, valid}}) => {
      console.log("onUpdate", {message, result, valid})
    },
    onUpdated: ({form: {message, valid}}) => {
      console.log("onUpdated", {message, valid})
      if (message && !valid) toast.error(message.text)
    },
  })
  const {delayed, enhance, form, submitting} = sf
</script>

<Card.Root class="max-w-md">
  <form method="POST" use:enhance class="space-y-4">
    <Card.Header>
      <Card.Title>Card Title</Card.Title>
      <Card.Description>Card Description</Card.Description>
    </Card.Header>
    <Card.Content>
      <input {...getActionProps(actions.auth.signin)} />
      <Form.Field {sf} name="username">
        <Form.Control let:attrs>
          <Form.Label>Username</Form.Label>
          <Input {...attrs} bind:value={$form.username} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {sf} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input type="password" {...attrs} bind:value={$form.password} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      {@render children?.()}
    </Card.Content>
    <Card.Footer>
      <Form.Button disabled={$submitting} class="flex w-full gap-2">
        <span class={cn("h-4 w-4", $delayed ? "i-lucide-loader animate-spin" : "i-lucide-log-in")}></span>
        Sign in
      </Form.Button>
    </Card.Footer>
  </form>
</Card.Root>
