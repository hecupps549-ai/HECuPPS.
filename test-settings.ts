import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        let siteSettingsData = await prisma.siteSettings.findFirst();
        if (!siteSettingsData) {
            siteSettingsData = await prisma.siteSettings.create({
                data: { siteName: 'HECuPPS', currency: 'INR', taxRate: 0 },
            });
        }

        let paymentSettingsData = await prisma.paymentSettings.findFirst();
        if (!paymentSettingsData) {
            paymentSettingsData = await prisma.paymentSettings.create({
                data: {},
            });
        }

        console.log('Got settings from DB.');

        // Simulate update after JSON stringify/parse (like an API request)
        const siteDataPayload = JSON.parse(JSON.stringify({ ...siteSettingsData, taxRate: 0, siteName: 'Updated' }));
        const paymentDataPayload = JSON.parse(JSON.stringify({ ...paymentSettingsData, razorpayEnabled: true }));

        console.log('Updating siteSettings with:', siteDataPayload);

        await prisma.siteSettings.upsert({
            where: { id: siteDataPayload.id || 1 },
            update: siteDataPayload,
            create: { ...siteDataPayload, id: 1 },
        });

        await prisma.paymentSettings.upsert({
            where: { id: paymentDataPayload.id || 1 },
            update: paymentDataPayload,
            create: { ...paymentDataPayload, id: 1 },
        });

        console.log('Saved successfully');
    } catch (e) {
        console.error('Error validation:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
