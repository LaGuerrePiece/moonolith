const music = new Audio('/audio/theEndOfTheWorld.mp3');
const rumble = new Audio('/audio/rumble.mp3');

music.loop = true;

let muteState = false;
let lastPlayedSound = Date.now();

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

export function playSound(name, limit) {
    if (muteState) return;
    if (lastPlayedSound + limit > Date.now()) return;
    const audio = new Audio('/audio/' + name + '.mp3');
    audio.play();
    lastPlayedSound = Date.now();
}

export function toggleMusic() {
    return music.paused ? music.play() : music.pause();
}

export function playMusic() {
    music.play();
}

export function stopSound(name) {
    const audio = new Audio('/audio/' + name + '.mp3');
    audio.pause();
}

export function toggleRumble() {
    if (muteState) return;
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
