import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Step2 from './SidebarSteps/Step2';
import Step3 from './SidebarSteps/Step3';
import Step4 from './SidebarSteps/Step4';
import Step5 from './SidebarSteps/Step5';

class Sidebar extends Component {

  render() {
    return (
      <TransitionGroup component={null}>
        { this.props.currentStep !== 1 && this.props.currentStep !== 6 &&
          <CSSTransition classNames="slide" timeout={300}>
          <div className="side-panel d-flex justify-content-center">
            <div className="side-panel__content">
              
              
                <Step2 
                  currentStep={this.props.currentStep}
                  image={this.props.params.imageLeft}
                  focalLength={this.props.params.focalLength} 
                  sensorWidth={this.props.params.sensorWidth} 
                  onSettingsChange={this.props.updateState}
                  handleOnclickNext={this.props.handleOnclickNext}
                  handleOnclickBack={this.props.handleOnclickBack}
                />
                <Step3
                  currentStep={this.props.currentStep}
                  params={this.props.params}
                  calculatedParams={this.props.calculatedParams}
                  onSettingsChange={this.props.updateState}
                  handleOnclickNext={this.props.handleOnclickNext}
                  handleOnclickBack={this.props.handleOnclickBack}
                />

                <Step4

                />

              <TransitionGroup component={null}>
              {/* Step  5*/ this.props.currentStep === 5 &&
                <CSSTransition classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-4">
                      <button type="button" className="btn btn-link" onClick={this.handleOnclickBack}>Back</button>
                    </div>

                    <h2 className="mb-4">Points to Measure</h2>
                    <p>Click on the image to set two points you would like the measurement of.</p>

                    <div className="mt-4 mb-5">
                      <button type="button" className="btn btn-secondary">Clear Measurement Points</button>
                    </div>
            
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Predict Measurement</span>
                      <button type="button" className="btn btn-primary" onClick={this.onClickHandler}>Measure</button>
                    </div>
                  </div>
                </CSSTransition>
              }
              </TransitionGroup>

            </div>
          </div>
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default Sidebar;
