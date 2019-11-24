
import React from 'react';
// import CanvasInput from './canvasinput';

class CanvasContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <canvas id="canvas"></canvas>
            </div>
        );
    }
}

export default CanvasContainer;