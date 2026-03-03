const fs = require('fs');
const path = require('path');

// Manually load .env
try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
} catch (e) {
    console.log("Could not load .env file directly:", e.message);
}

const ELASTICEMAIL_API_URL = 'https://api.elasticemail.com/v2/email/send';
const API_KEY = process.env.ELASTICEMAIL_API_KEY;

async function sendTestEmail() {
    try {
        console.log("Testing email send...");

        if (!API_KEY) {
            throw new Error("API Key missing in .env");
        }

        console.log("API Key found (" + API_KEY.length + " chars)");

        const formData = new URLSearchParams();
        formData.append('apikey', API_KEY);
        formData.append('from', process.env.EMAIL_FROM || 'HECuPPS <noreply@hecupps.com>');
        formData.append('to', 'contact@hecupps.com');
        formData.append('subject', 'Test Email Debug');
        formData.append('bodyHtml', '<h1>Test</h1><p>This is a test email to debug sending issues.</p>');
        formData.append('isTransactional', 'true');

        console.log("Sending request to Elastic Email...");

        // Native fetch (Node 18+)
        const response = await fetch(ELASTICEMAIL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(data, null, 2));

        if (!response.ok || !data.success) {
            console.error("❌ FAILED!");
        } else {
            console.log("✅ SUCCESS!");
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

sendTestEmail();
