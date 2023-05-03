var canvas = document.getElementById("mycanvas");
var c = canvas.getContext("2d");

var frames = 0;
var DEGREE = Math.PI / 180;

var sprite = new Image();
sprite.src = "img/sprite.png";

var SCORE = new Audio();
SCORE.src = "audio/score.wav";

var FLAP = new Audio();
FLAP.src = "audio/flap.wav";

var HIT = new Audio();
HIT.src = "audio/hit.wav";

var DIE = new Audio();
DIE.src = "audio/die.wav";

var START = new Audio();
START.src = "audio/start.wav";

var state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

function clickHandler() {
  switch (state.current) {
    case state.getReady:
      START.play();
      state.current = state.game;
      break;
    case state.game:
      FLAP.play();
      bird.flap();
      break;
    default:
      bird.speed = 0;
      bird.rotation = 0;
      score.value = 0;
      pipes.position = [];
      state.current = state.getReady;
      break;
  }
}
document.addEventListener("click", clickHandler);

document.addEventListener("keydown", function (e) {
  if (e.which == 32) {
    clickHandler();
  }
});

var bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: canvas.height - 226,
  draw: function () {
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};

var fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  dx: 2,
  y: canvas.height - 112,
  draw: function () {
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};

var bird = {
  Animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  w: 34,
  h: 26,
  x: 50,
  y: 150,
  speed: 0,
  gravity: 0.25,
  jump: 4.6,
  rotation: 0,
  radius: 12,
  AnimationIndex: 0,

  draw: function () {
    let bird = this.Animation[this.AnimationIndex];
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    c.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    c.restore();
  },
  update: function () {
    var period = state.current == state.getReady ? 10 : 5;
    this.AnimationIndex += frames % period == 0 ? 1 : 0;
    this.AnimationIndex = this.AnimationIndex % this.Animation.length;

    if (state.current == state.getReady) {
      this.y = 150;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.speed < this.jump) {
        this.rotation = -25 * DEGREE;
      } else {
        this.rotation = 75 * DEGREE;
      }
    }
    if (this.y + this.h / 2 >= canvas.height - fg.h) {
      this.y = canvas.height - fg.h - this.h / 2;
      this.AnimationIndex = 1;
      if (state.current == state.game) {
        DIE.play();
        state.current = state.over;
      }
    }
  },
  flap: function () {
    this.speed = -this.jump;
  },
};

var pipes = {
  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },
  w: 53,
  h: 400,
  dx: 2,
  gap: 100,
  position: [],
  maxYPos: -150,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      c.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      c.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.current != state.game) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      let bottomPipesPos = p.y + this.h + this.gap;

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipesPos &&
        bird.y - bird.radius < bottomPipesPos + this.h
      ) {
        HIT.play();
        state.current = state.over;
      }

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        SCORE.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
};

var score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  draw: function () {
    c.fillStyle = "#FFF";
    c.strokeStyle = "#000";

    if (state.current == state.game) {
      c.lineWidth = 2;
      c.font = "35px IMPACT";

      c.fillText(this.value, canvas.width / 2, 50);
      c.strokeText(this.value, canvas.width / 2, 50);
    } else if (state.current == state.over) {
      c.font = "25px IMPACT";

      c.fillText(this.value, 225, 186);
      c.strokeText(this.value, 225, 186);

      c.fillText(this.best, 225, 228);
      c.strokeText(this.best, 225, 228);
    }
  },
};

var getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: canvas.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    if (state.current == state.getReady) {
      c.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

var gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: canvas.width / 2 - 225 / 2,
  y: 90,
  draw: function () {
    if (state.current == state.over) {
      c.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function draw() {
  c.fillStyle = "#70c5ce";
  c.fillRect(0, 0, canvas.clientWidth, canvas.height);
  bg.draw();
  fg.draw();
  bird.draw();
  pipes.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function animate() {
  update();
  draw();
  frames++;
  requestAnimationFrame(animate);
}
animate();
