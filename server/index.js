const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.post("/api/request", async (req, res) => {
    const { url, method, headers, body } = req.body;
    console.log("Received request to proxy:", { url, method, headers, body });

  try {
    const response = await axios({
      url,
      method,
      headers,
      data: body,
    });

    res.json({
      status: response.status,
      data: response.data,
    });
  } catch (error) {
    // Return the actual status code from the external API
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: error.message,
      details: error.response?.data,
      status: error.response?.status,
    });
  }
});

app.listen(3002, () => console.log("Server running on 3002"));