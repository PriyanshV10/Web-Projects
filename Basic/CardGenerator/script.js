let videoNumber = 1;

function addVideo(duration, views, old) {
    let html = `<div class="card">
                    <div class="video-number">${videoNumber}</div>
                    <div class="image">
                        <img src="Assets/youtube.jpg" alt="">
                        <div class="capsule">${duration[0]}:${duration[1]}${duration[2]}</div>
                    </div>
                    <div class="text">
                        <div class="video-title">Sample Video Title ${videoNumber}</div>
                        <div class="video-description">
                            <div>Channel name</div>
                            <div class="bullet"></div>
                            <div>${views} Views</div>
                            <div class="bullet"></div>
                            <div>${old} ago</div>
                        </div>
                    </div>
                </div>`;
    
    document.querySelector(".container").innerHTML += html;

    videoNumber++;
}

function createVideo() {
    let duration = [0, 0, 0];
    duration[0] = Math.floor(Math.random() * 60);
    duration[1] = Math.floor(Math.random() * 6);
    duration[2] = Math.floor(Math.random() * 10);

    let views = Math.floor(Math.random() * 10000000000);
    let count = 0;
    while(views > 999) {
        views /= 1000;
        count++;
    }
    views = parseInt(views);
    if(count == 1) views = views + "K";
    if(count == 2) views = views + "M";
    if(count == 3) views = views + "B";

    let days = Math.ceil(Math.random() * 5000);
    let old = "days"
    if(days > 29) {
        days /= 30
        old = "months"
    } 
    if(days > 11) {
        days /= 12
        old = "years"
    } 
    days = parseInt(days)
    if(days == 1) {
        if(old == "months") old = days + " month"
        else old = days + " year"
    } 
    else old = days + " " + old
    
    addVideo(duration, views, old);
}

let btn = document.getElementById("btn");
btn.addEventListener("click", () => {
    createVideo()
});
