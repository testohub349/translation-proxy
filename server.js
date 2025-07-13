const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/translate', async (req, res) => {
    const { url, target } = req.query;

    if (!url || !target) {
        return res.status(400).send('Missing url or target parameter');
    }

    try {
        // Build Google Translate URL
        const translateUrl = `https://translate.google.com/translate?hl=${target}&sl=auto&tl=${target}&u=${encodeURIComponent(url)}`;
        const response = await axios.get(translateUrl);

        let html = response.data;

        // Remove Google banners and frames
        html = html.replace(/<iframe[^>]*goog-te[^>]*>.*?<\/iframe>/g, '');
        html = html.replace(/<div[^>]*goog-te[^>]*>.*?<\/div>/g, '');
        html = html.replace(/<script[^>]*goog[^>]*>.*?<\/script>/g, '');

        res.send(html);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error fetching translation');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
