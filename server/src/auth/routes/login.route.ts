import { Router } from "express";

import { validateBody } from "./../../core/middlewares/validateBody.mid.js";

import { login } from "../validations/index.js";

import {
  emailSendOtp,
  emailVerifyOtp,
  // loginWithPassword,
  // loginWithGoogleAccount,
} from "../controllers/login.ctrl.js";

const app = Router();

/* ================= ROUTES ================= */

// app.post("/email",  emailSendOtp);
app.post("/email", validateBody(login.emailSendOtp), emailSendOtp);

app.post("/email/verify", validateBody(login.emailVerifyOtp), emailVerifyOtp);

// app.post("/password", validateBody(login.loginWithPassword), loginWithPassword);

// app.post(
//   "/google",
//   validateBody(login.loginWithGoogleAccount),
//   loginWithGoogleAccount
// );

export default app;
