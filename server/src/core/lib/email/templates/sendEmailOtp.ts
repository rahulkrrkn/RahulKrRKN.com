export function otpEmailTemplate(params: {
  brandName?: string;
  logoUrl?: string; // rectangular logo url
  otp: string;
  purpose?: string; // Login / Signup / Reset password
  expiryMinutes?: number;
  supportEmail?: string;
}) {
  const {
    brandName = "RahulKrRKN",
    logoUrl,
    otp,
    purpose = "Verification",
    expiryMinutes = 10,
    supportEmail = "rahulkrrkn@gmail.com",
  } = params;

  return `
    <div style="margin:0;padding:0;background:#020617;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:24px 0;">
        <tr>
          <td align="center">
  
            <!-- Container -->
            <table width="600" cellpadding="0" cellspacing="0"
              style="
                width:600px;max-width:600px;
                background:#020617;
                border:1px solid #1e293b;
                border-radius:14px;
                overflow:hidden;
                font-family:Arial, Helvetica, sans-serif;
                color:#e5e7eb;
              ">
  
              <!-- Header -->
              <tr>
                <td style="padding:22px 22px 16px 22px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left" style="vertical-align:middle;">
                        ${
                          logoUrl
                            ? `
                            <img
                              src="${logoUrl}"
                              alt="${brandName} Logo"
                              style="
                                height:42px;
                                width:auto;
                                display:block;
                                border-radius:8px;
                                border:1px solid #1e293b;
                              "
                            />
                          `
                            : `
                            <div style="
                              display:inline-block;
                              padding:10px 14px;
                              border-radius:10px;
                              background:#0f172a;
                              border:1px solid #1e293b;
                              color:#e5e7eb;
                              font-weight:700;
                              letter-spacing:0.2px;
                            ">
                              ${brandName}
                            </div>
                          `
                        }
                      </td>
  
                      <td align="right" style="vertical-align:middle;">
                        <span style="
                          display:inline-block;
                          padding:6px 10px;
                          border-radius:999px;
                          background:rgba(118,24,241,0.15);
                          border:1px solid rgba(118,24,241,0.35);
                          color:#e5e7eb;
                          font-size:12px;
                        ">
                          ${purpose}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
  
              <!-- Divider -->
              <tr>
                <td style="padding:0 22px;">
                  <div style="height:1px;background:#1e293b;"></div>
                </td>
              </tr>
  
              <!-- Body -->
              <tr>
                <td style="padding:22px;">
                  <h1 style="
                    margin:0 0 10px 0;
                    font-size:22px;
                    line-height:1.3;
                    color:#e5e7eb;
                  ">
                    Your OTP Code
                  </h1>
  
                  <p style="
                    margin:0 0 16px 0;
                    font-size:14px;
                    line-height:1.6;
                    color:#94a3b8;
                  ">
                    Use the OTP below to complete your <b style="color:#e5e7eb;">${purpose}</b>.
                    This code will expire in <b style="color:#e5e7eb;">${expiryMinutes} minutes</b>.
                  </p>
  
                  <!-- OTP Box -->
                  <div style="
                    margin:18px 0;
                    padding:18px;
                    border-radius:12px;
                    background:#0f172a;
                    border:1px solid #1e293b;
                    text-align:center;
                  ">
                    <div style="
                      font-size:12px;
                      letter-spacing:0.8px;
                      color:#94a3b8;
                      margin-bottom:10px;
                      text-transform:uppercase;
                    ">
                      One Time Password
                    </div>
  
                    <div style="
                      display:inline-block;
                      padding:12px 18px;
                      border-radius:12px;
                      background:rgba(118,24,241,0.14);
                      border:1px solid rgba(118,24,241,0.45);
                      font-size:28px;
                      font-weight:800;
                      letter-spacing:6px;
                      color:#e5e7eb;
                    ">
                      ${otp}
                    </div>
                  </div>
  
                  <p style="
                    margin:0;
                    font-size:13px;
                    line-height:1.6;
                    color:#94a3b8;
                  ">
                    If you didn’t request this OTP, you can safely ignore this email.
                  </p>
  
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td style="padding:0 22px 22px 22px;">
                  <div style="height:1px;background:#1e293b;margin-bottom:14px;"></div>
  
                  <p style="
                    margin:0;
                    font-size:12px;
                    line-height:1.6;
                    color:#94a3b8;
                  ">
                    Need help? Contact us at
                    <a href="mailto:${supportEmail}" style="color:#38bdf8;text-decoration:none;">
                      ${supportEmail}
                    </a>
                  </p>
  
                  <p style="
                    margin:8px 0 0 0;
                    font-size:12px;
                    line-height:1.6;
                    color:#94a3b8;
                  ">
                    © ${new Date().getFullYear()} ${brandName}. All rights reserved.
                  </p>
                </td>
              </tr>
  
            </table>
            <!-- /Container -->
  
          </td>
        </tr>
      </table>
    </div>
    `;
}
