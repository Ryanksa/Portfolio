<script>
  export let header;
  export let body;
  export let url;
  export let inDelay;

  import { spring } from "svelte/motion";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  let hidden = true;
  onMount(() => {
    setTimeout(() => {
      hidden = false;
    }, inDelay);
  });

  let fill = spring(0, {
    stiffness: 0.03,
    damping: 0.3,
  });
  let hovering;
  let unhovering;

  const handleMouseEnter = url
    ? () => {
        clearInterval(unhovering);
        hovering = setInterval(() => {
          if ($fill < 100) {
            fill.set(Math.max($fill + 5, 100));
          } else {
            clearInterval(hovering);
            window.open(url, "_blank");
          }
        }, 100);
      }
    : null;

  const handleMouseLeave = url
    ? () => {
        clearInterval(hovering);
        unhovering = setInterval(() => {
          if ($fill > 0) {
            fill.set(Math.min($fill - 5, 0));
          } else {
            clearInterval(unhovering);
          }
        }, 100);
      }
    : null;
</script>

{#if !hidden}
  <div
    class="flex flex-col justify-center items-center p-4 bg-slate-300/25 rounded-3xl relative overflow-hidden"
    transition:fly={{ y: 300, duration: 900 }}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <div
      class="w-full absolute left-0 bottom-0 rounded-xl bg-slate-400/25"
      style:height={`${$fill}%`}
    />
    <div class="text-2xl font-bold mb-2">{header}</div>
    <div
      class="w-4/5 h-[3px] bg-indigo-400 rounded-xl scale-x-0 animate-divider-expand"
    />
    <div class="text-lg mt-2 p-2">{body}</div>
  </div>
{/if}
