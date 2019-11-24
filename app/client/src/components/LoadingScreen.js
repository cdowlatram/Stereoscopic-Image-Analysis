import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

class LoadingScreen extends Component {

  render() {
    const loadingMessage = <p>{this.props.loadingMessage}</p>

    return (
      <TransitionGroup component={null}>

        {this.props.isLoading && (
          <CSSTransition classNames="fade" timeout={300}>
            <div className="loading">
              <div className="arc"></div>
              <div className="innerarc"></div>
              <div className="loading-text">
                {loadingMessage}
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }
}

export default LoadingScreen;
