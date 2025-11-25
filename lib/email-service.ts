import { Resend } from 'resend';
import prisma from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
    try {
        const fromAddress = from || process.env.EMAIL_FROM || 'HECuPPS <noreply@hecupps.com>';

        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Email sending error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email service error:', error);
        throw error;
    }
}

interface EmailTemplateParams {
    templateName: string;
    variables: Record<string, string>;
    to: string;
}

export async function sendTemplatedEmail({ templateName, variables, to }: EmailTemplateParams) {
    try {
        const template = await prisma.emailTemplate.findUnique({
            where: { name: templateName, isActive: true },
        });

        if (!template) {
            throw new Error(`Email template '${templateName}' not found or inactive`);
        }

        // Replace variables in subject and body
        let subject = template.subject;
        let body = template.body;

        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
            body = body.replace(new RegExp(placeholder, 'g'), value);
        });

        return await sendEmail({
            to,
            subject,
            html: body,
        });
    } catch (error) {
        console.error('Template email error:', error);
        throw error;
    }
}

// Pre-built email functions for common scenarios
export async function sendWelcomeEmail(userEmail: string, userName: string) {
    return sendTemplatedEmail({
        templateName: 'welcome',
        variables: { name: userName },
        to: userEmail,
    });
}

export async function sendOrderConfirmationEmail(
    customerEmail: string,
    customerName: string,
    orderId: string,
    totalAmount: string,
    paymentStatus: string
) {
    return sendTemplatedEmail({
        templateName: 'order_confirmation',
        variables: {
            customerName,
            orderId,
            totalAmount,
            paymentStatus,
        },
        to: customerEmail,
    });
}

export async function sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    return sendTemplatedEmail({
        templateName: 'password_reset',
        variables: {
            name: userName,
            resetLink,
        },
        to: userEmail,
    });
}

export async function sendSupportReply(
    userEmail: string,
    userName: string,
    subject: string,
    replyMessage: string
) {
    return sendTemplatedEmail({
        templateName: 'support_reply',
        variables: {
            userName,
            subject,
            replyMessage,
        },
        to: userEmail,
    });
}
