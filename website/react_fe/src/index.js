
import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header';
import Container from './components/container';

function App() {
    return (
        <div>
            <Header />
            <Container/>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));



// const newElement = <header><h2>Stereoscopic Image Analyzer</h2></header>
// ReactDOM.render(newElement, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
