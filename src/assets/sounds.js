const music = new Audio('/src/assets/audio/ghibli8bit.mp3');
const rumble = new Audio('/src/assets/audio/rumble.mp3');


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
