let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

// Random Color .........................................................
let randomColor = Math.floor(Math.random() * 16777215).toString(16);

class Ball {
  constructor(x, y) {
    this.baseR = 10;
    this.r = this.baseR;
    this.x = x || randomIntFromInterval(0 + this.r, window.innerWidth - this.r);
    this.y =
      y || randomIntFromInterval(0 + this.r, window.innerHeight - this.r);

    // Random speed  .........................................................
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;

    this.draw();
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fillStyle = `${"#" + randomColor}`;
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
let balls = [];
for (let i = 0; i < 100; i++) {
  balls.push(new Ball());
}

function animate() {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  balls.forEach((ball) => {
    ball.update();
  });

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("click", (e) => {
  balls.push(new Ball(e.clientX, e.clientY));
});

window.addEventListener("mousemove", (e) => {
  balls.forEach((ball) => {
    // formul for distance betwen 2 items.....................................................
    let distance = Math.sqrt(
      Math.pow(e.clientX - ball.x, 2) + Math.pow(e.clientY - ball.y, 2)
    );

    if (distance < 100 && ball.r < ball.baseR * 4) {
      ball.r += 1;
    } else if (ball.r > ball.baseR) {
      ball.r -= 1;
    }
  });
});

// Responsive page .....................................................
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Random number (from min to max).....................................................
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
