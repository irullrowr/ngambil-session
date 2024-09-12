const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "aiimg",
    aliases: ["diff", "diffusion", "stablediffusion", "sxdl"],
    category: "ai",
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
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("chiwa", `/api/ai/cai/generate-image`, {
                prompt: input
            });
            const data = await global.tools.fetch.json(apiUrl);

            return await ctx.reply({
                image: {
                    url: data.imageUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};