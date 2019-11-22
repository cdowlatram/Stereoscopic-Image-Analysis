
import React from 'react';
import FileInput from './fileinput';

class CanvasInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>Choose the matching left and right stereograms.</h3>
                <FileInput/>
                <FileInput/>
            </div>
        );
    }
}

export default CanvasInput;