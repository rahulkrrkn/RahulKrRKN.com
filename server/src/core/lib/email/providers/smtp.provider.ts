import nodemailer from "nodemailer";
import type { EmailProvider, EmailSendInput } from "../email.types.js";
import { EmailConfig } from "../email.config.js";

export class SmtpEmailProvider implements EmailProvider {
  private transporter = nodemailer.createTransport({
    host: EmailConfig.smtp.host,
    port: EmailConfig.smtp.port,
    secure: EmailConfig.smtp.secure,
    auth: {
      user: EmailConfig.smtp.user,
      pass: EmailConfig.smtp.pass,
    },
  });

  async send(input: EmailSendInput): Promise<void> {
    await this.transporter.sendMail({
      from: `"${EmailConfig.fromName}" <${EmailConfig.fromEmail}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  }
}
