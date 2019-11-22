import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import DisparitySettings from './components/DisparitySettings';

class Step3 extends Component {

  render() {
    return (
      <TransitionGroup component={null}>
        { this.props.currentStep === 3 &&
          <CSSTransition classNames="fadeSlide" timeout={300}>
            <div className="side-panel__entry">
              <div className="mb-4">
                <button type="button" className="btn btn-link" onClick={this.props.handleOnclickBack}>Back</button>
              </div>

              <DisparitySettings 
                params={this.props.params}
                onSettingsChange={this.props.updateState}
                setValidPoints={this.props.updateState}

                imageWidth={this.props.image_width}
                imageHeight={this.props.image_height}
                validPoints={this.props.validPoints}
                errorLog={""}
              />

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

export default Step3;
