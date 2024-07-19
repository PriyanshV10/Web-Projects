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
    const jsmediatags = window.jsmediatags;
    let artFormat, artData, title, artist;
    jsmediatags.read(track, {
        onSuccess: function(tag) {
            console.log(tag)
            title = track.split("/Songs/")[1].replaceAll("%20", " ").split(" - ")[0].trim()
            artist = track.split("/Songs/")[1].replaceAll("%20", " ").split(" - ")[1].split(".m")[0].trim()
            title = (tag.tags.title) ? tag.tags.title : title;
            console.log(title)
            artist = (tag.tags.artist) ? tag.tags.artist : artist;
            const data = tag.tags.picture.data;
            const format = tag.tags.picture.format;
            let base64String = "";
            
            for(let i=0; i<data.length; i++) {
                base64String += String.fromCharCode(data[i])
            }

            artFormat = format;
            artData = base64String;
            let element = document.querySelector(".song")
            element.innerHTML = `
                <img src="data:${artFormat};base64,${window.btoa(base64String)}" height="60px" alt="">
                <div id="curr-song">
                    <div class="song-name">${title}</div>
                    <div class="artist-name">${artist}</div>
                </div>`
        }
    })
}

async function main() {
    let songs = await getSongs()
    console.log(songs)
    let songsLength = songs.length;

    for(const song of songs) {
        const jsmediatags = window.jsmediatags;
        let artFormat, artData, title, artist;
        jsmediatags.read(song, {
            onSuccess: function(tag) {
                console.log(tag)
                title = song.split("/Songs/")[1].replaceAll("%20", " ").split(" - ")[0].trim()
                artist = song.split("/Songs/")[1].replaceAll("%20", " ").split(" - ")[1].split(".m")[0].trim()
                title = (tag.tags.title) ? tag.tags.title : title;
                console.log(title)
                artist = (tag.tags.artist) ? tag.tags.artist : artist;
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";
                
                for(let i=0; i<data.length; i++) {
                    base64String += String.fromCharCode(data[i])
                }
                
                artFormat = format;
                artData = base64String;
                let songList = document.querySelector(".songList").getElementsByTagName("ul")[0]
                songList.innerHTML += `
                <li data-custom = "${song}">
                    <img height="48px" width="48px" src="data:${artFormat};base64,${window.btoa(base64String)}" alt="">
                    <div class="song-description">
                        <div class="song-name">
                            ${title}
                        </div>
                        <div class="artist-name">
                            ${artist}
                        </div>
                    </div>
                </li>`;
        }
    })
        let songName = song.split("/Songs/")[1].replaceAll("%20", ' ').split(".m")[0]
    }

    // Load the first song
    playMusic(songs[0], false)

    // Attach an event listener to each song
    document.querySelector(".songList ul").addEventListener("click", (e) => {
        if(e.target.closest("li")) {
            let newSong = e.target.closest("li").getAttribute("data-custom");
            console.log(newSong);
            playMusic(newSong, true);
        }
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
        // Song time update
        let currTime = document.getElementById("current-time")
        let totalTime = document.getElementById("total-time")
        let current = currSong.currentTime
        let total = currSong.duration
        currTime.innerHTML = convertTime(current)
        totalTime.innerHTML = convertTime(total)
        document.querySelector(".progress").style.width = (current / total) * 100 + "%" 
        document.querySelector(".circle").style.left = ((current / total) * 100) - 1 + "%" 

        // Volume update
        const newVolume = currSong.volume
        document.querySelector(".volume-progress").style.width = (newVolume * 100) + "%";
        document.querySelector(".volume-circle").style.left = (newVolume * 100 - 2) + "%";
        if(newVolume == 0) {
            document.querySelector(".volume-button").src = "Assets/volume-off.svg"
        }

        // Next Track
        if(currSong.currentTime == currSong.duration) {
            let index = songs.indexOf(currSong.src)
            console.log(index)
            playMusic(songs[(index + 1) % songsLength], true)
        }
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

    // Add an event listener to hamburger
    document.querySelector("#hamburger").addEventListener("click", () => {
        document.querySelector("aside").style.left = "8px";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector("aside").style.left = "-100%"
    })

    // Add an event listener to previous and next
    let previous = document.querySelector("#prev-button")
    let next = document.querySelector("#next-button")
    previous.addEventListener("click", () => {
        // console.log(currSong.src.split("/").slice(-1) [0])
        let index = songs.indexOf(currSong.src)
        console.log(index)
        if(index == 0) {
            playMusic(songs[songsLength - 1], true)
        }
        else {
            playMusic(songs[(index - 1) % songsLength], true)
        }
    })
    next.addEventListener("click", () => {
        // console.log(currSong.src.split("/").slice(-1) [0])
        let index = songs.indexOf(currSong.src)
        console.log(index)
        playMusic(songs[(index + 1) % songsLength], true)
    })

    // Event Listener for volume change
    document.querySelector(".volume").addEventListener("click", e => {
        const volumeBar = e.currentTarget;
        const volumeRect = volumeBar.getBoundingClientRect();
        const clickPosition = e.clientX - volumeRect.left;
        const volumeWidth = volumeRect.width;
        const percent = (clickPosition / volumeWidth) * 100;
        const newVolume = percent / 100;
    
        currSong.volume = newVolume;
    
        console.log(percent)
        document.querySelector(".volume-progress").style.width = percent + "%";
        document.querySelector(".volume-circle").style.left = (percent - 2) + "%";
    });

    // Event Listener for mute button
    document.querySelector(".volume-button").addEventListener("click", (e) => {
        if(currSong.volume == 0) {
            e.target.src = "Assets/volume-on.svg"
            currSong.volume = 1
        }
        else {
            e.target.src = "Assets/volume-off.svg"
            currSong.volume = 0
        }
        document.querySelector(".volume-progress").style.width = (currSong.volume * 100) + "%";
        document.querySelector(".volume-circle").style.left = (currSong.volume * 100 - 2) + "%";
    })

    
}


main()

