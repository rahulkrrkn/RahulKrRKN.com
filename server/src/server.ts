// =======================
// Imports
// =======================

import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import { loadEnv } from "./bootstrap/initEnv.js";
import { initServer } from "./bootstrap/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./core/middlewares/errorHandler.mid.js";
// =======================
// App Init
// =======================

const app: Application = express();

// =======================
// Middleware Imports and Use
// =======================

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true); // allow any origin
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(
  express.json({
    strict: true,
    verify: (req: Request, res: Response, buf: Buffer) => {
      try {
        JSON.parse(buf.toString());
      } catch (err) {
        throw new Error("Invalid JSON payload");
      }
    },
  }),
);

// =======================
// Routing Imports
// =======================

import auth from "./auth/app.js";
import gecl from "./gecl/app.js";

// =======================
// Routing Flow
// =======================

// app.use("/app", appRouter);
app.use("/auth", auth);
app.use("/gecl", gecl);

// =======================
// Health / Home Route
// =======================

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <div style="
      font-family: Arial, sans-serif;
      background: #f7f9fc;
      color: #222;
      text-align: center;
      padding: 60px;
    ">
      <h1 style="color: #0078ff;">🛍️ Cartify Customer API</h1> 
      <p style="font-size: 18px;">Welcome to the <strong>Customer Service</strong> of Cartify!</p>
      <p style="color: #555;">Status: <span style="color: green;">Online ✅</span></p>
      <hr style="margin: 25px auto; width: 60%;">
      <p style="font-size: 14px; color: #777;">
        © ${new Date().getFullYear()} Cartify | Powered by Node.js & Express
      </p>
    </div>
  `);
});

// =======================
// Handle 404 (Not Found)
// =======================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message:
      "Oops! The page or resource you’re looking for doesn’t exist. (Server URL)",
  });
});

// =======================
// Handle 500 (Internal Server Error)
// =======================

app.use(errorHandler);

// =======================
// Start Server
// =======================

const PORT: number = Number(process.env.PORT) || 3001;

const startServer = async (): Promise<void> => {
  await initServer();
  app.listen(PORT, () => {
    console.log("✅ Server started at port no :", PORT);
  });
};

startServer();
