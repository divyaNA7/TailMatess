module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { message } = req.body || {};

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing");
            return res.status(500).json({
                error: "Gemini API key is not configured"
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
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
                                text: "You are TailBot, the AI assistant for TailMates, a pet adoption platform based in India. Help users with pet adoption, pet care, breeds, shelters, and TailMates services. Be friendly, helpful, concise, and do not use emojis."
                            }
                        ]
                    }
                })
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.error("Gemini returned non-JSON:", text);
            return res.status(500).json({
                error: "Invalid response from Gemini"
            });
        }

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error: data?.error?.message || "Gemini API request failed"
            });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error("No reply in Gemini response:", data);

            return res.status(500).json({
                error: "No response received from Gemini"
            });
        }

        return res.status(200).json({
            reply
        });

    } catch (error) {
        console.error("TailBot server error:", error);

        return res.status(500).json({
            error: error?.message || "TailBot server error"
        });
    }
};
