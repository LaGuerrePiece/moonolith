export function playSound(name) {
    const audio = new Audio('/src/assets/audio/' + name + '.mp3');
    audio.play();
}
