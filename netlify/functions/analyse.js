exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { profile, scenario } = JSON.parse(event.body);

  const prompt = `You are a leadership coach expert in two frameworks: the Spotlight behavioural profile and Black Swan Group Tactical Empathy tools (Labelling, Mirroring, Accusation audit, Calibrated question, That's right, Dynamic silence).

PROFILE:
${profile}

SCENARIO: ${scenario}

Return ONLY a valid JSON object. No markdown, no backticks, no preamble, no explanation — just the raw JSON.

{
  "scenario_summary": "One sentence summary of the scenario and what is at stake for this person",
  "options": [
    {
      "badge": "Plays to strengths",
      "title": "5-7 word action title",
      "desc": "2 sentences using this person's natural profile strengths for this situation.",
      "seen_as": "1 sentence on how others will likely perceive this approach.",
      "reminders": [
        {"text": "A specific reminder", "why": "Why this matters given their profile"},
        {"text": "A second specific reminder", "why": "Why this matters given their profile"}
      ],
      "recommended": false
    },
    {
      "badge": "Stretches comfort zone",
      "title": "5-7 word action title",
      "desc": "2 sentences describing an approach that counter-balances this person's natural tendencies.",
      "seen_as": "1 sentence on how others will likely perceive this approach.",
      "reminders": [
        {"text": "A specific reminder", "why": "Why this matters given their profile"},
        {"text": "A second specific reminder", "why": "Why this matters given their profile"}
      ],
      "recommended": true
    },
    {
      "badge": "Risk of over-playing",
      "title": "5-7 word action title",
      "desc": "2 sentences showing this person over-playing their natural strengths to a fault.",
      "seen_as": "1 sentence on how others will likely perceive this approach.",
      "reminders": [
        {"text": "A specific reminder", "why": "Why this matters given their profile"},
        {"text": "A second specific reminder", "why": "Why this matters given their profile"}
      ],
      "recommended": false
    }
  ],
  "te_tools": [
    {
      "tool": "Tool name (must be one of: Labelling, Mirroring, Accusation audit, Calibrated question, That's right, Dynamic silence)",
      "why_relevant": "1 sentence on why this tool fits this specific scenario",
      "example": "A concrete example phrase this person could use in this exact situation",
      "profile_note": "1 sentence on how this person's profile affects how they should use this tool"
    },
    {
      "tool": "Second tool name",
      "why_relevant": "1 sentence",
      "example": "Concrete example phrase",
      "profile_note": "1 sentence profile-specific coaching note"
    },
    {
      "tool": "Third tool name",
      "why_relevant": "1 sentence",
      "example": "Concrete example phrase",
      "profile_note": "1 sentence profile-specific coaching note"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (data.type === "error") throw new Error(data.error.message);

    const text = data.content.map((i) => i.text || "").join("");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: match[0],
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
