<script lang="ts">
  export let reversed: boolean = false;

  import Panel from "./Panel.svelte";
</script>

<Panel>
  <div
    slot="content"
    class="h-full flex justify-center items-center gap-12"
    style:flex-direction={reversed ? "row-reverse" : "row"}
  >
    <div class="hidden sm:w-1/2 sm:grid place-items-center">
      <slot name="preview" />
    </div>
    <div class="w-full sm:w-1/2 grid place-items-center">
      <div class="flex flex-col gap-6">
        <h2 class="text-4xl sm:text-6xl">
          <slot name="name" />
          <span class="block text-base text-gray-400">
            <slot name="technologies" />
          </span>
        </h2>
        <p class="text-2xl">
          <slot name="description" />
        </p>
        <div class="flex flex-col gap-1">
          <slot name="project-link" />
          <slot name="code-link" />
        </div>
      </div>
    </div>
  </div>
</Panel>
