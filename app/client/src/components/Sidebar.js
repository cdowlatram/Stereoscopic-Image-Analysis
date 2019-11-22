import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CameraSettings from './components/CameraSettings';
import DisparitySettings from './components/DisparitySettings';

class ImagePane extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TransitionGroup component={null}>
        { !isStep1 && !isStep6 &&
          <CSSTransition classNames="slide" timeout={300}>
          <div className="side-panel d-flex justify-content-center">
            <div className="side-panel__content">
              
              <TransitionGroup component={null}>
              { isStep2 &&
                <CSSTransition classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-4">
                      <button type="button" className="btn btn-link" onClick={this.handleOnclickBack}>Back</button>
                    </div>

                    <h2 className="mb-4">Camera Settings</h2>
                    <CameraSettings 
                      image={this.state.imageLeft}
                      focalLength={this.state.focalLength} 
                      sensorWidth={this.state.sensorWidth} 
                      onSettingsChange={this.handleChange}
                      />

                    <div className="text-right mt-5">
                      <button type="button" className="btn btn-primary" onClick={this.handleOnclickNext}>Continue &rsaquo;</button>
                    </div>
                  </div>
                </CSSTransition>
              }
              </TransitionGroup>

              <TransitionGroup component={null}>
              {/* Step  3 - Disparity settings select*/ isStep3 &&
                <CSSTransition classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-4">
                      <button type="button" className="btn btn-link" onClick={this.handleOnclickBack}>Back</button>
                    </div>

                    <DisparitySettings 
                      imageLeft={this.state.imageLeft}
                      imageRight={this.state.imageRight}
                      focalLength={this.state.focalLength}
                      sensorWidth={this.state.sensorWidth}
                      minDisparity={this.state.minDisparity}
                      numDisparity={this.state.numDisparity}
                      currentStep={this.state.currentStep}
                      imageWidth={this.state.image_width}
                      imageHeight={this.state.image_height}
                      validPoints={this.state.validPoints}
                      setValidPoints={this.setValidPoints}
                      onSettingsChange={this.handleChange}
                      errorLog={this.errorLog}
                    />
                  </div>
                </CSSTransition>
              }
              </TransitionGroup>

              <TransitionGroup component={null}>
              {/* Step  4*/ isStep4 &&
                <CSSTransition classNames="fadeSlide" timeout={300}>
                  <div className="side-panel__entry">
                    <div className="mb-4">
                      <button type="button" className="btn btn-link" onClick={this.handleOnclickBack}>Back</button>
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
                        value={this.state.referenceLength}/>
                    </div>

                    <div className="text-right mt-5">
                      <button type="button" className="btn btn-primary" onClick={this.handleOnclickNext}>Continue &rsaquo;</button>
                    </div>
                  </div>
                </CSSTransition>
              }
              </TransitionGroup>

              <TransitionGroup component={null}>
              {/* Step  5*/ isStep5 &&
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

export default ImagePane;
