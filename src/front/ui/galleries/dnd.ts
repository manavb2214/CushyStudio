import type { STATE } from 'src/front/state'
import type { ImageL } from 'src/models/Image'

import { NativeTypes } from 'react-dnd-html5-backend'
import { ItemTypes } from './DnDItemTypes'
import { useDrag, useDrop } from 'react-dnd'
import { CSSProperties } from 'react'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'

export const useImageDrag = (image: ImageL) =>
    useDrag(
        () => ({
            type: ItemTypes.Image,
            item: { image },
            collect: (monitor) => {
                // console.log('monitor.isDragging()=', monitor.isDragging())
                return { opacity: monitor.isDragging() ? 0.5 : 1 }
            },
        }),
        [image],
    )

// export const useImageDrop = (fn: (image: ImageL) => void) =>
//     useDrop<{ image: ImageL }, void, CSSProperties>(() => ({
//         accept: ItemTypes.Image,
//         collect(monitor) {
//             return { outline: monitor.isOver() ? '1px solid gold' : undefined }
//         },
//         drop(item: { image: ImageL }, monitor) {
//             console.log('AAAA')
//             return fn(item.image)
//             // item.image.update({ folderID: p.folder.id })
//         },
//     }))

type Drop1 = { image: ImageL }
type Drop2 = { files: (File & { path: AbsolutePath })[] }

export const useImageDrop = (st: STATE, fn: (image: ImageL) => void) =>
    useDrop<Drop1 | Drop2, void, CSSProperties>(() => ({
        // 1. Accepts both custom Image and native files drops.
        accept: [ItemTypes.Image, NativeTypes.FILE],

        // 2. add golden border when hovering over
        collect(monitor) {
            return { outline: monitor.isOver() ? '1px solid gold' : undefined }
        },

        // 3. import as ImageL if needed
        drop(item: Drop1 | Drop2, monitor) {
            if (monitor.getItemType() == ItemTypes.Image) {
                const image: ImageL = (item as Drop1).image
                return fn(image)
            }
            if (monitor.getItemType() === NativeTypes.FILE) {
                // Handle file drop
                // const item = monitor.getItem() as any as Drop2
                // debugger
                const files = (item as Drop2).files
                const imageFile = Array.from(files).find((file) => file.type.startsWith('image/'))
                console.log('[🗳️] drop box: image path is', imageFile?.path ?? '❌')
                if (imageFile) {
                    st.uploader.upload_NativeFile(imageFile).then((res) => {
                        console.log(`[🗳️] drop box: uploaded image infos are ${JSON.stringify(res)}`)
                        const image: ImageL = st.db.images.create({
                            imageInfos: {
                                filename: res.name,
                                subfolder: res.subfolder,
                                type: res.type,
                            },
                            localFilePath: imageFile.path,
                            downloaded: true,
                        })
                        return fn(image)
                    })
                    return
                } else {
                    console.log('Dropped non-image file')
                    return
                }
            }

            throw new Error('Unknown drop type')
            // console.log('AAAA')
            // item.image.update({ folderID: p.folder.id })
        },
    }))
