<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import fish from "../assets/koifish.png";

  const HALF_PI = Math.PI / 2;

  const background = `url(${fish})`;
  const width = "150px";
  const height = "135px";
  const halfHeight = "67.5px";

  let pos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.03,
      damping: 0.3,
    }
  );
  let theta = 0;
  let flip = false;

  const handleMouseMove = (e) => {
    const prevTheta = theta;
    const dx = e.clientX - $pos.x;
    const dy = e.clientY - $pos.y;
    theta = Math.atan2(dy, dx);
    pos.set({ x: e.clientX, y: e.clientY });

    if (prevTheta > HALF_PI && theta < -HALF_PI) flip = false;
    else if (prevTheta < -HALF_PI && theta > HALF_PI) flip = true;
    else if (theta >= prevTheta) flip = false;
    else if (theta < prevTheta) flip = true;
  };

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });
</script>

<div
  class="fish"
  style:--bg={background}
  style:--w={width}
  style:--h={height}
  style:--hh={halfHeight}
  style:--x="{$pos.x}px"
  style:--y="{$pos.y}px"
  style:--r="{theta}rad"
  style:--sy={flip ? -1 : 1}
/>

<style>
  .fish {
    width: var(--w);
    height: var(--h);
    background-image: var(--bg);
    background-size: contain;
    position: absolute;
    left: calc(var(--x) - var(--w));
    top: calc(var(--y) - var(--hh));
    transform: rotate(var(--r)) scaleY(var(--sy));
    transform-origin: right;
    z-index: 100;
  }
</style>
