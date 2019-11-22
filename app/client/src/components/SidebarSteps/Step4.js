import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CameraSettings from './components/CameraSettings';

class Step4 extends Component {

  onChangeHandler = event => {
    this.props.onSettingsChange({
      [event.target.name]: event.target.value
    });
  }

  render() {
    return (
      <TransitionGroup component={null}>
        { this.props.currentStep === 4 &&
          <CSSTransition classNames="fadeSlide" timeout={300}>
            <div className="side-panel__entry">
              <div className="mb-4">
                <button type="button" className="btn btn-link" onClick={this.props.handleOnclickBack}>Back</button>
              </div>

              <h2 className="mb-4">Reference Length</h2>
              <p>Click on the image to set two points for your reference length</p>

              <div className="mt-4 mb-5">
                <button type="button" className="btn btn-secondary">Clear Reference Points</button>
              </div>

              <label htmlFor="referenceLength">Length of Reference Measurement</label>
              <div className="input-group mb-3">
                <input type="text" 
                  id="referenceLength" 
                  name="referenceLength" 
                  className="form-control" 
                  onChange={this.onChangeHandler}
                  value={this.props.referenceLength}/>
              </div>

              <div className="text-right mt-5">
                <button type="button" className="btn btn-primary" onClick={this.props.handleOnclickNext}>Continue &rsaquo;</button>
              </div>
            </div>
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default Step4;
