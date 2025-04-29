import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRoute from "./routes/api.route";
import dotenv from "dotenv";

dotenv.config();

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;
const allowedOrigin = [
  "http://localhost:3000",
  "http://192.168.18.159",
  "localhost:3000",
  "192.168.18.159",
  "localhost:5173",
];
const allowedMethods = ["GET", "POST", "PUT"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: allowedMethods,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api", apiRoute);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
