export class Particle {
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

  constructor(x: number, y: number, size: number, colour: string) {
    this.size = size;
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
    this.vx *= this.friction;
    this.x += this.vx + (this.originX - this.x) * this.ease;
    this.vy *= this.friction;
    this.y += this.vy + (this.originY - this.y) * this.ease;
  }

  isRestored() {
    return (
      Math.abs(this.x - this.originX) < 0.1 &&
      Math.abs(this.y - this.originY) < 0.1
    );
  }
}

export class ImageParticles {
  image: HTMLImageElement;
  width: number;
  height: number;
  particles: Particle[];
  pixelSize: number;
  mouse: {
    radius: number;
    x: number;
    y: number;
  };
  hovering: boolean;
  restored: boolean;

  constructor(image: HTMLImageElement, width: number, height: number) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.pixelSize = 3;
    this.mouse = {
      radius: 30,
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

    const onMouseMove = (event: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - canvasRect.left;
      this.mouse.y = event.clientY - canvasRect.top;
    };
    const onMouseEnter = () => {
      this.hovering = true;
    };
    const onMouseLeave = () => {
      this.hovering = false;
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
    this.restored = true;
    for (const particle of this.particles) {
      if (this.hovering) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = dx ** 2 + dy ** 2;
        if (distance < this.mouse.radius ** 2) {
          const angle = Math.atan2(dy, dx);
          particle.vx = -this.mouse.radius * Math.cos(angle);
          particle.vy = -this.mouse.radius * Math.sin(angle);
        }
      }
      particle.update();
      if (this.restored && !particle.isRestored()) {
        this.restored = false;
      }
    }
  }

  animate(ctx: CanvasRenderingContext2D) {
    if (this.hovering || !this.restored) {
      ctx.clearRect(0, 0, this.width, this.height);
      this.update();
      this.draw(ctx);
    }
    requestAnimationFrame(() => this.animate(ctx));
  }
}
