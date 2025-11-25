import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Super Admin
    const hashedPassword = await bcrypt.hash('HECCUPPs1786.admin.admin', 10);

    const superAdmin = await prisma.admin.upsert({
        where: { username: 'HECUPPS.main.admin' },
        update: {},
        create: {
            username: 'HECUPPS.main.admin',
            email: 'admin@hecupps.com',
            password: hashedPassword,
            role: 'SuperAdmin',
            status: 'Active',
        },
    });

    console.log('✅ Super Admin created:', superAdmin.username);

    // Create default site settings
    const siteSettings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            siteName: 'HECuPPS',
            footerText: 'Premium Gift Hampers - Curated Luxury, Wrapped with Love',
            currency: 'INR',
            taxRate: 0,
            contactEmail: 'contact@hecupps.com',
            instagramUrl: 'https://instagram.com/hecupps',
            maintenanceMode: false,
            allowSignups: true,
        },
    });

    console.log('✅ Site settings created');

    // Create default payment settings (all disabled)
    const paymentSettings = await prisma.paymentSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            razorpayEnabled: false,
            stripeEnabled: false,
            paypalEnabled: false,
            interacEnabled: false,
        },
    });

    console.log('✅ Payment settings created (all gateways disabled by default)');

    // Create default FAQ items
    const faqs = [
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including credit/debit cards, UPI, and net banking through secure payment gateways. For customers in Canada, we accept Stripe payments.',
            category: 'Payment',
            order: 1,
        },
        {
            question: 'How long does delivery take?',
            answer: 'Delivery typically takes 3-5 business days within India and 7-10 business days for international orders. Express shipping options are available for urgent deliveries.',
            category: 'Shipping',
            order: 2,
        },
        {
            question: 'Can I customize my gift hamper?',
            answer: 'Yes! We offer customization options for many of our hampers. Contact us through our support system to discuss your specific requirements.',
            category: 'Products',
            order: 3,
        },
        {
            question: 'What is your return policy?',
            answer: 'We want you to be completely satisfied with your purchase. If you\'re not happy with your order, please contact us within 7 days of delivery to arrange a return or exchange.',
            category: 'Returns',
            order: 4,
        },
        {
            question: 'Do you offer corporate gifting?',
            answer: 'Absolutely! We specialize in corporate gifting solutions with bulk order discounts and customization options. Please contact our team for a personalized quote.',
            category: 'Corporate',
            order: 5,
        },
    ];

    for (const faq of faqs) {
        await prisma.fAQ.upsert({
            where: { id: faqs.indexOf(faq) + 1 },
            update: {},
            create: faq,
        });
    }

    console.log('✅ FAQ items created');

    // Create default email templates
    const emailTemplates = [
        {
            name: 'welcome',
            subject: 'Welcome to HECuPPS!',
            body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8E5A3B;">Welcome to HECuPPS!</h1>
          <p>Hi {{name}},</p>
          <p>Thank you for joining HECuPPS - your destination for premium gift hampers.</p>
          <p>We're excited to have you with us and look forward to helping you find the perfect gifts for your loved ones.</p>
          <p>Start exploring our curated collections now!</p>
          <p>Best regards,<br>The HECuPPS Team</p>
        </div>
      `,
            variables: '["name"]',
            isActive: true,
        },
        {
            name: 'order_confirmation',
            subject: 'Order Confirmation - {{orderId}}',
            body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8E5A3B;">Order Confirmed!</h1>
          <p>Hi {{customerName}},</p>
          <p>Thank you for your order! We've received your payment and are preparing your gift hamper.</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Order ID: {{orderId}}</li>
            <li>Total Amount: {{totalAmount}}</li>
            <li>Payment Status: {{paymentStatus}}</li>
          </ul>
          <p>We'll send you another email once your order has been shipped.</p>
          <p>Best regards,<br>The HECuPPS Team</p>
        </div>
      `,
            variables: '["customerName", "orderId", "totalAmount", "paymentStatus"]',
            isActive: true,
        },
        {
            name: 'password_reset',
            subject: 'Reset Your Password',
            body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8E5A3B;">Password Reset Request</h1>
          <p>Hi {{name}},</p>
          <p>We received a request to reset your password. Click the link below to create a new password:</p>
          <p><a href="{{resetLink}}" style="background: #8E5A3B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The HECuPPS Team</p>
        </div>
      `,
            variables: '["name", "resetLink"]',
            isActive: true,
        },
        {
            name: 'support_reply',
            subject: 'Re: {{subject}}',
            body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8E5A3B;">Support Team Reply</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for contacting HECuPPS support. Here's our response to your inquiry:</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
            {{replyMessage}}
          </div>
          <p>If you have any further questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The HECuPPS Support Team</p>
        </div>
      `,
            variables: '["userName", "subject", "replyMessage"]',
            isActive: true,
        },
    ];

    for (const template of emailTemplates) {
        await prisma.emailTemplate.upsert({
            where: { name: template.name },
            update: {},
            create: template,
        });
    }

    console.log('✅ Email templates created');

    console.log('🎉 Database seed completed successfully!');
    console.log('');
    console.log('📋 Super Admin Credentials:');
    console.log('   Username: HECUPPS.main.admin');
    console.log('   Password: HECCUPPs1786.admin.admin');
    console.log('');
    console.log('⚠️  Remember to change the super admin password after first login!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
