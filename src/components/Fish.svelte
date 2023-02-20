<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import fish from "../assets/koifish.png";

  const HALF_PI = Math.PI / 2;
  const BACKGROUND = `url(${fish})`;
  const WIDTH = "150px";
  const HEIGHT = "135px";
  const HALF_HEIGHT = "67.5px";

  let pos = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.03,
      damping: 0.3,
    }
  );
  let theta = 0;
  let flip = false;
  let ripples: { id: string; x: number; y: number }[] = [];

  const handleMove = (e: MouseEvent) => {
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

  const handleClick = () => {
    ripples.push({
      id: `${$pos.x}-${$pos.y}`,
      x: $pos.x,
      y: $pos.y,
    });
    if (ripples.length >= 10) {
      ripples = ripples.slice(-1);
    }
    ripples = ripples;
  };

  onMount(() => {
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleClick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleClick);
    };
  });
</script>

<div
  class="fish"
  style:--bg={BACKGROUND}
  style:--w={WIDTH}
  style:--h={HEIGHT}
  style:--hh={HALF_HEIGHT}
  style:--x="{$pos.x}px"
  style:--y="{$pos.y}px"
  style:--r="{theta}rad"
  style:--sy={flip ? -1 : 1}
/>
{#each ripples as ripple (ripple.id)}
  <div
    class="ripple ripple-1"
    style:left={`${ripple.x}px`}
    style:top={`${ripple.y}px`}
  />
  <div
    class="ripple ripple-2"
    style:left={`${ripple.x}px`}
    style:top={`${ripple.y}px`}
  />
{/each}

<style>
  .fish {
    width: var(--w);
    height: var(--h);
    background-image: var(--bg);
    background-size: contain;
    position: fixed;
    left: calc(var(--x) - var(--w));
    top: calc(var(--y) - var(--hh));
    transform: rotate(var(--r)) scaleY(var(--sy));
    transform-origin: right;
    z-index: 100;
  }

  .ripple {
    position: fixed;
    z-index: 99;
    border-radius: 50%;
    border: 1.5px solid rgb(252, 131, 25);
    opacity: 0;
  }

  .ripple-1 {
    animation: ripple 600ms ease-out 0ms forwards;
  }

  .ripple-2 {
    animation: ripple 600ms ease-out 300ms forwards;
  }

  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 60px;
      height: 60px;
      opacity: 0;
      transform: translate(-30px, -30px);
    }
  }
</style>
