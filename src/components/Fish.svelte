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

  let ripple = {
    playing: false,
    pos: { x: 0, y: 0 },
  };

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    const playInterval = setInterval(() => {
      ripple = {
        playing: true,
        pos: { x: $pos.x, y: $pos.y },
      };
    }, 3000);
    const stopInterval = setInterval(() => {
      ripple = {
        ...ripple,
        playing: false,
      };
    }, 6000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(playInterval);
      clearInterval(stopInterval);
    };
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
{#if ripple.playing}
  <div
    class="ripple"
    style:left={`${ripple.pos.x}px`}
    style:top={`${ripple.pos.y}px`}
  />
{/if}

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

  .ripple {
    position: absolute;
    z-index: 99;
    border-radius: 50%;
    border: 1.5px solid rgb(252, 131, 25);
    animation: ripple 900ms forwards;
  }

  .ripple::before {
    content: "";
    width: 30%;
    height: 30%;
    position: absolute;
    left: 35%;
    top: 35%;
    border-radius: inherit;
    border: inherit;
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
