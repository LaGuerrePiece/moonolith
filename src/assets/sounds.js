const music = new Audio('/audio/ghibli8bit.mp3');
const rumble = new Audio('/audio/rumble.mp3');

music.loop = true;

// import musicAudio from '/src/assets/audio/ghibli8bit.mp3';
// import rumbleAudio from '/src/assets/audio/rumble.mp3';

// const music = new Audio(musicAudio);
// const rumble = new Audio(rumbleAudio);

export let muteState = false;

export function toggleMute() {
    if (muteState) {
        music.play();
        muteState = false;
    } else {
        music.pause();
        rumble.pause();
        muteState = true;
    }
}

export function playSound(name) {
    const audio = new Audio('/src/assets/audio/' + name + '.mp3');
    audio.play();
}

export function toggleMusic() {
    return music.paused ? music.play() : music.pause();
}

export function stopSound(name) {
    const audio = new Audio('/src/assets/audio/' + name + '.mp3');
    console.log('stopSound', name);
    audio.pause();
}

export function toggleRumble() {
    return rumble.paused ? rumble.play() : fadeAudio(rumble);
}

function fadeAudio(sound) {
    setInterval(() => {
        const fadePoint = sound.duration - 5;
        if (sound.currentTime >= fadePoint && sound.volume !== 0) {
            sound.volume -= 0.1;
        }

        if (sound.volume < 0.003) {
            sound.volume = 0;
            clearInterval(fadeAudio);
            sound.pause();
        }
    }, 200);
}
