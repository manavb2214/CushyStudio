import { formContext } from '../FormCtx'

import { observer } from 'mobx-react-lite'
import { Button, Panel } from 'rsuite'
import { ActionL } from 'src/models/Action'
import { ActionPickerUI, ActionSuggestionUI } from '../flow/ActionPickerUI'
import { DebugUI } from './DebugUI'
import { WidgetUI } from './WidgetUI'

export const ActionPlaceholderUI = observer(function ActionPlaceholderUI_(p: {}) {
    return (
        <Panel>
            <div className='flex gap-2' style={{ width: '30rem' }}>
                Executing...
            </div>
        </Panel>
    )
})
/** this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const ActionUI = observer(function StepUI_(p: { action: ActionL }) {
    // ensure action have a tool
    const action = p.action
    const tool = action.tool.item
    // if (tool == null) return <ActionPickerUI action={action} />

    // prepare basic infos
    const formDefinition = tool?.data.form ?? {}
    const locked = action.data.params != null

    return (
        <formContext.Provider value={action}>
            <Panel
                className='relative'
                shaded
                header={
                    <div className='flex'>
                        <ActionPickerUI action={action} />
                        <div className='flex flex-grow' />
                        <Button
                            size='sm'
                            className='self-start'
                            color='green'
                            appearance='primary'
                            onClick={() => action.submit()}
                        >
                            Go
                        </Button>
                    </div>

                    // tool?.data.name ?? 'Pick a tool'
                }
            >
                <div className='flex gap-2' style={{ width: '30rem' }}>
                    <ActionSuggestionUI action={action} />
                    {/* <ActionPickerUI action={action} /> */}
                    {/* widgets ------------------------------- */}
                    <div>
                        {Object.entries(formDefinition).map(([k, v], ix) => (
                            <div
                                // style={{ background: ix % 2 === 0 ? '#313131' : undefined }}
                                className='row gap-2 items-baseline'
                                key={k}
                            >
                                <div className='w-20 shrink-0 text-right'>{k}</div>
                                <WidgetUI path={[k]} req={v} focus={ix === 0} />
                            </div>
                        ))}
                    </div>

                    {locked ? null : (
                        <pre className='border-2 border-dashed border-orange-200 p-2'>
                            action output = {JSON.stringify(action.data.params, null, 4)}
                        </pre>
                    )}

                    {/* debug -------------------------------*/}
                    <div className='flex absolute bottom-0 right-0'>
                        <DebugUI title='⬇'>
                            the form definition is
                            <pre>{JSON.stringify(formDefinition, null, 4)}</pre>
                        </DebugUI>
                        <DebugUI title={'⬆'}>
                            the value about to be sent back to the workflow is
                            <pre>{JSON.stringify(action.data.params, null, 4)}</pre>
                        </DebugUI>
                    </div>
                </div>
            </Panel>
        </formContext.Provider>
    )
})
