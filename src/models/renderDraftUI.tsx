import type { ToolL } from './Tool'
import type { Requestable } from 'src/controls/InfoRequest'
import type { DraftL } from './Draft'

import { WidgetWithLabelUI } from '../front/ui/widgets/WidgetUI'

type BlockInput = { type: 'input'; key: string; req: Requestable }
type BlockGroup = { type: 'group'; children: BlockInput[] }
type Block = BlockGroup | BlockInput

// 🔴 todo: do this on recursively
export const renderToolUI = (draft: DraftL, tool: ToolL) => {
    const blocks: Block[] = []
    const blocksByGroup: { [key: string]: BlockGroup } = {}
    const formDef = tool.data.form ?? {}
    const entries = Object.entries(formDef)
    for (const [rootKey, req] of entries) {
        const group = req.group
        if (group) {
            if (!blocksByGroup[group]) {
                const blockGroup: BlockGroup = { type: 'group', children: [] }
                blocksByGroup[group] = blockGroup
                blocks.push(blockGroup)
            }
            blocksByGroup[group]!.children.push({ type: 'input', key: rootKey, req })
        } else {
            blocks.push({ type: 'input', key: rootKey, req })
        }
    }
    return blocks.map((block) => {
        if (block.type === 'group') {
            return (
                <div className='flex flex-wrap'>
                    {block.children.map((input, ix) => {
                        return (
                            <WidgetWithLabelUI //
                                path={[input.key]} //🔴
                                key={input.key}
                                rootKey={input.key}
                                req={input.req}
                                ix={ix}
                                draft={draft}
                            />
                        )
                    })}
                </div>
            )
        } else if (block.type === 'input') {
            return (
                <WidgetWithLabelUI //
                    path={[block.key]} //🔴
                    key={block.key}
                    rootKey={block.key}
                    req={block.req}
                    ix={0}
                    draft={draft}
                />
            )
        }
    })
}
