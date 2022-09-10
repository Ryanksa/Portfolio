<script>
  import { spring } from "svelte/motion";

  const background = "url('/assets/koifish.png')";
  const width = "172px";
  const height = "115px";
  const halfHeight = "57.5px";

  let pos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.03,
      damping: 0.3,
    }
  );
  let prevPos = { x: 0, y: 0 };
  $: dx = $pos.x - prevPos.x;
  $: dy = $pos.y - prevPos.y;
  $: theta = Math.atan2(dy, dx);

  const handleMouseMove = (e) => {
    prevPos.x = $pos.x;
    prevPos.y = $pos.y;
    pos.set({ x: e.clientX, y: e.clientY });
  };
</script>

<div class="fish-container" on:mousemove={handleMouseMove}>
  <div
    class="fish"
    style:background
    style:--w={width}
    style:--h={height}
    style:--hh={halfHeight}
    style:--x="{$pos.x}px"
    style:--y="{$pos.y}px"
    style:--r="{theta}rad"
  />
</div>

<style>
  .fish-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .fish {
    width: var(--w);
    height: var(--h);
    position: absolute;
    left: calc(var(--x) - var(--w));
    top: calc(var(--y) - var(--hh));
    transform: rotate(var(--r));
    transform-origin: right;
  }
</style>
