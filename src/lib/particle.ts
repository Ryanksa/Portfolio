const FRICTION = 0.75;
const EASE = 0.6;

export class Particle {
  size: number;
  colour: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;

  constructor(x: number, y: number, size: number, colour: string) {
    this.size = size;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = FRICTION;
    this.ease = EASE;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.vx *= this.friction;
    this.x += this.vx;
    this.vy *= this.friction;
    this.y += this.vy;
  }

  restore() {
    this.vx = 0;
    this.vy = 0;
    this.x += (this.originX - this.x) * this.ease;
    this.y += (this.originY - this.y) * this.ease;
  }

  isRestored() {
    return (
      Math.abs(this.x - this.originX) < 0.1 &&
      Math.abs(this.y - this.originY) < 0.1
    );
  }
}
