const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktoknowm", "tt", "ttdl", "vt", "vtdltiktok", "vtnowm"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/ -a"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-a": "Otomatis kirim audio."
            }))
        );

        const flag = tools.general.parseFlag(input, {
            "-a": {
                type: "boolean",
                key: "audio"
            }
        });

        const url = flag.input || null;

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return await ctx.reply(config.msg.urlInvalid);

        try {
            const mediaType = flag.audio ? "audio" : "video_image";

            const apiUrl = tools.api.createUrl("https://api.tiklydown.eu.org", "/api/download", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: data.music.play_url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (mediaType === "video_image") {
                if (data.video?.noWatermark) {
                    return await ctx.reply({
                        video: {
                            url: data.video.noWatermark
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: `${quote(`URL: ${url}`)}\n` +
                            "\n" +
                            config.msg.footer,
                        gifPlayback: false
                    });
                }

                if (data.images && data.images.length > 0) {
                    for (const image of data.images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png"),
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};