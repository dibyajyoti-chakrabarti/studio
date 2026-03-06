const fetch = require('node-fetch'); // Use global fetch if Next 14 environment has it, but Node might need it or we can just use native fetch in node 18+

async function testInsights() {
    console.log("Testing API route...");
    try {
        const res = await fetch('http://localhost:3000/api/ai-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                material: "MS (Mild Steel)",
                process: "CNC Machining 3-Axis",
                finish: "Raw / As Machined",
                tolerance: "Standard ±0.5mm",
                complexity: "Simple",
                quantity: 25,
                city: "Bengaluru",
                dimensions: { l: 100, w: 100, h: 50 },
                estimate: { low: 1500, high: 2000 }
            })
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

testInsights();
