import { Particle } from "./particle";

const MAX_PARTICLES = 9000;

export class ImageParticles {
  // Attributes
  image: HTMLImageElement;
  width: number;
  height: number;
  pixelSize: number;
  radius: number;
  radiusSq: number;
  friction: number;
  ease: number;
  // Particles
  particles: Particle[];
  particlesInMotion: Particle[];
  // Cached computations
  wScaled: number;
  hScaled: number;
  rScaled: number;

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
    this.radiusSq = radius ** 2;
    this.friction = friction;
    this.ease = ease;
    this.particles = [];
    this.particlesInMotion = [];
    this.wScaled = Math.round(this.width / this.pixelSize);
    this.hScaled = Math.round(this.height / this.pixelSize);
    this.rScaled = Math.round(this.radius / this.pixelSize);
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

    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;
      this.update(mouseX, mouseY);
      this.draw(ctx);
    };
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    for (const particle of this.particlesInMotion) {
      particle.draw(ctx);
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

    const particlesInMotion: Particle[] = [];
    for (let i = this.particlesInMotion.length - 1; i >= 0; i--) {
      const particle = this.particlesInMotion[i];
      particle.updateVelocity(mouseX, mouseY, this.radius, this.radiusSq);
      particle.updatePosition();
      if (particle.isInMotion()) {
        particlesInMotion.push(particle);
        if (particlesInMotion.length >= MAX_PARTICLES) {
          break;
        }
      }
    }
    this.particlesInMotion = particlesInMotion;
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
