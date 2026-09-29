const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
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
            }
        })
    }
);
