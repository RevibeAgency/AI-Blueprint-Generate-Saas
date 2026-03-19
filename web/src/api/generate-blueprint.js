// pages/api/generate-blueprint.js (if using Next.js)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, problem_statement } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Generate a SaaS blueprint for the project "${title}" based on this description:\n${problem_statement}`,
          },
        ],
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error?.message || 'Failed to generate blueprint');
    }

    res.status(200).json({ blueprint: json.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
