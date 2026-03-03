const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTemplate() {
    try {
        console.log("Checking for 'support_reply' template...");
        const template = await prisma.emailTemplate.findUnique({
            where: { name: 'support_reply' }
        });

        if (template) {
            console.log("✅ Template found:");
            console.log(template);
        } else {
            console.log("❌ Template 'support_reply' NOT found!");
        }

        console.log("\nChecking API Key presence...");
        if (process.env.ELASTICEMAIL_API_KEY) {
            console.log("✅ ELASTICEMAIL_API_KEY is set (length: " + process.env.ELASTICEMAIL_API_KEY.length + ")");
        } else {
            console.log("❌ ELASTICEMAIL_API_KEY is NOT set in process.env");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTemplate();
