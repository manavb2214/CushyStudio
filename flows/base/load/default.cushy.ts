action('🟢 Default', {
    priority: 1,
    help: 'load model with optional clip-skip, loras, tome ratio, etc.',
    ui: (form) => ({
        // load
        model: form.enum({
            enumName: 'Enum_EfficientLoader_Ckpt_name',
            default: 'dynavisionXLAllInOneStylized_beta0411Bakedvae.safetensors',
        }),
        vae: form.enumOpt({ enumName: 'Enum_VAELoader_Vae_name' }),
        clipSkip: form.intOpt({}),
        loras: form.loras({}),

        // prompt
        positive: form.str({ textarea: true }),
        negative: form.strOpt({ textarea: true }),
        batchSize: form.int({ default: 1 }),
        seed: form.intOpt({}),
        steps: form.int({ default: 20 }),
        width: form.int({ default: 1024 }),
        height: form.int({ default: 1024 }),

        // startImage
        startImage: form.selectImage('Start image'),

        removeBG: form.bool({ default: false }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes

        // MODEL AND LORAS
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
        let clipAndModel: HasSingle_CLIP & HasSingle_MODEL = ckpt
        for (const lora of p.loras ?? []) {
            clipAndModel = graph.LoraLoader({
                model: clipAndModel,
                clip: clipAndModel,
                lora_name: lora.name,
                strength_clip: lora.strength_clip ?? 1.0,
                strength_model: lora.strength_model ?? 1.0,
            })
        }

        // CLIP
        let clip = clipAndModel._CLIP
        let model = clipAndModel._MODEL
        if (p.clipSkip) {
            clip = graph.CLIPSetLastLayer({ clip, stop_at_clip_layer: p.clipSkip }).CLIP
        }

        // VAE
        let vae: VAE = ckpt._VAE
        if (p.vae) vae = graph.VAELoader({ vae_name: p.vae }).VAE

        // CLIPS
        const positive = graph.CLIPTextEncode({ clip: flow.AUTO, text: p.positive })
        const negative = graph.CLIPTextEncode({ clip: flow.AUTO, text: p.negative ?? '' })

        // DECODE
        graph.SaveImage({
            images: graph.VAEDecode({
                samples: graph.KSampler({
                    seed: p.seed == null ? flow.randomSeed() : p.seed,
                    latent_image: graph.EmptyLatentImage({
                        batch_size: p.batchSize,
                        height: p.height,
                        width: p.width,
                    }),
                    model: flow.AUTO,
                    positive: positive,
                    negative: negative,
                    sampler_name: 'ddim',
                    scheduler: 'karras',
                    steps: p.steps,
                }),
                vae: vae, // flow.AUTO,
            }),
        })

        if (p.removeBG) {
            graph.PreviewImage({
                images: graph.RemoveImageBackgroundAbg({
                    image: flow.AUTO,
                }),
            })
        }
        // PROMPT
        await flow.PROMPT()

        // // FUNNY PROMPT REVERSAL
        // positive.set({ text: p.negative ?? '' })
        // negative.set({ text: p.positive ?? '' })
        // await flow.PROMPT()

        // patch
        // if (p.tomeRatio != null && p.tomeRatio !== false) {
        //     const tome = graph.TomePatchModel({ model, ratio: p.tomeRatio })
        //     model = tome.MODEL
        // }
    },
})