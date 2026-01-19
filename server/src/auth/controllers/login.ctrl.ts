import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../core/helpers/response.helper.js";
import { emailNormalization } from "../../core/utils/index.js";
import { sendEmailOtp } from "../../core/lib/email/senders/auth.emails.js";
import { saveOtp, verifyOtp } from "../../core/services/otpRedis.service.js";
import {
  getAuthUserFindConn,
  getAuthUserFUIConn,
} from "./../models/auth_User.model.js";
import { makeUserLogin } from "../services/makeUserLogin.service.js";

// import { sendSmsOtp } from "../../core/modules/sms/senders/auth.sms.js"; // if you have SMS module

// import { UserModel } from "../../core/modules/user/user.model.js";
// import { signAccessToken } from "../../core/modules/auth/jwt.util.js";

// ==============================
//  ✅ SEND OTP (EMAIL)
// ==============================

export const emailSendOtp = async (req: Request, res: Response) => {
  const rawEmail = req?.validatedBody?.email?.toLowerCase().trim();

  if (!rawEmail)
    return sendError(res, "Email is required", {
      status: 400,
      code: "INVALID_EMAIL",
    });

  const email = emailNormalization(rawEmail);

  if (!email)
    return sendError(res, "Invalid email", {
      status: 400,
      code: "INVALID_EMAIL",
    });

  const otp = "123456";
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await saveOtp({
    channel: "email",
    identifier: email,
    otp,
    purpose: "AUTH",
    ttlSeconds: 300,
    maxAttempts: 5,
  });
  await sendEmailOtp(email, otp);

  return sendSuccess(res, "OTP sent successfully", { email });
};

// ==============================
// ✅ VERIFY OTP (EMAIL) → LOGIN/REGISTER
// ==============================
export const emailVerifyOtp = async (req: Request, res: Response) => {
  const rawEmail = req?.validatedBody?.email?.toLowerCase().trim();
  const otp = req?.validatedBody?.otp?.trim();

  if (!rawEmail || !otp) {
    return sendError(res, "Email and OTP are required", {
      status: 400,
      code: "INVALID_INPUT",
    });
  }

  const email = emailNormalization(rawEmail);

  if (!email) {
    return sendError(res, "Invalid email", {
      status: 400,
      code: "INVALID_EMAIL",
    });
  }

  const result = await verifyOtp({
    channel: "email",
    identifier: email,
    otp,
    purpose: "AUTH",
  });

  if (!result.ok) {
    return sendError(res, "OTP verification failed", {
      status: 400,
      code: result.reason,
    });
  }

  const User_FUI = await getAuthUserFUIConn();

  // IMPORTANT: if you use create() then don't use .lean() after
  let user = await User_FUI.findOne({ email }).lean();
  let isNewUser = false;

  if (!user) {
    const created = await User_FUI.create({ email });
    user = created.toObject(); // convert to plain object
    isNewUser = true;
  }

  // FIX: user._id can be ObjectId, convert to string safely
  if (!user?._id) {
    return sendError(res, "User ID not found", {
      status: 500,
      code: "NO_USER_ID",
    });
  }

  const loginResult = await makeUserLogin({
    userId: user._id.toString(),
    email,
    res,
    req,
  });

  if (!loginResult.ok) {
    return sendError(res, "Login failed", {
      status: 401,
      code: loginResult.code,
    });
  }

  // access token comes from res.publicData.accessToken (your system)
  // const accessToken = (res as any).publicData?.accessToken;

  return sendSuccess(
    res,
    isNewUser ? "Registered successfully" : "Logged in successfully",
    {
      isNewUser,
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    },
  );
};

// ==============================
// ✅ SEND OTP (MOBILE)
// Note: need to implement sendSmsOtp()
// ==============================
export const mobileSendOtp = async (req: Request, res: Response) => {
  const rawMobile = req?.validatedBody?.mobile?.trim();

  if (!rawMobile)
    return sendError(res, "Mobile number is required", {
      status: 400,
      code: "INVALID_MOBILE",
    });

  // You should normalize/validate mobile number properly
  const mobile = rawMobile;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await saveOtp({
    channel: "mobile",
    identifier: mobile,
    otp,
    purpose: "AUTH",
    ttlSeconds: 300,
    maxAttempts: 5,
  });

  // await sendSmsOtp(mobile, otp);

  return sendSuccess(res, "OTP sent successfully", { mobile });
};

// ==============================
// ✅ VERIFY OTP (MOBILE) → LOGIN/REGISTER
// ==============================
export const mobileVerifyOtp = async (req: Request, res: Response) => {
  const rawMobile = req?.validatedBody?.mobile?.trim();
  const otp = req?.validatedBody?.otp?.trim();

  if (!rawMobile || !otp)
    return sendError(res, "Mobile and OTP are required", {
      status: 400,
      code: "INVALID_INPUT",
    });

  const mobile = rawMobile;

  const result = await verifyOtp({
    channel: "mobile",
    identifier: mobile,
    otp,
    purpose: "AUTH",
  });

  if (!result.ok) {
    return sendError(res, "OTP verification failed", {
      status: 400,
      code: result.reason,
    });
  }

  // If you store mobile in user schema, use { mobile }
  // For now, you can store mobile in email field or create new schema field

  const User_FUI = await getAuthUserFUIConn();
  let user = await User_FUI.findOne({ mobile });
  let isNewUser = false;

  if (!user) {
    user = await User_FUI.create({ mobile });
    isNewUser = true;
  }

  const token = {
    userId: user._id,
    mobile,
  };
  // const token = signAccessToken({
  //   userId: user._id,
  //   mobile,
  // });
  return sendSuccess(
    res,
    isNewUser ? "Registered successfully" : "Logged in successfully",
    {
      isNewUser,
      token,
      user: {
        id: user._id,
        mobile,
      },
    },
  );
};
