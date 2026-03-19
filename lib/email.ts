import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY || 're_mock_key');
const fromEmail = process.env.FROM_EMAIL || 'noreply@hecupps.com';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
  if (process.env.EMAIL_PROVIDER === 'resend') {
    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed.');
    }
  } else {
    console.log('Email provider not configured. Mocking email send.');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`HTML: ${html}`);
  }
};
