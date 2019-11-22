import React from 'react';
import ReactDOM from 'react-dom';

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {filename: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }
    

    handleSubmit(event) {
        event.preventDefault();
        alert(
            'Selected file - ' + this.fileInput.current.files[0].name
        ); 
    }

    render() {
        return (
            <div>
                <input type="file" ref={this.fileInput} id="imageLeft" name="imageLeft" accept=".jpg,.png"/>
                <br/>
            </div>

        );
    }
}

export default FileInput;