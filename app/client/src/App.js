import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import ImagePanel from './components/ImagePanel';
// import Sidebar from './components/Sidebar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        files: {
          imageLeft: '',
          imageRight: '',
        },
        cameraParams: {
          focalLength: '',
          sensorWidth: '',
        },
        DisparityParams: {
          minDisparity: 1,
          numDisparity: 80,
        },
        userPoints: {
          referencePt1: '',
          referencePt2: '',
          referenceLength: '',
          measurePt1: '',
          measurePt2: '',
        },
      },
      estimatedDistance: '',
      image_width: '',
      image_height: '',
      validPoints: '',
      currentStep: 1,
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
    return (
      <div className="App">
        <header>
          <nav className="navbar fixed-top">
            <span className="navbar-brand">Stereoscopic Image Analyzer</span>
          </nav>
        </header>
        <div className="Main d-flex justify-content-between">
          <ImagePanel
            files={this.state.params.files}
            validPoints={this.state.validPoints}
            userPoints={this.state.params.userPoints}
            currentStep={this.state.currentStep}
            updateState={this.handeStateUpdate}
          />
          {/*
          <Sidebar 
            params={this.state.params}
            updateState={this.handeStateUpdate}
          />
        */}
        </div>
      </div>
    );
  }
}

export default App;
