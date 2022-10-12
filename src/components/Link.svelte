<script lang="ts">
  export let text: string;
  export let icon: string;
  export let url: string;

  import { spring } from "svelte/motion";

  let fill = spring(0, {
    stiffness: 0.03,
    damping: 0.3,
  });
  let hovering: NodeJS.Timer;
  let unhovering: NodeJS.Timer;

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

<div
  class="flex items-center gap-2 w-fit py-1 pl-2 pr-6 rounded-xl relative overflow-hidden"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div
    class="h-full absolute left-0 top-0 rounded-xl bg-slate-300/25"
    style:width={`${$fill}%`}
  />
  {#if icon}
    <img src={icon} alt="" class="w-6 h-6" />
  {/if}
  {text}
</div>
