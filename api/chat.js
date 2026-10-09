
const FAQS = [
  {
    keys: ["what is tailmates", "about tailmates", "what does tailmates do"],
    answer: "TailMates is a pet adoption platform that helps people discover pets and learn about responsible adoption."
  },
  {
    keys: ["how to adopt", "adopt a pet", "adoption process"],
    answer: "Open the Adopt page to browse available pets. Read each pet's details and follow the contact or application instructions provided in the listing."
  },
  {
    keys: ["register a pet", "add my pet", "list my pet", "upload a pet"],
    answer: "Open Register a Pet, fill in the requested details, add a photo if supported, and submit the form. If it fails, sign in and try again."
  },
  {
    keys: ["pawmate", "paw mate", "pet matching", "find my match"],
    answer: "PawMate AI helps you find pets that may suit your lifestyle. Open the PawMate AI page and answer the questions to explore suggested matches."
  },
  {
    keys: ["services", "pet services"],
    answer: "Open the Services page to explore the pet-related services listed on TailMates."
  },
  {
    keys: ["shop", "pet products"],
    answer: "Open the Shop page to browse the pet products listed on TailMates."
  },
  {
    keys: ["login", "log in", "sign in", "cannot login"],
    answer: "Open the Login page and enter your account credentials. If you cannot remember your password, choose Forgot Password."
  },
  {
    keys: ["forgot password", "reset password"],
    answer: "Select Forgot Password on the Login page and follow the instructions to reset your password. Check your spam folder if the email does not arrive."
  },
  {
    keys: ["profile", "my account"],
    answer: "Sign in and open your Profile to view or manage the account information available to you."
  },
  {
    keys: ["saved pets", "favourites", "favorites"],
    answer: "Open Saved Pets to view the pets you have saved, if this feature is available in your account."
  },
  {
    keys: ["hello", "hi", "hey"],
    answer: "Hi! I'm TailBot. I can help you navigate TailMates, explore pet adoption, and use PawMate AI. What would you like to know?"
  },
  {
    keys: ["thank you", "thanks"],
    answer: "You're welcome! I'm here if you need help with TailMates."
  }
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackAnswer(message) {
  const question = normalize(message);

  for (const faq of FAQS) {
    if (faq.keys.some(key => {
      const normalizedKey = normalize(key);
      return question === normalizedKey ||
        question.includes(normalizedKey);
    })) {
      return faq.answer;
    }
  }

  return "Gemini is unavailable right now, but I can still answer common TailMates questions. Try asking about adopting a pet, registering a pet, PawMate AI, login, password resets, or website navigation.";
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  if (!message) {
    return res.status(400).json({
      error: "Please enter a message."
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      error: "Message is too long."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Gemini is optional for built-in website questions.
  if (!apiKey) {
    return res.status(200).json({
      reply: fallbackAnswer(message),
      source: "fallback"
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are TailBot, the assistant for TailMates, a pet adoption website. Answer questions about website navigation, pet adoption, breeds, and general pet care. Be helpful and concise. Do not invent live pet listings or account information. For urgent animal health problems, recommend contacting a veterinarian."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message }]
          }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 500
          }
        }),
        signal: AbortSignal.timeout(12000)
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (response.ok && reply) {
      return res.status(200).json({
        reply,
        source: "gemini"
      });
    }

    console.error("Gemini unavailable:", data?.error?.message);
  } catch (error) {
    console.error("Gemini request failed:", error.message);
  }

  // Gemini failed or timed out: answer without another AI service.
  return res.status(200).json({
    reply: fallbackAnswer(message),
    source: "fallback"
  });
};
