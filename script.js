const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const coverFileInput = document.getElementById("cover-file");
const hardInput = document.getElementById("hard");
const randomBackgroundInput = document.getElementById("random-background");
const songNameInput = document.getElementById("song-name");
const songArtistInput = document.getElementById("song-artist");
const downloadButton = document.getElementById("download");
let isBili = true;
let coverUrl = "";

startButton.addEventListener("click", draw);
window.addEventListener("load", function () {
    coverFileInput.disabled = false;
    drawPlaceholder();
});
coverFileInput.addEventListener("change", readCover);
downloadButton.addEventListener("click", download);

tierColor = [
    "rgb(255,255,255)",//0
    "rgb(128,128,255)",
    "rgb(128,128,255)",
    "rgb(128,128,255)",
    "rgb(128,128,255)",
    "rgb(128,128,255)",//5
    "rgb(255,255,128)",
    "rgb(255,255,128)",
    "rgb(255,255,128)",
    "rgb(255,255,128)",
    "rgb(255,255,128)",//10
    "rgb(255,128,128)",
    "rgb(255,128,128)",
    "rgb(255,128,128)",
    "rgb(255,128,128)",
    "rgb(255,128,128)",//15
    "rgb(255,128,255)",
    "rgb(255,128,255)",
    "rgb(255,128,255)",
    "rgb(255,128,255)",
    "rgb(255,128,255)",//20
    "rgb(26,26,26)",
    "rgb(26,26,26)",
    "rgb(26,26,26)",
    "rgb(26,26,26)",
    "rgb(26,26,26)",//25
    "rgb(26,26,26)"
];

function setIsBili(value) {
    isBili = value;
    resizeCanvas();
}

function resizeCanvas() {
    canvas.width = isBili ? 1146 : 1920;
    canvas.height = isBili ? 717 : 1080;
    drawPlaceholder();
}

function drawPlaceholder() {
    ctx.fillStyle = "#d3d3d3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#1f1e33";
    ctx.font = "80px Arial";
    ctx.fillText(getPlaceholderText(document.documentElement.lang), canvas.width / 2, canvas.height / 2);
}

function getPlaceholderText(lang) {
    switch (lang) {
        case "zh":
            return "准备完毕，等待上传…";
        case "en":
            return "End for preparation, waiting…";
        case "ja":
            return "準備完了、アップロード待ち";
        default:
            return "End for preparation, waiting…";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (randomBackgroundInput.checked) drawBackgroundA();
    else drawBackground();
}

function drawBackground() {
    let backgroundImage = new Image();
    backgroundImage.src = "./res/Nebula Blue " + (isBili ? "1146x717" : "1920x1080") + ".png";
    backgroundImage.onload = function () {
        ctx.drawImage(backgroundImage, 0, 0);
        drawTopTitleMask();
    }
}

function drawBackgroundA() {
    let backgroundImage = new Image();
    backgroundImage.src = "./res/Nebula Blue.png";
    backgroundImage.onload = function () {
        let finalBackgroundImage = new Image();
        finalBackgroundImage.src = clipImage(backgroundImage, randomInt(backgroundImage.width - canvas.width + 1), randomInt(backgroundImage.height - canvas.height + 1), canvas.width, canvas.height)
        finalBackgroundImage.onload = function() {
            ctx.drawImage(finalBackgroundImage, 0, 0);
            drawTopTitleMask();
        }
    }
}

function drawTopTitleMask() {
    let height = (isBili ? 100 : 150);
    let topTitleMaskCanvas = document.createElement("canvas");
    topTitleMaskCanvas.height = height;
    topTitleMaskCanvas.width = canvas.width;
    let ctx1 = topTitleMaskCanvas.getContext("2d");
    ctx1.fillStyle = "rgba(255, 255, 255, " + 16 / 255.0 + ")";
    ctx1.fillRect(0, 0, topTitleMaskCanvas.width, topTitleMaskCanvas.height);
    let topTitleMaskImage = new Image();
    topTitleMaskImage.src = topTitleMaskCanvas.toDataURL("image/png");
    topTitleMaskImage.onload = function() {
        ctx.drawImage(topTitleMaskImage, 0, 0);
        topTitleMaskCanvas.remove();
        drawTopTitle(height);
    }
}

function drawTopTitle(maskHeight) {
    let topTitleCanvas = document.createElement("canvas");
    topTitleCanvas.width = canvas.width;
    topTitleCanvas.height = maskHeight;
    let ctx1 = topTitleCanvas.getContext("2d");
    ctx1.textBaseline = "middle";
    ctx1.font = (isBili ? 50 : 80) + "px Arial";
    ctx1.strokeStyle = "#FFF";
    ctx1.strokeText("DR3 Fanmade", isBili ? 50 : 75, topTitleCanvas.height / 2);
    let topTitleImage = new Image();
    topTitleImage.src = topTitleCanvas.toDataURL("image/png");
    topTitleImage.onload = function() {
        ctx.drawImage(topTitleImage, 0, 0);
        topTitleCanvas.remove();
        drawHard(maskHeight);
    }
}

function drawHard(maskHeight) {
    let hard = parseInt(hardInput.value);
    let hardCanvas = document.createElement("canvas");
    hardCanvas.height = maskHeight;
    hardCanvas.width = canvas.width;
    let ctx1 = hardCanvas.getContext("2d");
    ctx1.font = (isBili ? 50 : 80) + "px Arial";
    ctx1.textBaseline = "middle";
    let text = "Tier " + ((hard === 0 || isNaN(hard)) ? "?" : hard);
    if (hard > 20 || hard < 0) {
        ctx1.save();
        ctx1.fillStyle = "rgba(255, 255, 255, " + 111/255 + ")";
        ctx1.fillRect(hardCanvas.width - ctx1.measureText(text).width - (isBili ? 50 : 125) - 5, (hardCanvas.height - (isBili ? 50 : 80)) / 2 - 5, ctx1.measureText(text).width + 5, (isBili ? 50 : 80) + 5);
    }
    ctx1.fillStyle = getHardColor(hard);
    ctx1.fillText(text, hardCanvas.width - ctx1.measureText(text).width - (isBili ? 50 : 125), hardCanvas.height / 2);
    let hardImage = new Image();
    hardImage.src = hardCanvas.toDataURL("image/png");
    hardImage.onload = function() {
        ctx.drawImage(hardImage, 0, 0);
        hardCanvas.remove();
        drawCoverBackground();
    }
}

function drawCoverBackground() {
    let coverBackgroundCanvas = document.createElement("canvas");
    coverBackgroundCanvas.width = canvas.width;
    coverBackgroundCanvas.height = canvas.height;
    let ctx1 = coverBackgroundCanvas.getContext("2d");
    let side = isBili ? 300 : 500;
    let yOffset = isBili ? 50 : 75;
    let coverBackgroundImage = new Image();
    coverBackgroundImage.src = "./res/CoverBackground " + side + "x" + side + ".png";
    coverBackgroundImage.onload = function () {
        ctx1.drawImage(coverBackgroundImage, (coverBackgroundCanvas.width - coverBackgroundImage.width) / 2, (coverBackgroundCanvas.height - coverBackgroundImage.height) / 2 - yOffset);
        let finalCoverBackgroundImage = new Image();
        finalCoverBackgroundImage.src = coverBackgroundCanvas.toDataURL("image/png");
        finalCoverBackgroundImage.onload = function() {
            ctx.drawImage(finalCoverBackgroundImage, 0, 0);
            coverBackgroundCanvas.remove();
            drawCover(side, yOffset, coverBackgroundImage.height + (coverBackgroundCanvas.height - coverBackgroundImage.height) / 2 - yOffset);
        }
    }
}

function drawCover(side, yOffset, maskBottom) {
    let coverCanvas = document.createElement("canvas");
    coverCanvas.width = canvas.width;
    coverCanvas.height = canvas.height;
    let ctx1 = coverCanvas.getContext("2d");
    if (coverUrl !== "") {
        let coverImage = new Image();
        coverImage.src = coverUrl;
        coverImage.onload = function () {
            ctx1.drawImage(coverImage, (coverCanvas.width - side) / 2, (coverCanvas.height - side) / 2 - yOffset, side, side);
            let finalCoverImage = new Image();
            finalCoverImage.src = coverCanvas.toDataURL("image/png");
            finalCoverImage.onload = function() {
                ctx.drawImage(finalCoverImage, 0, 0);
                final(maskBottom, coverCanvas);
            }
        }
    } else {
        final(maskBottom, coverCanvas);
    }
}

function final(maskBottom, coverCanvas) {
    coverCanvas.remove();
    drawText(maskBottom);
}

function drawText(maskBottom) {
    let textCanvas = document.createElement("canvas");
    textCanvas.height = canvas.height;
    textCanvas.width = canvas.width;
    let ctx1 = textCanvas.getContext("2d");
    let titleSize = (isBili ? 45 : 75);
    ctx1.font = titleSize + "px Arial";
    ctx1.fillStyle = "#FFF";
    ctx1.textAlign = "center";
    let titleY = maskBottom + 10 + titleSize / 2 + (isBili ? 50 : 75);
    ctx1.fillText(songNameInput.value, textCanvas.width / 2, titleY);
    ctx1.save();
    let artistSize = (isBili ? 35 : 65);
    ctx1.font = artistSize + "px Arial";
    ctx1.fillText("by " + songArtistInput.value, textCanvas.width / 2, titleY + titleSize + (isBili ? 5 : 10))
    let textImage = new Image();
    textImage.src = textCanvas.toDataURL("image/png");
    textImage.onload = function() {
        ctx.drawImage(textImage, 0, 0);
        textCanvas.remove();
    }
}

function readCover() {
    let fileReader = new FileReader();
    if (coverFileInput.files.length < 1) return;
    let file = coverFileInput.files[0];
    fileReader.readAsDataURL(file);
    if (fileReader.error) {
        setError('错误：无法读取文件', "cover-message");
        return;
    }
    fileReader.onprogress = progress => {
        const size = file.size;
        setLog("读取进度：" + Math.floor(progress.loaded / size * 100) + "%", "cover-message");
    };
    fileReader.onloadend = function readEnd() {
        setLog("读取完毕！", "cover-message");
        coverUrl = fileReader.result.substring(0);
        coverFileInput.disabled = true;
    };
}

function setLog(msg, id) {
    let msgBox = document.getElementById(id);
    msgBox.style.color = "black";
    msgBox.innerHTML = msg;
}

function setError(msg, id) {
    let msgBox = document.getElementById(id);
    msgBox.style.color = "red";
    msgBox.innerHTML = msg;
}

function getHardColor(hard) {
    if (isNaN(hard)) return tierColor[0];
    else if (hard > 26 || hard < 0) return tierColor[26];
    else return tierColor[hard];
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function clipImage(img, x, y, width, height) {
    let cvs = document.createElement("canvas");
    cvs.width = width;
    cvs.height = height;

    let ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0 - x, 0 - y);
    return cvs.toDataURL();
}

function download() {
    const downloadElement = document.createElement("a");
    downloadElement.download = "歌曲封面_" + songNameInput.value + " by " + songArtistInput.value;
    downloadElement.href = canvas.toDataURL("image/png");
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
}