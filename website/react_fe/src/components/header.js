import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: 'Stereoscopic Image Analyzer'}
    }

    returnText() {
        return(this.state.text);
    }

    render() {
        return (
            <h2>{this.returnText()}</h2>
        );
    }
}

export default Header;