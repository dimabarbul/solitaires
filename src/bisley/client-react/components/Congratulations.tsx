import * as React from 'react';

interface ICongratulationsProps {
}

interface ICongratulationsState {
}

export default class Congratulations extends React.Component<ICongratulationsProps, ICongratulationsState> {
    public render(): React.ReactElement {
        return <div>Congratulations! You won!</div>;
    }
}