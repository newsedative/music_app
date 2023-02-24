let container = document.querySelector(`.album`);

let search = new URLSearchParams(window.location.search);

let i = search.get(`i`);

let album = albums[i];

if(!album){
    renderError();
} else {
    renderAlbumInfo();

    renderTracks();

    setupAudio();
}


function renderError() {
    container.innerHTML += 'Ошибка загрузки'
};

function renderAlbumInfo() {
    container.innerHTML = `<div class="card mb-3">
    <div class="row">
        <div class="col-4">
            <img src="${album.img}" alt="" class="img-fluid rounded-start">
        </div>
        <div class="col-8">
        <div class="card-body">
            <h5 class="card-title">${album.title}</h5>
            <p class="card-text">${album.description}</p>
            <p class="card-text"><small class="text-muted">Сборник выпущен в ${album.year} году</small></p>
        </div>
        </div>
    </div>
    </div>`;
};

function renderTracks() {
    let playlist = document.querySelector(`.playlist `);

    let tracks = album.tracks;

    for(let j = 0; j < tracks.length; j++) {
        let track = tracks[j];
        playlist.innerHTML += `
        <li class="track list-group-item d-flex align-items-center">
            <img src="assets/play-button.png" alt="" class="me-3 play" height="30px">
            <img src="assets/pause-button.png" alt="" class="me-3 d-none pause" height="30px">
                <div>
                    <div>${track.title}</div>
                    <div class="text-secondary">${track.author}</div>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
                <div class="ms-auto time">${track.time}</div>
                <audio class="audio" src="${track.src}"></audio>
        </li>`

    }
};

function setupAudio() {
    // Найди коллекцию с треками
    let tracks = album.tracks;
    let trackNodes = document.querySelectorAll(`.track`); 
    for (let i = 0; i < trackNodes.length; i++) { 
        // Один элемент
        let track = tracks[i];
        let node = trackNodes[i];   
        let timeNode = node.querySelector(`.time`);
        // Тег аудио внутри этого элемента
        let audio = node.querySelector(`.audio`); 
        let imgPause = node.querySelector(`.pause`);
        let imgPlay = node.querySelector(`.play`);

        let progressBar = document.querySelector(`.progress-bar`);

        node.addEventListener(`click`, function () {
            // Если трек сейчас играет...
            if (track.isPlaying) {
                isPlaying = false;
                // Поставить на паузу
                audio.pause();
                imgPlay.classList.remove(`d-none`);
                imgPause.classList.add(`d-none`);
            // Если трек сейчас не играет...
            } else {
                track.isPlaying = true;
                // Включить проигрывание
                audio.play();
                imgPause.classList.remove(`d-none`);
                imgPlay.classList.add(`d-none`);
                
                updateProgress();
            }
        });
        function updateProgress() {
            // Нарисовать актуальное время
            let time = getTime(audio.currentTime);
            timeNode.innerHTML = time;
            progressBar.style.width = audio.currentTime * 100 / audio.duration + `%`;
          
            // Нужно ли вызвать её ещё раз?
            if (track.isPlaying) {
                  requestAnimationFrame(updateProgress);
            }            
        }

    }
};

function getTime(time) {
    let currentSecond = Math.floor(time);
    let minutes = Math.floor(currentSecond/60);
    let seconds = Math.floor(currentSecond%60);
    if (minutes < 10) {
        minutes = `0` + minutes;
    }
    if (seconds < 10) {
        seconds = `0` + seconds;
    }
    return `${minutes}:${seconds}`
};