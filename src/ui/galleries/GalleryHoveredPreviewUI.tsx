import { observer } from 'mobx-react-lite'
import { useSt } from '../../front/stContext'

export const GalleryHoveredPreviewUI = observer(function GalleryHoveredPreviewUI_(p: {}) {
    const st = useSt()
    if (st.hovered == null) return null
    return (
        <div>
            <>
                {/* <div
                        style={{
                            pointerEvents: 'none',
                            zIndex: 999998,
                            position: 'absolute',
                            inset: 0,
                            bottom: 0,
                            top: '5rem',
                            left: 0,
                            right: 0,
                            background: '#272727aa',
                        }}
                    ></div> */}
                <img
                    src={st.hovered.localURL}
                    style={{
                        //
                        top: '0',
                        left: 0,
                        position: 'absolute',
                        zIndex: 999999,
                        objectFit: 'contain',
                        maxHeight: '100vh',
                        maxWidth: '100vw',
                    }}
                />
            </>
        </div>
    )
})
