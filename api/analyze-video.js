export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "Gemini is not configured. Add GEMINI_API_KEY in Vercel Production environment variables." });

  try {
    const { frames, taskName, station, model, notes, videoDuration } = req.body || {};
    if (!Array.isArray(frames) || frames.length < 3 || frames.length > 24) return res.status(400).json({ error: "Send 3 to 24 sampled frames." });
    if (!taskName || !station) return res.status(400).json({ error: "Task name and station are required." });

    const parts = [{
      text: [
        "أنت خبير هندسة صناعية تجري دراسة زمن أولية لعملية إنتاجية اعتمادًا على الفيديو.",
        "لغة الإخراج إلزاميًا: العربية الفصحى السليمة والواضحة، بأسلوب مهني هندسي، مع قواعد وإملاء ونحو صحيحين. لا تستخدم الإنجليزية في النصوص التفسيرية أو التوصيات أو أسماء العناصر إلا للمصطلحات الفنية القياسية والرموز المطلوبة في بنية البيانات. أبقِ أسماء مفاتيح JSON كما هي بالإنجليزية، لكن اجعل جميع القيم النصية باللغة العربية. استخدم صياغة مباشرة ومفهومة، وتجنب الترجمة الحرفية والعبارات الركيكة واللهجة العامية.",
        "Frames are sampled from one worker performing one operation. Each frame has a timestamp in seconds. Infer only what is visually supported. Do not invent exact event boundaries between sparse frames; mark estimates approximate and confidence low when needed.",
        "Return ONLY valid JSON with keys: summary, cycle_time_estimate_s, confidence, limitations, elements, motion_observations, improvement_opportunities, reviewer_checks.",
        "elements must be an array of objects: {name, start_s, end_s, duration_s, category, evidence, confidence, needs_review}. Write name and evidence in correct Arabic. Use category exactly 'VA', 'NVA', or 'Unclassified'; classifications are provisional. In all other text fields, use Arabic.",
        "motion_observations and improvement_opportunities must be arrays of concise, grammatically correct Arabic strings. reviewer_checks must be an array of Arabic items requiring human validation. summary and limitations must also be written in professional Modern Standard Arabic.",
        "Timestamps are reference times, not guaranteed exact event boundaries. Do not claim standard time, rating-adjusted time, allowances, or statistical sufficiency from one video.",
        "بيانات العملية: اسم العملية: " + taskName + "؛ المحطة: " + station + "؛ الطراز: " + (model || "غير محدد") + "؛ مدة الفيديو بالثواني: " + (videoDuration || "غير معروفة") + "؛ ملاحظات المستخدم: " + (notes || "لا توجد") + ".",
        "Frames follow in chronological order. Each image is preceded by its timestamp."
      ].join("\n")
    }];

    let validFrames = 0;
    for (const frame of frames) {
      if (!frame || typeof frame.image !== "string") continue;
      const match = frame.image.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
      if (!match) continue;
      parts.push({ text: "Frame timestamp: " + Number(frame.t).toFixed(2) + " seconds." });
      parts.push({ inline_data: { mime_type: "image/" + match[1], data: match[2] } });
      validFrames++;
    }
    if (validFrames < 3) return res.status(400).json({ error: "At least 3 valid image frames are required." });

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(modelName) + ":generateContent", {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 4500, temperature: 0.2 }
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      const apiMessage = payload.error?.message || "Gemini request failed.";
      const status = response.status === 429 ? 429 : response.status === 400 ? 400 : response.status === 403 ? 403 : 502;
      return res.status(status).json({ error: apiMessage });
    }
    const text = (payload.candidates || []).flatMap(c => c.content?.parts || []).map(p => p.text || "").join("\n").trim();
    if (!text) return res.status(502).json({ error: "Gemini returned no text. Try a shorter or clearer video." });

    let result;
    try {
      const clean = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      result = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: "Gemini did not return valid structured JSON. Please retry." });
    }
    return res.status(200).json({ result, model: modelName, sampledFrames: validFrames, provider: "Gemini API" });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unexpected analysis error." });
  }
}
