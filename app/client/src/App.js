import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import ImagePanel from './components/ImagePanel';
import Sidebar from './components/Sidebar';
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
      image_width: 540,
      image_height: '',
      validPoints: '',
      currentStep: 2,
      errorLog: '',
    };
  }

  handleStateUpdate = newState => {
    this.setState(newState);
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
    const files = {
            imageLeft: this.state.imageLeft,
            imageRight: this.state.imageRight,
          },
          userPoints = {
            referencePt1: this.state.referencePt1,
            referencePt2: this.state.referencePt2,
            measurePt1: this.state.measurePt1,
            measurePt2: this.state.measurePt2,
          },
          params = {
            imageLeft: this.state.imageLeft,
            imageRight: this.state.imageRight,
            focalLength: this.state.focalLength,
            sensorWidth: this.state.sensorWidth,
            minDisparity: this.state.minDisparity,
            numDisparity: this.state.numDisparity,
            referencePt1: this.state.referencePt1,
            referencePt2: this.state.referencePt2,
            referenceLength: this.state.referenceLength,
            measurePt1: this.state.measurePt1,
            measurePt2: this.state.measurePt2,
          },
          calculatedParams = {
            estimatedDistance: this.state.estimatedDistance,
            image_width: this.state.image_width,
            image_height: this.state.image_height,
            validPoints: this.state.validPoints,
          }

    return (
      <div className="App">
        <header>
          <nav className="navbar fixed-top">
            <span className="navbar-brand">Stereoscopic Image Analyzer</span>
          </nav>
        </header>
        <div className="Main d-flex justify-content-between">
          <ImagePanel
            resizeWidth={this.state.image_width}
            files={files}
            validPoints={this.state.validPoints}
            userPoints={userPoints}
            currentStep={this.state.currentStep}
            updateState={this.handleStateUpdate}
            handleOnclickNext={this.handleOnclickNext}
            handleOnclickBack={this.handleOnclickBack}
          >

          </ImagePanel>
          
          <Sidebar 
            params={params}
            calculatedParams={calculatedParams}
            currentStep={this.state.currentStep}
            updateState={this.handleStateUpdate}
            handleOnclickNext={this.handleOnclickNext}
            handleOnclickBack={this.handleOnclickBack}
          />
        </div>
      </div>
    );
  }
}

export default App;
