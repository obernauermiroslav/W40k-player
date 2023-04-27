let player = document.getElementById("player");
const playButton = document.getElementById("playButton");
const volumeUpBtn = document.getElementById("vol-up");
const volumeDownBtn = document.getElementById("vol-down");
let cover = document.getElementById("album-cover");

playButton.onclick = playAudio;
volumeDownBtn.onclick = decreaseVolume;
volumeUpBtn.onclick = increaseVolume;

let currentSongIndex = 0;
/*
let songs = [
  {
    title: "warhammer - The one",
    src: "audio/warhammer.mp3",
    duration: "2:24",
    image: "img/titan1.gif",
  },
  {
    title: "reset music",
    src: "audio/reset.mp3",
    duration: "4:51",
    image: "img/titan2.gif",
  },
  {
    title: "heavy music",
    src: "audio/heavy.mp3",
    duration: "3:48",
    image: "img/titan3.gif",
  },
  {
    title: "Within Temptation : The fire within",
    duration: "3:33",
    src: "audio/Within Temptation - The Fire Within.mp3",
    image: "img/titan4.gif",
  },
  {
    title: "Carmina gloria - medieval metal",
    src: "audio/carmina.mp3",
    duration: "6:38",
    image: "img/titan5.gif",
  },
  {
    title: "MM6 arena music",
    src: "audio/arena.mp3",
    duration: "4:20",
    image: "img/titan6.gif",
  },
];
*/
let songs = [];

function increaseVolume() {
  if (player.volume + 0.1 > 0.9) {
    player.volume = 1;
  } else {
    player.volume += 0.1;
  }
}

function decreaseVolume() {
  if (player.volume - 0.1 < 0.1) {
    player.volume = 0;
  } else {
    player.volume -= 0.1;
  }
}

function pauseAudio() {
  player.pause();
  playButton.innerHTML = "Play";
  playButton.onclick = playAudio;
}

function playAudio() {
  player.play();
  playButton.innerHTML = "Pause";
  playButton.onclick = pauseAudio;
}

function playSong(song) {
  console.log('Selected Song:', song); 
  console.log('Songs array:', songs); 

  if (song) {
    player.src = song.src;
    cover.src = song.image;
    player.play();
  } else {
    console.log('Song is undefined');
  }
}


function nextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  playSong(songs[currentSongIndex]);
}

function previousSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  playSong(songs[currentSongIndex]);
}

function mute() {
  player.muted = !player.muted;
}

const audio = document.querySelector(".speedcontrolcontainer  audio");
const playbackrate = document.querySelector(".speedcontrolcontainer input");
const display = document.querySelector(".speedcontrolcontainer span");
const displayvalue = (val) => {
  return parseInt(val * 100, 10) + "%";
};
if (window.localStorage.pbspeed) {
  audio.playbackRate = window.localStorage.pbspeed;
  playbackrate.value = window.localStorage.pbspeed;
}
display.innerText = displayvalue(audio.playbackRate);
playbackrate.addEventListener("change", (e) => {
  audio.playbackRate = playbackrate.value;
  display.innerText = displayvalue(playbackrate.value);
  window.localStorage.pbspeed = playbackrate.value;
});

function postNew() {
  fetch(`http://localhost:3000/api/songs`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log("adding songs to database");
      return response.json();
      } else {
        console.error("songs already in table");
      }
    })
    .then((data) => {
      console.log(data)
      songs = [...data]
      console.log(songs);
    });
}

postNew();





