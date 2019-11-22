import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import StereoImage from './components/StereoImage';

class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasMode: 'view'
    }
    this.updateParentState = this.updateParentState.bind(this);
  }

  updateParentState = () => {
    this.props.updateState({});
  }

  render() {
    const imagesUploaded = (this.props.files.imageLeft !== '' && this.props.files.imageLeft !== '')
    return (
      <div className="image-panel col d-flex justify-content-center">
        <div>
          <TransitionGroup component={null}>
            {this.props.currentStep == 1 && imagesUploaded && (
              <CSSTransition classNames="fade" timeout={300}>
                <div className="text-right mb-3">
                  <button type="button" className="btn btn-primary" onClick={this.handleOnclickNext}>Continue &rsaquo;</button>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>


          <TransitionGroup component={null}>
            {this.props.currentStep == 1 && !imagesUploaded && (
              <CSSTransition classNames="fade" timeout={150}>
                <h2 className="mb-3">Please upload your matching left and right  images</h2>
              </CSSTransition>
            )}
          </TransitionGroup>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <StereoImage 
              idName="imageLeft"
              image={this.props.files.imageLeft}
              labelText="Click to Upload Left Image"
              resizeWidth="540"
              onImageChange={this.handleChange}
              canvasMode={this.props.canvasMode}
              points={points}
              validPoints={this.props.validPoints}
              setPoint={this.setPoint}
            />

            <TransitionGroup component={null}>
              {this.props.currentStep === 1 && (
                <CSSTransition classNames="fade" timeout={0}>
                  <div className="ml-3">
                    <StereoImage 
                      idName="imageRight"
                      image={this.props.files.imageRight} 
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

          { this.props.currentStep > 4 &&
          <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="mr-5">Estimated Length: {this.props.estimatedDistance}</span>
            </div>
            <div><button type="button" className="btn btn-secondary">Edit</button></div>
          </div>
          }

          { this.props.currentStep > 3 &&
          <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="mr-5">Reference Length: {this.props.referenceLength}</span>
            </div>
            <div><button type="button" className="btn btn-secondary">Edit</button></div>
          </div>
          }

          { this.props.currentStep > 2 &&
            <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="mr-5">Focal Length: {this.props.focalLength} mm</span>
                <span>Sensor Width: {this.props.sensorWidth} mm</span>
              </div>
              <div><button type="button" className="btn btn-secondary">Edit</button></div>
            </div>
          }

        </div>
      </div>
    );
  }
}

export default ImagePanel;
