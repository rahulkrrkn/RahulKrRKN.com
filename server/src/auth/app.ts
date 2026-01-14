import express, { Router } from "express";
import router from "./routes/index.js";

const app: Router = express.Router();

app.use(router);

export default app;
