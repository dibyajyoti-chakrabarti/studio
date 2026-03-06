import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { material, process, finish, tolerance, complexity, quantity, city, dimensions, estimate } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You are MechHub's manufacturing expert AI for India. A customer wants:
Material: ${material}, Process: ${process}, Finish: ${finish}
Tolerance: ${tolerance}, Complexity: ${complexity}, Quantity: ${quantity} pcs
City: ${city}, Dimensions: ${dimensions.l}×${dimensions.w}×${dimensions.h}mm
Estimated price: ₹${estimate.low}–₹${estimate.high}

Give exactly 3 short, India-specific manufacturing insights:
1. A cost-saving tip specific to Indian market/material/process
2. A DFM (design for manufacturing) tip
3. A vendor selection tip for their city/region

Return ONLY a JSON array: [{"title": "...", "tip": "..."}]
No preamble, no markdown, just the JSON array.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Attempt to parse JSON response. The model might return it wrapped in markdown blocks
        let jsonArray = [];
        try {
            const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            jsonArray = JSON.parse(cleanText);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", parseError, responseText);
            throw new Error("Invalid JSON from Gemini");
        }

        // Ensure we have 3 insights
        if (!Array.isArray(jsonArray) || jsonArray.length < 3) {
            throw new Error("Gemini returned invalid insight format");
        }

        return NextResponse.json({ insights: jsonArray.slice(0, 3) });
    } catch (error) {
        console.error("AI Insights Error:", error);
        // Return standard 500 so the client falls back to static
        return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }
}
