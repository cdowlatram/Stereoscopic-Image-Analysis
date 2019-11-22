import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import StereoImage from './components/StereoImage';
import CameraSettings from './components/CameraSettings';
import DisparitySettings from './components/DisparitySettings';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLeft: '',
      imageRight: '',
      focalLength: '',
      sensorWidth: '',
      minDisparity: 1,
      numDisparity: 80,
      referencePt1: '',
      referencePt2: '',
      referenceLength: '',
      measurePt1: '',
      measurePt2: '',
      estimatedDistance: '',
      canvasMode: 'view',
      image_width: '',
      image_height: '',
      validPoints: '',
      currentStep: 1,
      errorLog: '',
    };
  }

  handleOnclickBack = () => {
    const back = this.state.currentStep - 1
    const step = Math.max(1, back)
    this.setState({
      currentStep: step,
      canvasMode: 'view'
    });

    if(step === 4)
      this.setState({canvasMode: 'reference'});
    if(step === 5)
      this.setState({canvasMode: 'measure'});
  }

  handleOnclickNext = () => {
    const next = this.state.currentStep + 1
    const step = Math.min(6, next)
    this.setState({currentStep: step});
    if(step === 4)
      this.setState({canvasMode: 'reference'});
    if(step === 5)
      this.setState({canvasMode: 'measure'});
  }

  handleChange = (name, value) => {
    this.setState({[name]: value});
  }

  onChangeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  setPoint = (point, x, y) => {
    if (x === '' || y === '') {
      this.setState({
        [point]: ""
      });
    } else {
      this.setState({
        [point]: {
          x: x,
          y: y
        }
      });
    }
  }

  setValidPoints = (is_valid, points) => {
    this.setState({
      validPoints: {
        is_valid: is_valid,
        points: points
      }
    })
  }

  render() {
    const isStep1 = (this.state.currentStep === 1),
          isStep2 = (this.state.currentStep === 2),
          isStep3 = (this.state.currentStep === 3),
          isStep4 = (this.state.currentStep === 4),
          isStep5 = (this.state.currentStep === 5),
          isStep6 = (this.state.currentStep === 6),
          imagesUploaded = (this.state.imageLeft !== '' && this.state.imageRight !== '')

    const points = {
      referencePt1: this.state.referencePt1,
      referencePt2: this.state.referencePt2,
      measurePt1: this.state.measurePt1,
      measurePt2: this.state.measurePt2,
    }

    return (
      <div className="App">
        <header>
          <nav className="navbar fixed-top">
            <span className="navbar-brand">Stereoscopic Image Analyzer</span>
          </nav>
        </header>
        <div className="Main d-flex justify-content-between">
          <div className="image-panel col d-flex justify-content-center">
            <div>
              <TransitionGroup component={null}>
                {isStep1 && imagesUploaded && (
                  <CSSTransition classNames="fade" timeout={300}>
                    <div className="text-right mb-3">
                      <button type="button" className="btn btn-primary" onClick={this.handleOnclickNext}>Continue &rsaquo;</button>
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>


              <TransitionGroup component={null}>
                {isStep1 && !imagesUploaded && (
                  <CSSTransition classNames="fade" timeout={150}>
                    <h2 className="mb-3">Please upload your matching left and right  images</h2>
                  </CSSTransition>
                )}
              </TransitionGroup>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <StereoImage 
                  idName="imageLeft"
                  image={this.state.imageLeft}
                  labelText="Click to Upload Left Image"
                  resizeWidth="540"
                  onImageChange={this.handleChange}
                  canvasMode={this.state.canvasMode}
                  points={points}
                  validPoints={this.state.validPoints}
                  setPoint={this.setPoint}
                />

                <TransitionGroup component={null}>
                  {this.state.currentStep === 1 && (
                    <CSSTransition classNames="fade" timeout={0}>
                      <div className="ml-3">
                        <StereoImage 
                          idName="imageRight"
                          image={this.state.imageRight} 
                          labelText="Click to Upload Right Image"
                          resizeWidth="540"
                          onImageChange={this.handleChange}
                          canvasMode="right_image"
                          points={points}
                          validPoints=""
                          setPoint={this.setPoint}
                        />
                      </div>
                    </CSSTransition>
                  )}
                </TransitionGroup>
              </div>

              { this.state.currentStep > 4 &&
              <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="mr-5">Estimated Length: {this.state.estimatedDistance}</span>
                </div>
                <div><button type="button" className="btn btn-secondary">Edit</button></div>
              </div>
              }

              { this.state.currentStep > 3 &&
              <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="mr-5">Reference Length: {this.state.referenceLength}</span>
                </div>
                <div><button type="button" className="btn btn-secondary">Edit</button></div>
              </div>
              }

              { this.state.currentStep > 2 &&
                <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <span className="mr-5">Focal Length: {this.state.focalLength} mm</span>
                    <span>Sensor Width: {this.state.sensorWidth} mm</span>
                  </div>
                  <div><button type="button" className="btn btn-secondary">Edit</button></div>
                </div>
              }

            </div>
          </div>

          

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
        </div>
      </div>
    );
  }
}

export default App;
