import { observer, useLocalObservable } from 'mobx-react-lite'
import { Loader } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { LightBoxUI } from '../LightBox'
import { GalleryHoveredPreviewUI } from '../galleries/GalleryHoveredPreviewUI'
import { PanelConfigUI } from './PanelConfigUI'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    const project = st.db.projects.first()
    const action = st.action
    const uiSt = useLocalObservable(() => ({ sizes: [500, 100] }))
    if (project == null)
        return (
            <>
                <Loader />
                <PanelConfigUI action={{ type: 'config' }} />
            </>
        )
    return (
        <div className='flex-grow flex flex-col h-full'>
            <projectContext.Provider value={project} key={project.id}>
                <GalleryHoveredPreviewUI />
                <div
                    id='hovered-graph'
                    className='absolute top-3 left-3 right-3 bottom-3 [z-index:2000] overflow-auto pointer-events-none'
                    style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
                />
                <LightBoxUI lbs={st.lightBox} />
                <st.layout.UI />

                {/* <Pane className='col'>
                    {action.type === 'paint' ? ( //
                        <WidgetPaintUI action={action} />
                    ) : action.type === 'comfy' ? (
                        <ComfyUIUI action={action} />
                    ) : action.type === 'form' ? (
                        <GraphUI depth={1} />
                    ) : action.type === 'iframe' ? (
                        <iframe className='grow' src={action.url} frameBorder='0'></iframe>
                    ) : (
                        <PanelConfigUI action={action} />
                    )}
                </Pane> */}
            </projectContext.Provider>
        </div>
    )
})
