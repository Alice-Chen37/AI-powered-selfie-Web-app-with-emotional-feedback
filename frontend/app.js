const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');

//  Init camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream; })
  .catch(err => console.error(err));

// Chart.js / Init chart
const ctx = document.getElementById('barChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Confidence', 'Stress', 'Energy'],
    datasets: [{
      label: 'Emotion Scores',
      data: [0, 0, 0],
      backgroundColor: ['green','red','blue']
    }]
  },
  options: { scales: { y: { beginAtZero: true, max: 100 } } }
});

//Click Capture
snap.addEventListener('click', async () => {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64Image = canvas.toDataURL('image/png').split(',')[1];
  const aiData = await analyzeEmotion(base64Image);

  document.getElementById('confidence').innerText = `Confidence: ${aiData.confidence}%`;
  document.getElementById('stress').innerText = `Stress: ${aiData.stress}%`;
  document.getElementById('energy').innerText = `Energy: ${aiData.energy}%`;
  document.getElementById('suggestion').innerText = `Suggestion: ${aiData.suggestion}`;

  chart.data.datasets[0].data = [aiData.confidence, aiData.stress, aiData.energy];
  chart.update();
});

// Call backend
async function analyzeEmotion(base64) {
  const response = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64 })
  });
  return await response.json();
}
