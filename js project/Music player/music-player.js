let musics = [
  {
    name: "Lose Yourself",
    cover: "pics/eminem.jfif",
    audio: new Audio("./musics/Lose Yourself.mp3"),
  },
  {
    name: "All Eyez On Me",
    cover: "pics/2pac.jfif",
    audio: new Audio("./musics/All Eyez On Me.mp3"),
  },
  {
    name: "In The End",
    cover: "pics/2.jpg",
    audio: new Audio("./musics/in the end.mp3"),
  },
];

let musicName = document.querySelector("#music-name");
let musicCover = document.querySelector("#music-cover");
let range = document.querySelector("#music-time");
let preBtn = document.querySelector("#pre-btn");
let playBtn = document.querySelector("#play-btn");
let nextBtn = document.querySelector("#next-btn");

let currentMusic = 0;
let audio = musics[currentMusic].audio;
musicCover.src = musics[currentMusic].cover;
musicName.innerText = musics[currentMusic].name;

audio.addEventListener("canplay", () => {
  range.max = audio.duration;
});
audio.addEventListener("timeupdate", () => {
  range.value = audio.currentTime;
});
range.addEventListener("input", () => {
  audio.currentTime = range.value;
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    musicCover.style.animationPlayState = "running";
  } else {
    audio.pause();
    musicCover.style.animationPlayState = "paused";
    playBtn.classList.replace("fa-pause", "fa-play");
  }
});

preBtn.addEventListener("click", () => {
  changeMusic("pre");
});
nextBtn.addEventListener("click", () => {
  changeMusic("next");
});

function changeMusic(state) {
  audio.pause();
  range.value = 0;
  playBtn.classList.replace("fa-pause", "fa-play");
  musicCover.style.animationPlayState = "paused";
  audio.currentTime = 0;
  if (state == "next") {
    if (currentMusic == musics.length - 1) currentMusic = 0;
    else currentMusic += 1;
  } else if (state == "pre") {
    if (currentMusic == 0) currentMusic = musics.length - 1;
    else currentMusic -= 1;
  }
  audio = musics[currentMusic].audio;
  musicCover.src = musics[currentMusic].cover;
  musicName.innerText = musics[currentMusic].name;

  audio.addEventListener("canplay", () => {
    range.max = audio.duration;
  });
  audio.addEventListener("timeupdate", () => {
    range.value = audio.currentTime;
  });
  range.addEventListener("input", () => {
    audio.currentTime = range.value;
  });
}

// keyboard function ..................................................................

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 32) {
    if (audio.paused) {
      audio.play();
      playBtn.classList.replace("fa-play", "fa-pause");
      musicCover.style.animationPlayState = "running";
    } else {
      audio.pause();
      musicCover.style.animationPlayState = "paused";
      playBtn.classList.replace("fa-pause", "fa-play");
    }
  }
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 39) {
    changeMusic("next");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37) {
    changeMusic("pre");
  }
});
