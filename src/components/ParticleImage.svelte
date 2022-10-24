<script lang="ts">
  export let url: string;

  import { onMount } from "svelte";
  import { ImageParticles } from "../lib/particle";
  import { loadImage } from "../lib/image";

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const image = await loadImage(url);

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = (rect.width / image.width) * image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageParticles = new ImageParticles(
      image,
      canvas.width,
      canvas.height
    );
    return imageParticles.init(canvas, ctx);
  });
</script>

<div
  bind:this={container}
  class="w-full max-w-[600px] rounded-xl overflow-hidden"
>
  <canvas bind:this={canvas} />
</div>
