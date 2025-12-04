import prisma from './prisma';

// Elastic Email API configuration
const ELASTICEMAIL_API_URL = 'https://api.elasticemail.com/v2/email/send';
const API_KEY = process.env.ELASTICEMAIL_API_KEY;

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

/**
 * Send email using Elastic Email API
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
    try {
        const fromAddress = from || process.env.EMAIL_FROM || 'HECuPPS <noreply@hecupps.com>';

        if (!API_KEY) {
            throw new Error('ELASTICEMAIL_API_KEY is not configured');
        }

        // Prepare form data for Elastic Email API
        const formData = new URLSearchParams();
        formData.append('apikey', API_KEY);
        formData.append('from', fromAddress);
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('bodyHtml', html);
        formData.append('isTransactional', 'true');

        const response = await fetch(ELASTICEMAIL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error('Elastic Email error:', data);
            throw new Error(`Failed to send email: ${data.error || 'Unknown error'}`);
        }

        console.log('✅ Email sent successfully via Elastic Email:', data.data?.messageid);

        return { success: true, data: data.data };
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

/**
 * Send email using database template with variable replacement
 */
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

// ============================================
// Pre-built email functions for common scenarios
// ============================================

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
    return sendTemplatedEmail({
        templateName: 'welcome',
        variables: { name: userName },
        to: userEmail,
    });
}

/**
 * Send order confirmation email after successful purchase
 */
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

/**
 * Send password reset email with reset link
 */
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

/**
 * Send support reply to customer
 */
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

/**
 * Send order shipping notification
 */
export async function sendShippingNotification(
    customerEmail: string,
    customerName: string,
    orderId: string,
    trackingNumber: string,
    trackingUrl: string
) {
    return sendTemplatedEmail({
        templateName: 'shipping_notification',
        variables: {
            customerName,
            orderId,
            trackingNumber,
            trackingUrl,
        },
        to: customerEmail,
    });
}

/**
 * Send order delivered confirmation
 */
export async function sendDeliveryConfirmation(
    customerEmail: string,
    customerName: string,
    orderId: string
) {
    return sendTemplatedEmail({
        templateName: 'delivery_confirmation',
        variables: {
            customerName,
            orderId,
        },
        to: customerEmail,
    });
}
