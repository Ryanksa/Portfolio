export class Particle {
  parent: ImageParticles;
  size: number;
  colour: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  ease: number;
  friction: number;

  constructor(parent: ImageParticles, x: number, y: number, colour: string) {
    this.parent = parent;
    this.size = parent.pixelSize;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.3;
    this.friction = 0.6;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    if (this.parent.mouse.x != null && this.parent.mouse.y != null) {
      const dx = this.parent.mouse.x - this.x;
      const dy = this.parent.mouse.y - this.y;
      const distance = dx ** 2 + dy ** 2;
      if (distance < this.parent.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        this.vx = -this.parent.propelForce * Math.cos(angle);
        this.vy = -this.parent.propelForce * Math.sin(angle);
      }
    }
    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }
}

export class ImageParticles {
  image: HTMLImageElement;
  width: number;
  height: number;
  particles: Particle[];
  pixelSize: number;
  propelForce: number;
  mouse: {
    radius: number;
    x?: number;
    y?: number;
  };
  drawing: boolean;

  constructor(image: HTMLImageElement, width: number, height: number) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.pixelSize = 3;
    this.propelForce = 30;
    this.mouse = {
      radius: 900,
      x: undefined,
      y: undefined,
    };
    this.drawing = false;
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
          const particle = new Particle(this, x, y, colour);
          this.particles.push(particle);
        }
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - canvasRect.left;
      this.mouse.y = event.clientY - canvasRect.top;
    };
    const onMouseEnter = () => {
      this.drawing = true;
    };
    const onMouseLeave = () => {
      this.drawing = false;
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    this.animate(ctx);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }

  update() {
    for (const particle of this.particles) {
      particle.update();
    }
  }

  animate(ctx: CanvasRenderingContext2D) {
    if (this.drawing) {
      this.update();
      ctx.clearRect(0, 0, this.width, this.height);
      this.draw(ctx);
    }
    requestAnimationFrame(() => this.animate(ctx));
  }
}
