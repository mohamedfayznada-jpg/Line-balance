export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI engine is not configured. Add OPENAI_API_KEY in Vercel project environment variables." });
  try {
    const { frames, taskName, station, model, notes, videoDuration } = req.body || {};
    if (!Array.isArray(frames) || frames.length < 3 || frames.length > 24) return res.status(400).json({ error: "Send 3 to 24 sampled frames." });
    if (!taskName || !station) return res.status(400).json({ error: "Task name and station are required." });
    const content = [{
      type: "input_text",
      text: [
        "You are an industrial engineering assistant conducting a PRELIMINARY video-based time study.",
        "Frames are sampled from one worker performing one operation. Each frame includes a timestamp in seconds. Infer only what is visually supported. Do not invent exact event boundaries between sparse frames; mark estimates as approximate and confidence low when necessary.",
        "Return ONLY valid JSON with keys: summary, cycle_time_estimate_s, confidence, limitations, elements, motion_observations, improvement_opportunities, reviewer_checks.",
        "elements must be an array of objects: {name, start_s, end_s, duration_s, category, evidence, confidence, needs_review}. Use category 'VA', 'NVA', or 'Unclassified' and explain that classifications are provisional.",
        "motion_observations and improvement_opportunities must be arrays of concise strings. reviewer_checks must be an array of items requiring human validation.",
        "The timestamps are reference times, not guaranteed exact cycle boundaries. Do not claim standard time, rating-adjusted time, allowances, or statistical sufficiency from one video.",
        "Operation: " + taskName + "; station: " + station + "; model: " + (model || "unspecified") + "; video duration seconds: " + (videoDuration || "unknown") + "; notes: " + (notes || "none") + ".",
        "Frames follow in chronological order; each frame's caption gives its timestamp."
      ].join("\n")
    }];
    for (const frame of frames) {
      if (!frame || typeof frame.image !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(frame.image)) continue;
      content.push({ type: "input_text", text: "Frame timestamp: " + Number(frame.t).toFixed(2) + " seconds." });
      content.push({ type: "input_image", image_url: frame.image, detail: "high" });
    }
    if (content.length < 7) return res.status(400).json({ error: "No valid image frames were provided." });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || "gpt-5.4-mini",
        input: [{ role: "user", content }],
        max_output_tokens: 4500
      })
    });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: payload.error?.message || "Vision model request failed." });
    const text = (payload.output || []).flatMap(o => o.content || []).filter(c => c.type === "output_text").map(c => c.text).join("\n");
    if (!text) return res.status(502).json({ error: "The model returned no text." });
    let result;
    try {
      const clean = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
      result = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: "Could not parse structured analysis. Please retry with a shorter video." });
    }
    return res.status(200).json({ result, model: process.env.OPENAI_VISION_MODEL || "gpt-5.4-mini", sampledFrames: content.filter(c => c.type === "input_image").length });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unexpected analysis error." });
  }
}
