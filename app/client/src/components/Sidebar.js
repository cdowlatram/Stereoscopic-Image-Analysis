import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CameraSettings from './CameraSettings';
import DisparitySettings from './DisparitySettings';
import ReferencePoints from './ReferencePoints';
import MeasurePoints from './MeasurePoints';
import angleright from '../icons/AngleRight.svg';
import anglerightwhite from '../icons/AngleRightWhite.svg';

class Sidebar extends Component {

  clearPoints = () => {
    this.props.updateState({
      [this.props.canvasMode + 'Pt1']: '',
      [this.props.canvasMode + 'Pt2']: '',
    })
  }

  onChangeHandler = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.updateState({
      [name]: value
    });
  }

  render() {
    return (
      <TransitionGroup component={null}>
        { this.props.currentStep !== 1 && this.props.currentStep !== 3 && this.props.currentStep !== 6  &&
          <CSSTransition key="sidebar" classNames="slide" timeout={300}>
          <div className="side-panel d-flex justify-content-center">
            <div className="side-panel__content">
              
              
              <TransitionGroup component={null}>
                { this.props.currentStep === 2 &&
                  <CSSTransition key="step2" classNames="fadeSlide" timeout={300}>
                    <div className="side-panel__entry">
                      <div className="mb-5">
                        <span className="clickable d-flex align-items-center" onClick={this.props.handleOnclickBack}>
                          <img className="mr-3" src={angleright}/> Back
                        </span>
                      </div>

                      <h2 className="mb-4">Camera Settings</h2>
                      <CameraSettings 
                        imageName={this.props.params.imageLeftName}
                        focalLength={this.props.params.focalLength} 
                        sensorWidth={this.props.params.sensorWidth} 
                        onSettingsChange={this.props.updateState}
                        />

                      <div className="text-right mt-5">
                        <button type="button" className="continue ml-auto btn btn-primary d-flex align-items-center" onClick={this.props.handleOnclickNext}>
                          Continue <img className="ml-2" src={anglerightwhite}/>
                        </button>
                      </div>
                    </div>
                  </CSSTransition>
                }
              </TransitionGroup>
                
              <TransitionGroup component={null}>
                { this.props.currentStep === 3 &&
                  <CSSTransition key="step3" classNames="fadeSlide" timeout={300}>
                    <div className="side-panel__entry">
                      <div className="mb-5">
                        <span className="clickable d-flex align-items-center" onClick={this.props.handleOnclickBack}>
                          <img className="mr-3" src={angleright}/> Back
                        </span>
                      </div>

                      <DisparitySettings 
                        params={this.props.params}
                        onSettingsChange={this.props.updateState}
                        setValidPoints={this.props.updateState}
                        imageWidth={this.props.calculatedParams.image_width}
                        imageHeight={this.props.calculatedParams.image_height}
                        validPoints={this.props.calculatedParams.validPoints}
                        nextStep={this.props.handleOnclickNext}
                        errorLog={""}
                      />

                    </div>
                  </CSSTransition>
                }
              </TransitionGroup>

              <TransitionGroup component={null}>
              { this.props.currentStep === 4 &&
                <CSSTransition key="step4" classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-5">
                      <span className="clickable d-flex align-items-center" onClick={this.props.handleOnclickBack}>
                        <img className="mr-3" src={angleright}/> Back
                      </span>
                    </div>

                    <ReferencePoints 
                      referenceLength={this.props.referenceLength}
                      clearPoints={this.clearPoints}
                      referenceUnit={this.props.referenceUnit}
                      onChangeHandler={this.onChangeHandler}
                      updateState={this.props.updateState}
                    />

                    <div className="text-right mt-5">
                      <button type="button" className="continue ml-auto btn btn-primary d-flex align-items-center" onClick={this.props.handleOnclickNext}>
                        Continue <img className="ml-2" src={anglerightwhite}/>
                      </button>
                    </div>
                  </div>
                </CSSTransition>
              }
            </TransitionGroup>

              <TransitionGroup component={null}>
              {/* Step  5*/ this.props.currentStep === 5 &&
                <CSSTransition key="step5" classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-5">
                      <span className="clickable d-flex align-items-center" onClick={this.props.handleOnclickBack}>
                        <img className="mr-3" src={angleright}/> Back
                      </span>
                    </div>

                    <MeasurePoints 
                      params={this.props.params}
                      updateAppState={this.props.updateState}
                      clearPoints={this.clearPoints}
                      nextStep={this.props.handleOnclickNext}
                      errorLog={""}
                    />
                    
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
