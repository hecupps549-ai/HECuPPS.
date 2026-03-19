async function run() {
    try {
        const payload = {
            siteSettings: {
                id: 1,
                siteName: 'HECuPPS',
                currency: 'INR',
                taxRate: null 
            },
            paymentSettings: {
                id: 1
            }
        };
        const resPut = await fetch("http://127.0.0.1:3000/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        console.log("PUT status:", resPut.status);
        console.log("PUT content-type:", resPut.headers.get("content-type"));
        console.log("PUT text:", await resPut.text().catch(e => e.message));
    } catch(e) {
        console.error("Fetch Error:", e);
    }
}
run();
