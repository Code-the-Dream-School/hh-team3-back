declare module "node-mailjet" {
  interface MailjetResponse {
    body: any;
  }

  interface MailjetMessage {
    From: {
      Email: string;
      Name: string;
    };
    To: Array<{ Email: string }>;
    Subject: string;
    TextPart: string;
  }

  interface EmailParams {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    subject: string;
    textContent: string;
  }

  export function connect(
    apiKey: string,
    apiSecret: string
  ): {
    post: (
      endpoint: string,
      options: { version: string }
    ) => {
      request: (data: any) => Promise<MailjetResponse>;
    };
  };
}
