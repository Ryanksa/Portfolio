import { Particle } from "./particle";
import { Arr } from "./array";

const BYTE_RANGE = 255;
const PIM_INIT_SIZE = 30000;

export class RipplingImage {
  // Attributes
  image: HTMLImageElement;
  width: number;
  height: number;
  pixelSize: number;
  radius: number;
  friction: number;
  ease: number;
  // Particles
  particles: Particle[];
  particlesInMotion: Arr<Particle>;
  pimSwap: Arr<Particle>;
  // States
  hovering: boolean;
  // Cached computations
  wScaled: number;
  hScaled: number;
  rScaled: number;
  rSquared: number;

  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    pixelSize: number,
    radius: number,
    friction: number,
    ease: number
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.radius = radius;
    this.friction = friction;
    this.ease = ease;
    this.particles = [];
    this.particlesInMotion = new Arr(PIM_INIT_SIZE);
    this.pimSwap = new Arr(PIM_INIT_SIZE);
    this.hovering = false;
    this.wScaled = Math.round(this.width / this.pixelSize);
    this.hScaled = Math.round(this.height / this.pixelSize);
    this.rScaled = Math.round(this.radius / this.pixelSize);
    this.rSquared = radius ** 2;
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
        const a = pixels[index + 3] / BYTE_RANGE;
        const colour = `rgba(${r},${g},${b},${a})`;
        if (a > 0) {
          const particle = new Particle(
            x,
            y,
            this.pixelSize,
            colour,
            this.friction,
            this.ease
          );
          this.particles.push(particle);
        }
      }
    }

    let canvasRect: DOMRect;
    const onMouseMove = (event: MouseEvent) => {
      setTimeout(() => {
        this.ripple(
          ctx,
          event.clientX - canvasRect.left,
          event.clientY - canvasRect.top
        );
      }, 300);
    };
    const onMouseEnter = () => {
      canvasRect = canvas.getBoundingClientRect();
      this.hovering = true;
    };
    const onMouseLeave = () => {
      this.hovering = false;
      this.restore(ctx);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    for (let i = 0; i < this.particlesInMotion.length(); i++) {
      this.particlesInMotion.at(i).draw(ctx);
    }
  }

  update(mouseX: number, mouseY: number) {
    const x = Math.round(mouseX / this.pixelSize);
    const xStart = Math.max(x - this.rScaled, 0);
    const xEnd = Math.min(x + this.rScaled, this.wScaled);

    const y = Math.round(mouseY / this.pixelSize);
    const yStart = Math.max(y - this.rScaled, 0);
    const yEnd = Math.min(y + this.rScaled, this.hScaled);

    for (let i = yStart; i < yEnd; i++) {
      const row = i * this.wScaled;
      for (let j = xStart; j < xEnd; j++) {
        const particle = this.particles[row + j];
        if (!particle.isInMotion()) {
          this.particlesInMotion.push(particle);
        }
      }
    }

    this.pimSwap.empty();
    for (let i = this.particlesInMotion.length() - 1; i >= 0; i--) {
      const particle = this.particlesInMotion.at(i);
      particle.updateVelocity(mouseX, mouseY, this.radius, this.rSquared);
      particle.updatePosition();
      if (particle.isInMotion()) {
        this.pimSwap.push(particle);
      }
    }
    const temp = this.particlesInMotion;
    this.particlesInMotion = this.pimSwap;
    this.pimSwap = temp;
  }

  ripple(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
    this.update(mouseX, mouseY);
    this.draw(ctx);
  }

  restore(ctx: CanvasRenderingContext2D) {
    const _restore = () => {
      this.update(-this.radius, -this.radius);
      this.draw(ctx);
      if (!this.hovering && this.particlesInMotion.length() > 0) {
        requestAnimationFrame(_restore);
      }
    };
    _restore();
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
