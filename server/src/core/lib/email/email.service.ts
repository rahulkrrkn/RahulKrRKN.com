import { getEmailProvider } from "./email.factory.js";

const provider = getEmailProvider();

export const EmailService = {
  async sendRaw(to: string | string[], subject: string, html: string) {
    console.log("Email", "html");
    // console.log("Email", html);

    // await provider.send({ to, subject, html });
  },

  // async sendVerificationEmail(to: string, link: string, name?: string) {
  //   await provider.send({
  //     to,
  //     subject: "Verify your email",
  //     html: verifyEmailTemplate({ link, name }),
  //   });
  // },
};
