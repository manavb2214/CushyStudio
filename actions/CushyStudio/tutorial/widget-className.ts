action({
    name: 'demo-widget-classname',
    ui: (form) => ({
        steps: form.choices({
            defaultActiveBranches: {
                frame: true,
            },
            items: () => ({
                frame: form.group({
                    className: ' p-2 bg-blue-800 rounded-xl',
                    items: () => ({
                        seed: form.seed({
                            default: 12,
                            defaultMode: 'fixed',
                        }),
                        positive: form.str({}),
                    }),
                }),
                portrait: form.group({
                    className: 'p-2 bg-red-800 ',
                    items: () => ({
                        seed: form.seed({}),
                    }),
                }),
            }),
        }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes
        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        const positive = graph.CLIPTextEncode({ clip: ckpt, text: form.steps.frame?.positive || 'a house' })
        const negative = graph.CLIPTextEncode({ clip: ckpt, text: 'bad' })
        const latent_image = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
        const images = graph.VAEDecode({
            vae: ckpt,
            samples: graph.KSampler({
                model: ckpt,
                sampler_name: 'ddim',
                scheduler: 'ddim_uniform',
                positive,
                negative,
                latent_image,
            }),
        })
        graph.PreviewImage({ images: images })

        // execute
        await flow.PROMPT()
    },
})
