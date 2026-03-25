# AI-Powered Selfie App with Emotional Feedback

A demo web app that uses your webcam to capture selfies or video, analyzes emotions with AI, and displays real-time feedback including Confidence, Stress, Energy, and simple suggestions.

---

## Features

- Take selfies or short video clips via webcam
- AI analyzes emotion and outputs:
  - **Confidence** (%)
  - **Stress** (%)
  - **Energy** (%)
  - **Suggestion** (motivational text)
- Real-time feedback visualization
- Supports simulated data or OpenAI GPT API

---

## Tech Stack

- **Frontend**: HTML + JavaScript + Webcam API
- **Backend**: Node.js + Express + node-fetch + dotenv + cors
- **AI**: OpenAI GPT-4o-mini or simulated random data
- **Visualization**: Live display and bar charts

---

## Quick Start

1. **Clone the project**:

```bash
git clone <repo-url>
cd "AI-powered selfie app with emotional feedback"


Run:
Run backend server:

node server.cjs


Server runs at http://localhost:3000

Open frontend:

Open frontend/index.html with VS Code Live Server or browser

Allow webcam access

Click Capture to see emotion analysis