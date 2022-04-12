import * as React from 'react';
import { useDrag } from 'react-dnd';

interface IDraggableProps {
    id: string
    type: string
    children: JSX.Element
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function Draggable(props: IDraggableProps): React.ReactElement {
    // eslint-disable-next-line @typescript-eslint/typedef
    const [{ isDragging }, ref] = useDrag({
        type: props.type,
        item: {
            id: props.id,
        },
        previewOptions: {
            captureDraggingState: false,
            anchorX: 0,
            anchorY: 0,
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return <div
        ref={ref}
        style={{
            opacity: isDragging ? 0 : 1,
        }}
    >
        {props.children}
    </div>;
}
