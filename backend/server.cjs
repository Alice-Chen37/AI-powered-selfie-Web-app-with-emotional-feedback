// Node.js + Express 
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());

// OpenAI API
const USE_OPENAI = false; // 

app.post("/analyze", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      confidence: 0,
      stress: 0,
      energy: 0,
      suggestion: "No image"
    });
  }

  try {
    if (!USE_OPENAI) {
      const aiData = {
        confidence: Math.floor(Math.random() * 100),
        stress: Math.floor(Math.random() * 100),
        energy: Math.floor(Math.random() * 100),
        suggestion: "Don't be nervous， keep smiling！"
      };
      return res.json(aiData);
    }

    // --------- Real OpenAI ---------
    const prompt = `
请严格只返回纯 JSON，不要包含任何文字说明或换行。
JSON 格式如下：
{
  "confidence": 0~100,
  "stress": 0~100,
  "energy": 0~100,
  "suggestion": "鼓励性文字"
}
图片 base64: ${imageBase64}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0  
      })
    });

    const data = await response.json();
    const rawText = data.choices[0].message.content;

    let aiData;
    try {
      aiData = JSON.parse(rawText);
    } catch (err) {
      console.error("Analysis JSON parsing failed, using default values:", rawText);
      aiData = {
        confidence: 0,
        stress: 0,
        energy: 0,
        suggestion: "Please try again"
      };
    }

    res.json(aiData);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({
      confidence: 0,
      stress: 0,
      energy: 0,
      suggestion: "AI failed, Please try again"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));