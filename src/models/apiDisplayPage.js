export function createApiDisplayPage(dataToDisplay, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    let myImageData = ctx.createImageData(width, height);
    console.log('myImageData', myImageData);
    myImageData.data.set(dataToDisplay);
    ctx.putImageData(myImageData, 0, 0);

    // Render well
    canvas.style.imageRendering = 'pixelated';
    canvas.style.width = '50%';
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%,-50%)';
}
