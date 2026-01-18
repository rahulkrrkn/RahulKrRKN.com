export const EmailConfig = {
  provider: process.env.MAIL_PROVIDER || "smtp",

  fromName: process.env.MAIL_FROM_NAME || "RahulKrRKN",
  fromEmail: process.env.MAIL_FROM_EMAIL || "rahulkrrkn@gmail.com",

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: (process.env.SMTP_SECURE || "false") === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

export function assertEmailConfig() {
  if (EmailConfig.provider === "smtp") {
    const { host, user, pass } = EmailConfig.smtp;
    if (!host) throw new Error("SMTP_HOST is missing");
    if (!user) throw new Error("SMTP_USER is missing");
    if (!pass) throw new Error("SMTP_PASS is missing");
  }
}
