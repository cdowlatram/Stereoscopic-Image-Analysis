import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CameraSettings from './components/CameraSettings';

class Step5 extends Component {

  render() {
    return (
      <TransitionGroup component={null}>
        { this.props.currentStep === 5 &&
          <CSSTransition classNames="fadeSlide" timeout={300}>
            <div className="side-panel__entry">
              <div className="mb-4">
                <button type="button" className="btn btn-link" onClick={this.props.handleOnclickBack}>Back</button>
              </div>

              <h2 className="mb-4">Camera Settings</h2>
              <CameraSettings 
                image={this.props.imageLeft}
                focalLength={this.props.focalLength} 
                sensorWidth={this.props.sensorWidth} 
                onSettingsChange={this.updateState}
                />

              { this.props.currentStep === 2 &&
              <div className="text-right mt-5">
                <button type="button" className="btn btn-primary" onClick={this.props.handleOnclickNext}>Continue &rsaquo;</button>
              </div>
              }
            </div>
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default Step5;
