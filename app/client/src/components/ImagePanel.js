import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import StereoImage from './StereoImage';
import anglerightwhite from '../icons/AngleRightWhite.svg';

class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.updateParentState = this.updateParentState.bind(this);
  }

  updateParentState = newState => {
    this.props.updateState(newState);
  }

  handleOnclickNext = () => {
    let nextStep = this.props.currentStep + 1;
    this.changeCurrentStep(nextStep);
  }

  handleOnclickBack = () => {
    let nextStep = this.props.currentStep - 1;
    nextStep = Math.max(0, nextStep);
    this.changeCurrentStep(nextStep);
  }

  changeCurrentStep = step => {
    this.props.updateState({
      currentStep: step
    });
  }

  setPoint = (point, x, y) => {
    this.props.updateState({
      [point]: {
        x: x,
        y: y,
      }
    });
  }

  render() {
    const imagesUploaded = (this.props.files.imageLeft !== '' && this.props.files.imageRight !== '')

    return (
      <div className="image-panel col d-flex justify-content-center">
        <div>
            <div className="image-panel__header d-flex">
              <TransitionGroup component={null}>

                {this.props.currentStep === 1 && !imagesUploaded && (
                  <CSSTransition classNames="fade" timeout={0}>
                    <h2 className="mr-auto">Please upload your matching left and right  images</h2>
                  </CSSTransition>
                )}

                {this.props.currentStep === 1 && imagesUploaded && (
                  <CSSTransition classNames="fade" timeout={0}>
                    <div className="text-right ml-auto">
                      <button type="button" className="continue btn btn-primary d-flex align-items-center" onClick={this.handleOnclickNext}>
                        Continue <img className="ml-2" src={anglerightwhite}/>
                      </button>
                    </div>
                  </CSSTransition>
                )}

                {this.props.currentStep > 4 && (
                  <CSSTransition classNames="fade" timeout={0}>
                   {this.props.unitchanger}
                  </CSSTransition>)}
              </TransitionGroup>
            </div>


            

          <div className="d-flex justify-content-between align-items-center mb-3">
            <StereoImage 
              session={this.props.files.session}
              idName="imageLeft"
              image={this.props.files.imageLeft}
              image={this.props.files.imageLeft}
              labelText="Click to Upload Left Image"
              resizeWidth={this.props.resizeWidth}
              onImageChange={this.updateParentState}
              canvasMode={this.props.canvasMode}
              points={this.props.userPoints}
              validPoints={this.props.validPoints}
              setPoint={this.setPoint}
            />

            <TransitionGroup component={null}>
              {this.props.currentStep === 1 && (
                <CSSTransition classNames="fade" timeout={0}>
                  <div className="ml-3">
                    <StereoImage 
                      session={this.props.files.session}
                      idName="imageRight"
                      image={this.props.files.imageRight}
                      imagePath={this.props.files.imageRightPath} 
                      labelText="Click to Upload Right Image"
                      resizeWidth={this.props.resizeWidth}
                      onImageChange={this.updateParentState}
                      canvasMode="imageRight"
                      points={this.props.userPoints}
                      validPoints=""
                      setPoint={this.setPoint}
                    />
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>

          {this.props.children}

        </div>
      </div>
    );
  }
}

export default ImagePanel;
