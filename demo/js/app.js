function filter(imageData) {
    const bufferPointerIn = 1024,
        {data, width, height} = imageData,
        bufferIn = new Uint8Array(wasmModule.memory.buffer, bufferPointerIn, width * height * 4),
        bufferPointerOut = 2048 + width * height * 4,
        bufferOut = new Uint8Array(wasmModule.memory.buffer, bufferPointerOut, width * height * 4);

    bufferIn.set(data);
    wasmModule.outline_c(bufferPointerIn, bufferPointerOut, width, height, document.getElementById('slider1').value, document.getElementById('slider2').value);
    data.set(bufferOut);
    return data;
}

function renderSource(source, destination) {
    const context = destination.getContext('2d');
    context.drawImage(source, 0, 0, destination.width, destination.height);

    const imageData = context.getImageData(0, 0, destination.width, destination.height);
    imageData.data.set(filter(imageData));
    context.putImageData(imageData, 0, 0);

    requestAnimationFrame(_ => renderSource(source, destination));
}

async function main() {
    const video = document.createElement('video'),
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });


    wasmModule = await compileWASM('c/filter.c', false, {
        debug: msg => console.log(msg)
    });

    video.setAttribute(`width`, 640);
    video.setAttribute(`height`, 480);
    video.setAttribute(`src`, URL.createObjectURL(stream));
    video.play();

    const image = document.querySelector('#image');
    requestAnimationFrame(_ => renderSource(video, image));
}

let wasmModule;
main()
    .catch(console.error);