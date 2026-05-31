export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { chatId, order, cafeName, total } = req.body;
    if (!chatId || !order) return res.status(400).json({ error: 'Missing params' });

    const lines = order.map(i => `• ${i.name} × ${i.qty} — ${(i.price * i.qty).toLocaleString()} сум`).join('\n');
    const text = `🍽️ Новый заказ в ${cafeName || 'кафе'}!\n\n${lines}\n\n💰 Итого: ${total} сум\n\n⏰ ${new Date().toLocaleTimeString('ru')}`;

    const resp = await fetch(`https://api.telegram.org/bot8920034212:AAFJoPFhWEpB_6ZOd19EmCdhOhsFCB5TFmo/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });

    const data = await resp.json();
    if (!data.ok) return res.status(400).json({ error: data.description });
    return res.status(200).json({ ok: true });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
