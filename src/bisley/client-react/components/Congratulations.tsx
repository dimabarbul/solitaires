import * as React from 'react';

interface ICongratulationsProps {
}

interface ICongratulationsState {
}

export default class Congratulations extends React.Component<ICongratulationsProps, ICongratulationsState> {
    public render(): React.ReactElement {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                fontSize: 'x-large',
            }}
        >Congratulations! You won!</div>;
    }
}