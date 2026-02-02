const URL = "model/";

let model, webcam, maxPredictions;

async function init() {
    model = await tmImage.load(
        URL + "model.json",
        URL + "metadata.json"
    );

    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(224, 224, flip);

    await webcam.setup();   // ขอ permission กล้อง
    await webcam.play();    // เริ่มกล้อง

    document.getElementById("webcam").replaceWith(webcam.webcam);

    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let best = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > best.probability) {
            best = prediction[i];
        }
    }

    const percent = (best.probability * 100).toFixed(2);

    const result = document.getElementById("result");
    if (best.className === "Mask") {
        result.innerHTML = `😷 MASK : ${percent}%`;
        result.style.color = "#2e7d32";
    } else {
        result.innerHTML = `❌ NO MASK : ${percent}%`;
        result.style.color = "#c62828";
    }
}

init();
