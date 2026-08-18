export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
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
                                text: "You are TailBot, the AI assistant for TailMates, a pet adoption platform based in India. You help users find pets, answer questions about adoption, pet care, breeds, shelters, and TailMates services. Be friendly, helpful, and concise. Do not use emojis. Keep responses under 150 words when possible."
                            }
                        ]
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error: "Gemini API request failed"
            });
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            return res.status(500).json({
                error: "No response received from Gemini"
            });
        }

        return res.status(200).json({
            reply: reply
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: "TailBot is temporarily unavailable"
        });
    }
}
