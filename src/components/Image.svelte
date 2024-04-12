<script lang="ts">
  export let url: string;

  import { onMount } from "svelte";
  import { RipplingImage, loadImage } from "../lib/image";

  const PIXEL_SIZE = 1;
  const RADIUS = 30;
  const FRICTION = 0.75;
  const EASE = 0.45;

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const image = await loadImage(url);

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = (rect.width / image.width) * image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ripplingImage = new RipplingImage(
      image,
      canvas.width,
      canvas.height,
      PIXEL_SIZE,
      RADIUS,
      FRICTION,
      EASE
    );
    return ripplingImage.init(canvas, ctx);
  });
</script>

<div
  bind:this={container}
  class="w-full max-h-screen rounded-xl overflow-hidden"
>
  <canvas bind:this={canvas} />
</div>
