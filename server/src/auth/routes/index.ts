import express, { Router } from "express";
// import { createAuthUser } from "./../models/try.js";

const app: Router = express.Router();

// === === === === ===
// Imports
// === === === === ===

import login from "./login.route.js";

// === === === === ===
// Routes
// === === === === ===
app.use("/login", login);

export default app;
