import express from "express";
import cors from "cors";

const app = express();

// middleware
app.use(express());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.json({ message: "you did it!" });
});

// error handling

export default app;
