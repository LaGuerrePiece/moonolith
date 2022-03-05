
function fetchImgur(url) {
    return fetch(url)
        .then(res => res.blob())
        .then(blob => blob.arrayBuffer())
}

export {
    fetchImgur
}