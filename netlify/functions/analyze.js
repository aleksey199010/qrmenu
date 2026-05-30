
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, categories } = JSON.parse(event.body);

    const cleanImage = imageBase64.replace(
  /^data:image\/[a-zA-Z]+;base64,/,
  ''
);

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: cleanImage
                }
              },
              {
                text: `Это фото меню кафе. Найди все блюда и цены. Категории: ${categories}.

Ответь ТОЛЬКО в формате JSON без лишнего текста и без markdown:
{"dishes": [{"name": "Плов", "price": "45000", "category": "Горячее"}]}

Правила:
- Цены только цифры без пробелов
- Если цены нет поставь 0
- Названия на том языке что в меню`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '{"dishes":[]}', error: JSON.stringify(data) })
      };
    }

    const text = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
