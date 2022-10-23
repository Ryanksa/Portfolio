<script lang="ts">
  import { onMount } from "svelte";

  let hidden = false;

  onMount(() => {
    const onMouseWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) hidden = true;
    };
    // @ts-ignore
    window.addEventListener("mousewheel", onMouseWheel);
    // @ts-ignore
    () => window.removeEventListener("mousewheel", onMouseWheel);
  });
</script>

{#if !hidden}
  <div
    class="fixed bottom-1 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center"
  >
    <span>scroll down</span>
    <span class="animate-bounce">v</span>
  </div>
{/if}
