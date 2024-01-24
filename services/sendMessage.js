const fetch = require('node-fetch');

const BOT_TOKEN = process.env.BOT_TOKEN;

const sendTelegramMessage = async (text, chat_id) => {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id,
            text,
        }),
    });

    const data = await response.json();
    return data;
};

module.exports = sendTelegramMessage;