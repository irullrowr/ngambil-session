const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        try {
            const faktaApiUrl = await global.tools.api.createUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random", {});
            const faktaResponse = await global.tools.fetch.json(faktaApiUrl);
            const faktaText = faktaResponse.data.text;

            const translationApiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: faktaText,
                target: "id"
            });
            const translationResponse = await global.tools.fetch.json(translationApiUrl, {
                "x-api-key": global.tools.listAPIUrl().fasturl.APIKey

            });
            const translatedText = translationResponse.data.translatedText;

            return ctx.reply(translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};