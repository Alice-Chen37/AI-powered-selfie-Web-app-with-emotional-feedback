// Node.js + Express 后端 / CommonJS
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());

// 配置：是否使用真实 OpenAI API
const USE_OPENAI = false; // ✅ false = 用模拟数据测试前端, true = 调用 OpenAI

app.post("/analyze", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      confidence: 0,
      stress: 0,
      energy: 0,
      suggestion: "未提供图像"
    });
  }

  try {
    if (!USE_OPENAI) {
      // 模拟数据，前端测试稳定显示
      const aiData = {
        confidence: Math.floor(Math.random() * 100),
        stress: Math.floor(Math.random() * 100),
        energy: Math.floor(Math.random() * 100),
        suggestion: "Don't be nervous， keep smiling！"
      };
      return res.json(aiData);
    }

    // --------- Real OpenAI 调用 ---------
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
        temperature: 0  // 保证返回更干净
      })
    });

    const data = await response.json();
    const rawText = data.choices[0].message.content;

    // 尝试解析 JSON
    let aiData;
    try {
      aiData = JSON.parse(rawText);
    } catch (err) {
      console.error("解析 JSON 失败，返回默认值:", rawText);
      aiData = {
        confidence: 0,
        stress: 0,
        energy: 0,
        suggestion: "无法解析情绪，请重试"
      };
    }

    res.json(aiData);

  } catch (err) {
    console.error("服务器出错:", err);
    res.status(500).json({
      confidence: 0,
      stress: 0,
      energy: 0,
      suggestion: "AI 调用失败，请重试"
    });
  }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
