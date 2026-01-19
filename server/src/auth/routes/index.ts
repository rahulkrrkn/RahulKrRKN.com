import express, { Router } from "express";
// import { createAuthUser } from "./../models/try.js";

const app: Router = express.Router();

// === === === === ===
// Imports
// === === === === ===

import login from "./login.route.js";
import { refreshAccessToken } from "../controllers/refresh.ctrl.js";

// === === === === ===
// Routes
// === === === === ===
app.use("/login", login);
app.get("/refresh", refreshAccessToken);

export default app;
