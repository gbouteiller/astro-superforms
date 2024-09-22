<script lang="ts">
  import { Button } from "@/components/ui/button";
  import * as Sheet from "@/components/ui/sheet";
</script>

<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
      <span class="i-lucide-menu h-5 w-5"></span>
      <span class="sr-only">Toggle navigation menu</span>
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="left">
    <nav class="grid gap-6 text-lg font-medium">
      <a href="##" class="flex items-center gap-2 text-lg font-semibold">
        <span class="i-lucide-package-2 h-6 w-6"></span>
        <span class="sr-only">Acme Inc</span>
      </a>
      <a href="##" class="text-muted-foreground hover:text-foreground"> Dashboard </a>
      <a href="##" class="text-muted-foreground hover:text-foreground"> Orders </a>
      <a href="##" class="text-muted-foreground hover:text-foreground"> Products </a>
      <a href="##" class="text-muted-foreground hover:text-foreground"> Customers </a>
      <a href="##" class="hover:text-foreground"> Settings </a>
    </nav>
  </Sheet.Content>
</Sheet.Root>
