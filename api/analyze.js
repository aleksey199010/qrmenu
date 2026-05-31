export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, categories } = req.body;

    const cleanImage = imageBase64.replace(
  /^data:image\/[a-zA-Z]+;base64,/,
  ''
);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
                text: `text: `Это фото меню кафе.

Найди ВСЕ блюда на изображении.

Для каждого блюда определи:
- название
- цену
- категорию
- описание (если оно есть рядом с блюдом)

Если на меню есть заголовки разделов (Напитки, Закуски, Десерты, Основные блюда и т.д.), используй их как category.

Категории из системы:
${categories}

Ответь ТОЛЬКО в формате JSON:

{
  "dishes":[
    {
      "name":"Плов",
      "price":"45000",
      "category":"Горячее",
      "description":"Традиционный узбекский плов"
    }
  ]
}

Правила:
- Только JSON
- Без markdown
- Без пояснений
- Цены только цифры
- Если описания нет, верни description как пустую строку
- Найди максимально возможное количество блюд`
              }
            ]
          }],
          generationConfig: {
  temperature: 0,
  maxOutputTokens: 8192,
  responseMimeType: "application/json"
}
        })
      }
    );

    const data = await response.json();

    console.log('GEMINI RESPONSE:', JSON.stringify(data));

    if (!data.candidates || !data.candidates.length) {
      return res.status(200).json({
        text: '{"dishes":[]}'
      });
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('AI TEXT:', text);

    return res.status(200).json({
      text
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
