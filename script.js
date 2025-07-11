const imageInput = document.getElementById('imageInput');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let image = new Image();
let imageLoaded = false;

// Only load once
imageInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    image.onload = () => {
      imageLoaded = true;
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function drawMeme() {
  if (!imageLoaded) {
    alert("Please upload an image first.");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw image centered with aspect ratio
  let ratio = Math.min(canvas.width / image.width, canvas.height / image.height);
  let newWidth = image.width * ratio;
  let newHeight = image.height * ratio;
  let x = (canvas.width - newWidth) / 2;
  let y = (canvas.height - newHeight) / 2;
  ctx.drawImage(image, x, y, newWidth, newHeight);

  const fontSize = Math.floor(canvas.height / 10);
  ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = fontSize / 10;
  ctx.fillStyle = 'white';

  if (topText.value.trim()) {
    drawWrappedText(topText.value.toUpperCase(), canvas.width / 2, fontSize, 'top');
  }
  if (bottomText.value.trim()) {
    drawWrappedText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2, 'bottom');
  }
}

function drawWrappedText(text, x, y, position) {
  const maxWidth = canvas.width - 40;
  const lines = wrapText(ctx, text, maxWidth);
  lines.forEach((line, i) => {
    const lineHeight = ctx.measureText('M').width * 1.2;
    let lineY = position === 'top' ? y + i * lineHeight : y - (lines.length - i - 1) * lineHeight;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  let lines = [], line = '';

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let testWidth = context.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

// EVENT: Generate Meme on click only
generateBtn.addEventListener('click', drawMeme);

// EVENT: Download Meme
downloadBtn.addEventListener('click', function () {
  if (!imageLoaded) return;
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
