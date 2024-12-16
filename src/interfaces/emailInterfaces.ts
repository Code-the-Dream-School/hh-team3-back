
export interface SendEmailParams {
  toEmail: string;
  subject: string;
  textContent?: string;
  htmlContent?: string;
}

export interface IClientParams {
  apiKey: string | undefined;
  apiSecret: string | undefined;
}