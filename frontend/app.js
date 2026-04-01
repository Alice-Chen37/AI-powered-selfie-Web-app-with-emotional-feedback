
// Capture 
const captureVideo = document.getElementById('captureVideo');
const captureCanvas = document.getElementById('captureCanvas');
const captureBtn = document.getElementById('captureBtn');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { captureVideo.srcObject = stream; })
  .catch(err => console.error("Capture camera error:", err));

captureBtn.addEventListener('click', async () => {
  const context = captureCanvas.getContext('2d');
  context.drawImage(captureVideo, 0, 0, captureCanvas.width, captureCanvas.height);
  const base64Image = captureCanvas.toDataURL('image/png').split(',')[1];

  const aiData = await analyzeEmotion(base64Image);
  document.getElementById('cConfidence').innerText = `Confidence: ${aiData.confidence}%`;
  document.getElementById('cStress').innerText = `Stress: ${aiData.stress}%`;
  document.getElementById('cEnergy').innerText = `Energy: ${aiData.energy}%`;
  document.getElementById('cSuggestion').innerText = `Suggestion: ${aiData.suggestion}`;
});

// Video realtime
const video = document.getElementById('video');
const videoCanvas = document.getElementById('videoCanvas');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let stream = null;
let realtimeInterval = null;

const historyLength = 30;
const confidenceHistory = [];
const stressHistory = [];
const energyHistory = [];
const timeLabels = [];

// graph
const ctx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: timeLabels,
    datasets: [
      { label: 'Confidence', data: confidenceHistory, borderColor: 'green', fill: false, tension: 0.3 },
      { label: 'Stress', data: stressHistory, borderColor: 'red', fill: false, tension: 0.3 },
      { label: 'Energy', data: energyHistory, borderColor: 'blue', fill: false, tension: 0.3 }
    ]
  },
  options: {
    animation: { duration: 400, easing: 'easeOutQuart' },
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 },
      x: { title: { display: true, text: 'Time (s)' } }
    }
  }
});

// analysis
async function analyzeEmotion(base64) {
  return {
    confidence: Math.floor(Math.random() * 100),
    stress: Math.floor(Math.random() * 100),
    energy: Math.floor(Math.random() * 100),
    suggestion: "Keep smiling! 😄"
  };
}

function updateVideoDisplay(aiData) {
  document.getElementById('vConfidence').innerText = `Confidence: ${aiData.confidence}%`;
  document.getElementById('vStress').innerText = `Stress: ${aiData.stress}%`;
  document.getElementById('vEnergy').innerText = `Energy: ${aiData.energy}%`;
  document.getElementById('vSuggestion').innerText = `Suggestion: ${aiData.suggestion}`;

  const now = new Date().toLocaleTimeString();
  timeLabels.push(now);
  if (timeLabels.length > historyLength) timeLabels.shift();

  confidenceHistory.push(aiData.confidence);
  stressHistory.push(aiData.stress);
  energyHistory.push(aiData.energy);

  if (confidenceHistory.length > historyLength) confidenceHistory.shift();
  if (stressHistory.length > historyLength) stressHistory.shift();
  if (energyHistory.length > historyLength) energyHistory.shift();

  lineChart.update();
}

// open camera
startBtn.addEventListener('click', async () => {
  if (stream) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    startRealtimeRecognition();
  } catch (err) {
    console.error("Video camera error:", err);
  }
});

// close
stopBtn.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  if (realtimeInterval) {
    clearInterval(realtimeInterval);
    realtimeInterval = null;
  }
});

// 1s
function startRealtimeRecognition() {
  const context = videoCanvas.getContext('2d');

  if (realtimeInterval) clearInterval(realtimeInterval);

  realtimeInterval = setInterval(async () => {
    if (!stream) return;
    context.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    const base64Image = videoCanvas.toDataURL('image/png').split(',')[1];

    const aiData = await analyzeEmotion(base64Image);
    updateVideoDisplay(aiData);
  }, 1000);
}