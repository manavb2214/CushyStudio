import * as I from '@rsuite/icons'
import * as R from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Message, Tooltip, Whisper } from 'rsuite'
import { WidgetPromptUI } from '../../../prompter/WidgetPromptUI'
import { exhaust } from '../../../utils/ComfyUtils'
import { ErrorBoundaryFallback } from '../utils/ErrorBoundary'
import { WidgetBoolUI } from './WidgetBoolUI'
import { WidgetChoiceUI } from './WidgetChoice'
import { WidgetChoicesUI } from './WidgetChoices'
import { WidgetColorUI } from './WidgetCololrUI'
import { WidgetEnumUI } from './WidgetEnumUI'
import { WidgetGroupOptUI, WidgetGroupUI } from './WidgetIGroupUI'
import { WidgetListUI } from './WidgetListUI'
import { WidgetLorasUI } from './WidgetLorasUI'
import { WidgetMatrixUI } from './WidgetMatrixUI'
import { WidgetNumOptUI } from './WidgetNumOptUI'
import { WidgetNumUI } from './WidgetNumUI'
import { WidgetSeedUI } from './WidgetSeedUI'
import { WidgetSelectImageUI } from './WidgetSelectImageUI'
import { WidgetSelectOneUI } from './WidgetSelectOneUI'
import { WigetSizeUI } from './WidgetSizeUI'
import { WidgetStrOptUI } from './WidgetStrOptUI'
import { WidgetStrUI } from './WidgetStrUI'
import { WidgetMardownUI } from './WidgetMarkdownUI'
import { LabelPos } from 'src/controls/IWidget'

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    req: R.Widget
    labelPos?: LabelPos
    rootKey: string
    vertical?: boolean
}) {
    const { rootKey, req } = p
    let tooltip: Maybe<string>
    let label: Maybe<string>
    label = req.input.label ?? rootKey
    tooltip = req.input.tooltip

    const LABEL = (
        <div
            style={{ minWidth: '5rem' }}
            className={
                p.vertical //
                    ? 'min-w-max shrink-0'
                    : 'min-w-max shrink-0 text-right'
            }
        >
            {tooltip && (
                <Whisper placement='topStart' speaker={<Tooltip>{tooltip}</Tooltip>}>
                    <I.InfoOutline className='mr-2 cursor-pointer' />
                </Whisper>
            )}
            {label}
        </div>
    )
    const WIDGET = (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
            <WidgetUI req={req} />
        </ErrorBoundary>
    )
    const className = p.vertical //
        ? 'flex flex-col items-baseline'
        : 'flex flex-row gap-2 items-baseline'

    if (p.labelPos === 'end') {
        return (
            <div className={className} key={rootKey}>
                {WIDGET}
                {LABEL}
            </div>
        )
    } else {
        return (
            <div className={className} key={rootKey}>
                {LABEL}
                {WIDGET}
            </div>
        )
    }
})

/**
 * this widget will then dispatch the individual requests to the appropriate sub-widgets
 * collect the responses and submit them to the back once completed and valid.
 */
// prettier-ignore
export const WidgetUI = observer(function WidgetUI_(p: { req: R.Widget; focus?: boolean }) {
    const req = p.req
    if (req == null) return <>NULL</>
    if (req instanceof R.Widget_seed)               return <WidgetSeedUI        req={req} />
    if (req instanceof R.Widget_int)                return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_intOpt)             return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_float)              return <WidgetNumUI         req={req} />
    if (req instanceof R.Widget_floatOpt)           return <WidgetNumOptUI      req={req} />
    if (req instanceof R.Widget_str)                return <WidgetStrUI         req={req} />
    if (req instanceof R.Widget_strOpt)             return <WidgetStrOptUI      req={req} />
    if (req instanceof R.Widget_image)              return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_imageOpt)           return <WidgetSelectImageUI req={req} />
    if (req instanceof R.Widget_list)               return <WidgetListUI        req={req} />
    if (req instanceof R.Widget_group)              return <WidgetGroupUI       req={req} />
    if (req instanceof R.Widget_groupOpt)           return <WidgetGroupOptUI    req={req} />
    if (req instanceof R.Widget_size)               return <WigetSizeUI         req={req} />
    if (req instanceof R.Widget_enum)               return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_enumOpt)            return <WidgetEnumUI        req={req} />
    if (req instanceof R.Widget_matrix)             return <WidgetMatrixUI      req={req} />
    if (req instanceof R.Widget_bool)               return <WidgetBoolUI        req={req} />
    if (req instanceof R.Widget_prompt)             return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_promptOpt)          return <WidgetPromptUI      req={req} />
    if (req instanceof R.Widget_loras)              return <WidgetLorasUI       req={req} />
    if (req instanceof R.Widget_color)              return <WidgetColorUI       req={req} />
    if (req instanceof R.Widget_selectOne)          return <WidgetSelectOneUI   req={req} />
    if (req instanceof R.Widget_choice)             return <WidgetChoiceUI      req={req} />
    if (req instanceof R.Widget_choices)            return <WidgetChoicesUI     req={req} />
    if (req instanceof R.Widget_markdown)           return <WidgetMardownUI     req={req} />
    if (req instanceof R.Widget_selectMany)         return <>TODO</>
    if (req instanceof R.Widget_selectManyOrCustom) return <>TODO</>
    if (req instanceof R.Widget_selectOneOrCustom)  return <>TODO</>

    exhaust(req)
    console.log(`🔴`, (req as any).type, req)
    return <Message type='error' showIcon>
        <div>{(req as any).type}</div>
        <div>{(req as any).constructor.name}</div>
        <div>{typeof (req as any)}</div>
        not supported
     </Message>
})
