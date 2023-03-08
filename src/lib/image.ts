import { Particle } from "./particle";

const RADIUS = 30;

export class ImageParticles {
  image: HTMLImageElement;
  width: number;
  height: number;
  particles: Particle[];
  pixelSize: number;
  mouse: {
    x: number;
    y: number;
  };
  hovering: boolean;
  restored: boolean;

  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    pixelSize: number
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.pixelSize = pixelSize;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.hovering = false;
    this.restored = true;
  }

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
    for (let y = 0; y < this.height; y += this.pixelSize) {
      for (let x = 0; x < this.width; x += this.pixelSize) {
        const index = (y * this.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const a = pixels[index + 3];
        const colour = `rgba(${r},${g},${b},${a})`;
        if (a > 0) {
          const particle = new Particle(x, y, this.pixelSize, colour);
          this.particles.push(particle);
        }
      }
    }

    let hoverTimeout: NodeJS.Timeout;
    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - canvasRect.left;
      this.mouse.y = event.clientY - canvasRect.top;
    };
    const onMouseEnter = () => {
      clearTimeout(hoverTimeout);
      this.hovering = true;
    };
    const onMouseLeave = () => {
      hoverTimeout = setTimeout(() => {
        this.hovering = false;
      }, 1000);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    this.animate(ctx);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(hoverTimeout);
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }

  update() {
    for (const particle of this.particles) {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = dx ** 2 + dy ** 2;
      if (distance < RADIUS ** 2) {
        const angle = Math.atan2(dy, dx);
        particle.vx = -RADIUS * Math.cos(angle);
        particle.vy = -RADIUS * Math.sin(angle);
      }
      particle.update();
    }
  }

  restore() {
    this.restored = true;
    for (const particle of this.particles) {
      particle.restore();
      if (!particle.isRestored()) {
        this.restored = false;
      }
    }
  }

  animate(ctx: CanvasRenderingContext2D) {
    if (this.hovering) {
      ctx.clearRect(0, 0, this.width, this.height);
      this.update();
      this.draw(ctx);
      this.restored = false;
    } else if (!this.restored) {
      ctx.clearRect(0, 0, this.width, this.height);
      this.restore();
      this.draw(ctx);
      if (this.restored) {
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
      }
    }
    requestAnimationFrame(() => this.animate(ctx));
  }
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, _reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = src;
  });
};
