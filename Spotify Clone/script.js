console.log("Hello World")

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Songs")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for(let i=0; i<as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href)
        }
    }
    return songs
}

var currSong = new Audio()
let play = document.getElementById("play-button")

function convertTime(time) {
    if(isNaN(time)) {
        return `0:00`
    }
    m = parseInt(time / 60)
    s1 = parseInt((time % 60) / 10)
    s2 = parseInt((time % 60) % 10)
    return `${m}:${s1}${s2}`
}

const playMusic = (track, check) => {
    currSong.src = track
    if(check) {
        currSong.play()
        let html = `<img src="Assets/pause-button.svg" alt=""></img>`;
        play.innerHTML = html;
    } 
    console.log(track)
    let element = document.getElementById("curr-song")
    element.innerHTML = `<div class="song-name">
                    ${track.split("/Songs/")[1].replaceAll("%20", ' ').split(".m")[0].split("-")[0]}
                </div>
                <div class="artist-name">
                    ${track.split("/Songs/")[1].replaceAll("%20", ' ').split(".m")[0].split("-")[1]}
                </div>`
}

async function main() {
    let songs = await getSongs()
    console.log(songs)

    let songList = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs) {
        songList.innerHTML += `
        <li data-custom = "${song}">
            <img height="45px" width="40px" src="Assets/music-img.png" alt="">
            <div class="song-description">
                <div class="song-name">
                    ${song.split("/Songs/")[1].replaceAll("%20", ' ').split(".m")[0].split("-")[0]}
                </div>
                <div class="artist-name">
                    ${song.split("/Songs/")[1].replaceAll("%20", ' ').split(".m")[0].split("-")[1]}
                </div>
            </div>
        </li>`;
    }

    // Load the first song
    playMusic(songs[0], false)

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let songClicked = e.getAttribute('data-custom')
            console.log(songClicked)
            playMusic(songClicked, true);
        })
    })

    // Add an event listener to each buttons
    play.addEventListener("click", () => {
        let status = '';
        if(currSong.paused) {
            currSong.play()
            status = 'Assets/pause-button.svg';
        }
        else {
            currSong.pause()
            status = 'Assets/play-button.svg';
        }
        let html = `<img src="${status}" alt=""></img>`;
        play.innerHTML = html;
    })

    // Listen for timeupdate event
    currSong.addEventListener("timeupdate", () => {
        let currTime = document.getElementById("current-time")
        let totalTime = document.getElementById("total-time")
        let current = currSong.currentTime
        let total = currSong.duration
        currTime.innerHTML = convertTime(current)
        totalTime.innerHTML = convertTime(total)
        document.querySelector(".progress").style.width = (current / total) * 100 + "%" 
        document.querySelector(".circle").style.left = ((current / total) * 100) - 1 + "%" 
    })

    // Add listener for seekbar
    document.querySelector(".seek").addEventListener("click", e => {
        const seek = e.currentTarget;
        const seekRect = seek.getBoundingClientRect();
        const clickPosition = e.clientX - seekRect.left;
        const seekWidth = seekRect.width;
        const percent = (clickPosition / seekWidth) * 100;
        const newTime = (percent / 100) * currSong.duration;

        currSong.currentTime = newTime;

        document.querySelector(".progress").style.width = percent + "%";
        document.querySelector(".circle").style.left = percent + "%";
    })
}


main()

