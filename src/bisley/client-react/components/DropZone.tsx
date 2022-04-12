import * as React from 'react';
import { useDrop } from 'react-dnd';

interface IDropZoneProps {
    acceptType: string
    canDrop(item: string): boolean
    onDrop(item: string): void
    children: JSX.Element
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function DropZone(props: IDropZoneProps): React.ReactElement {
    const [, ref] = useDrop({
        accept: props.acceptType,
        canDrop: (_, monitor) => {
            const item = monitor.getItem<{ id: string }>();

            return props.canDrop(item.id);
        },
        drop: (_, monitor) => {
            const item = monitor.getItem<{ id: string }>();

            props.onDrop(item.id);
        },
    });

    return (
        <div ref={ref}>
            {props.children}
        </div>
    );
}
