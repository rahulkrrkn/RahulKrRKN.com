import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import { validateBody } from "./../../core/middlewares/validateBody.mid.js";

import { login } from "../validations/index.js";

import {
  sendEmailOtp,
  // verifyEmailOtp,
  // loginWithPassword,
  // loginWithGoogleAccount,
} from "../controllers/login.ctrl.js";

const app = Router();

/* ================= ROUTES ================= */

// app.post("/email",  sendEmailOtp);
app.post("/email", validateBody(login.sendEmailOtp), sendEmailOtp);

// app.post("/email/verify", validateBody(login.verifyEmailOtp), verifyEmailOtp);

// app.post("/password", validateBody(login.loginWithPassword), loginWithPassword);

// app.post(
//   "/google",
//   validateBody(login.loginWithGoogleAccount),
//   loginWithGoogleAccount
// );

export default app;
