import type { Runtime } from 'src/back/Runtime'
import type { Widget } from '../controls/Widget'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { ReqResult } from 'src/controls/IWidget'
import type { CSSProperties } from 'react'

// ACTIONS ============================================================
// 1. the main abstraction of cushy are actions.
/** quick function to help build actions in a type-safe way */

// export const action = <const F extends WidgetDict>(name: string, t: Omit<Action<F>, 'name'>): Action<F> => ({ name, ...t })
export type ActionType = <const F extends WidgetDict>(t: Action<F>) => Action<F>
export type WidgetDict = { [key: string]: Widget }
export type FormResult<Req extends Widget> = ReqResult<Req>

export type Action<FIELDS extends WidgetDict> = {
    // AUTHORING ============================================================
    /** action name; default to unnamed_action_<nanoid()> */
    name: string
    /** action image that will be displayed in the tree picker */
    logo?: string
    /** this description will show-up at the top of the action form */
    description?: string
    /** tags */
    categories?: string[]
    /** dependencies of your action */
    customNodeRequired?: string[]
    /** who did that? */
    author?: string
    /** help text to show user */
    help?: string

    // UI PART ============================================================
    /** the list of dependencies user can specify */
    ui?: (form: FormBuilder /*, flow: Workflow*/) => FIELDS
    /** form container className */
    containerClassName?: string
    containerStyle?: CSSProperties

    // EXECUTION PART ============================================================
    /** the code to run */
    run: (f: Runtime, r: { [k in keyof FIELDS]: FIELDS[k]['$Output'] }) => void | Promise<void>
}

// REQUIREMENTS ============================================================
/** a set of requirements your action expect to be runnable */
export type Requirements = {
    [name: string]: Requirement
}

/** a single requirement */
export type Requirement<T = any> = {
    // the required node or value required to be present in the graph / flow
    type: string

    tag?: string | string[]
    findOrCreate?: (flow: Runtime) => T

    /** if specified, Cushy will check if missing requirements can be created to
     * know if it shoul suggest this flow or not
     */
    syncCheckIfCreationIsPossible?: () => boolean
    creationLogic?: () => T
}

// helper to build requirements in a type-safe way
export type ReqBuilder = {
    [k in keyof Requirable]: (req?: Omit<Requirement<Requirable[k]>, 'type'>) => Requirement<Requirable[k]>
}

// REQUIRABLE ============================================================
// requirements are lazylly transformed at execution time when needed by the action
export type Resolved<Reqs extends { [name: string]: Requirement }> = {
    [K in keyof Reqs]: Reqs[K] extends Requirement<infer T> ? () => T : never
}
