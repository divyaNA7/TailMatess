module.exports = async function handler(req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const message = req.body?.message;

    if (!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from Vercel");
        return res.status(500).json({
            error: "GEMINI_API_KEY is not configured"
        });
    }

    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: message
                    }
                ]
            }
        ],
systemInstruction: {
    parts: [
        {
            text: "You are TailBot, the AI companion of TailMates, a pet adoption platform in Mumbai, India only. Your role is to help users make informed decisions about pet adoption by providing useful, reliable information about animals and breeds before they adopt, including their temperament, lifestyle, care requirements, needs, and what an adopter should realistically expect. Help users understand whether a particular animal or breed may be suitable for them rather than simply encouraging adoption. You also act as a guide to the TailMates platform. Help users understand the adoption process, explain the steps involved, and guide them to the relevant sections and features of the website whenever they are unsure what to do next. Introduce or direct users to PawMate AI when it is relevant to their question or when they would benefit from more personalized pet-related assistance. TailMates does not provide shelter information or associated with a shelter. Keep responses natural, helpful, and conversational while staying focused on responsible pet adoption, animal information, and helping users navigate TailMates. Do not use emojis."
        }
    ]
}

    // Try up to 3 times if Gemini temporarily returns 503
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify(requestBody)
            });

            const raw = await response.text();

            let data;

            try {
                data = JSON.parse(raw);
            } catch {
                console.error("Gemini returned invalid JSON:", raw);

                if (attempt === 3) {
                    return res.status(502).json({
                        error: "Invalid response from Gemini"
                    });
                }

                continue;
            }

            console.log("Gemini status:", response.status);

            if (response.status === 503) {
                console.error("Gemini temporarily unavailable:", data);

                if (attempt < 3) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    continue;
                }

                return res.status(503).json({
                    error: "Gemini is temporarily unavailable. Please try again."
                });
            }

            if (!response.ok) {
                console.error("Gemini API error:", data);

                return res.status(response.status).json({
                    error:
                        data?.error?.message ||
                        "Gemini API request failed"
                });
            }

            const reply =
                data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!reply) {
                console.error("Gemini returned no text:", data);

                return res.status(500).json({
                    error: "Gemini returned no response"
                });
            }

            return res.status(200).json({
                reply: reply
            });

        } catch (error) {
            console.error("TailBot connection error:", error);

            if (attempt === 3) {
                return res.status(500).json({
                    error: error?.message || "TailBot server error"
                });
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    return res.status(500).json({
        error: "TailBot failed"
    });
};
