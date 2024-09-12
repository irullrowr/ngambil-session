const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "simsimi",
    aliases: ["simi"],
    category: "fun",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/simsimi", {
                message: input
            });
            const response = await global.tools.fetch.json(apiUrl);
            const {
                data
            } = response.data;

            return ctx.reply(data);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};