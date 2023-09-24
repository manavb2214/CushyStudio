import type { ImageL, ImageT } from 'src/models/Image'
import type { Requestable } from './InfoRequest'
import type * as R from './InfoRequest'
import type { LATER } from 'LATER'

export class FormBuilder {
    /** str */
    str = (p: Omit<R.Requestable_str, 'type'>): R.Requestable_str => ({ type: 'str', ...p })
    strOpt = (p: Omit<R.Requestable_strOpt, 'type'>): R.Requestable_strOpt => ({ type: 'str?', ...p })

    /** nums */
    int = (p?: Omit<R.Requestable_int, 'type'>): R.Requestable_int => ({ type: 'int', ...p })
    intOpt = (p?: Omit<R.Requestable_intOpt, 'type'>): R.Requestable_intOpt => ({ type: 'int?', ...p })
    float = (p?: Omit<R.Requestable_float, 'type'>): R.Requestable_float => ({ type: 'float', ...p })
    floatOpt = (p?: Omit<R.Requestable_floatOpt, 'type'>): R.Requestable_floatOpt => ({ type: 'float?', ...p })

    /** bools */
    bool = (p?: Omit<R.Requestable_bool, 'type'>): R.Requestable_bool => ({ type: 'bool' as const, ...p })
    boolOpt = (p?: Omit<R.Requestable_boolOpt, 'type'>) => ({ type: 'bool?' as const, ...p })

    /** embedding */
    embeddings = (label?: string) => ({ type: 'embeddings' as const, label })

    /** embedding */
    enum = <const T extends keyof LATER<'Requirable'>>(x: Omit<R.Requestable_enum<T>, 'type'>): R.Requestable_enum<T> => ({
        type: 'enum',
        ...x,
    })
    enumOpt = <const T extends keyof LATER<'Requirable'>>(
        x: Omit<R.Requestable_enumOpt<T>, 'type'>,
    ): R.Requestable_enumOpt<T> => ({
        type: 'enum?',
        ...x,
    })

    /** loras */
    // lora = (label?: string) => ({ type: 'lora' as const, label })
    loras = (p: Omit<R.Requestable_loras, 'type'>) => ({ type: 'loras' as const, ...p })

    /** painting */
    private _toImageInfos = () => {}
    samMaskPoints = (label: string, img: ImageL | ImageT) => ({
        type: 'samMaskPoints' as const,
        imageInfo: toImageInfos(img),
    })
    selectImage = (label: string): R.Requestable_selectImage => ({
        type: 'selectImage' as const,
        // imageInfos: [], //imgs.map(toImageInfos),
        label,
    })
    manualMask = (label: string, img: ImageL | ImageT) => ({
        type: 'manualMask' as const,
        label,
        imageInfo: toImageInfos(img),
    })
    paint = (label: string, url: string) => ({ type: 'paint' as const, label, url })

    /** optional group */
    groupOpt = <const T extends { [key: string]: Requestable }>(
        p: Omit<R.Requestable_itemsOpt<T>, 'type'>,
    ): R.Requestable_itemsOpt<T> => ({
        type: 'itemsOpt',
        ...p,
    })

    // group
    group = <const T extends { [key: string]: Requestable }>(
        p: Omit<R.Requestable_items<T>, 'type'>,
    ): R.Requestable_items<T> => ({
        type: 'items',
        ...p,
    })

    /** select one */
    selectOne = <const T>(label: string, choices: T): { type: 'selectOne'; choices: T } => ({ type: 'selectOne', choices })
    selectOneOrCustom = (label: string, choices: string[]): { type: 'selectOneOrCustom'; choices: string[] } => ({
        type: 'selectOneOrCustom',
        choices,
    })

    /** select many */
    selectMany = <const T>(label: string, choices: T): { type: 'selectMany'; choices: T } => ({ type: 'selectMany', choices })
    selectManyOrCustom = (label: string, choices: string[]): { type: 'selectManyOrCustom'; choices: string[] } => ({
        type: 'selectManyOrCustom',
        choices,
    })
}

// -------------
type ImageInBackend = ImageL | ImageT
export const toImageInfos = (img: ImageInBackend): ImageT => {
    try {
        return (img as any).toJSON ? (img as any).toJSON() : img
    } catch (error) {
        console.info('🔴 UNRECOVERABLE ERROR 🔴' + JSON.stringify(img))
        throw error
    }
}