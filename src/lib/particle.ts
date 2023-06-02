const ORIGIN_THRESHOLD = 0.1;
const MOTION_THRESHOLD = 0.1;

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

  constructor(
    x: number,
    y: number,
    size: number,
    colour: string,
    friction: number,
    ease: number
  ) {
    this.size = size;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = friction;
    this.ease = ease;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  updateVelocity(
    mouseX: number,
    mouseY: number,
    radius: number,
    radiusSq: number
  ) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = dx ** 2 + dy ** 2;
    if (distance < radiusSq) {
      const angle = Math.atan2(dy, dx);
      this.vx = -radius * Math.cos(angle);
      this.vy = -radius * Math.sin(angle);
    }
  }

  updatePosition() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx + (this.originX - this.x) * this.ease;
    this.y += this.vy + (this.originY - this.y) * this.ease;
  }

  isInMotion() {
    return (
      (Math.abs(this.vx) > MOTION_THRESHOLD ||
        Math.abs(this.vy) > MOTION_THRESHOLD) &&
      Math.abs(this.x - this.originX) > ORIGIN_THRESHOLD &&
      Math.abs(this.y - this.originY) > ORIGIN_THRESHOLD
    );
  }
}
