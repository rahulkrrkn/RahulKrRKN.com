export type EmailSendInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export interface EmailProvider {
  send(input: EmailSendInput): Promise<void>;
}
