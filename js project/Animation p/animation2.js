let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

class Ball {
  constructor() {
    this.r = 30;
    this.x = randomIntFromInterval(0 + this.r, window.innerWidth - this.r);
    this.y = randomIntFromInterval(0 + this.r, window.innerHeight - this.r);
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.draw();
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = "red";
    c.fill();
  }
  update() {
    if (this.x + this.r > window.innerWidth || this.x - this.r < 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r > window.innerHeight || this.y - this.r < 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.draw();
  }
}
let ball = new Ball();

function animate() {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ball.update();
  requestAnimationFrame(animate);
}
animate();

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
