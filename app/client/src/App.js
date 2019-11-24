import React, { Component } from 'react';
import ImagePanel from './components/ImagePanel';
import Sidebar from './components/Sidebar';
import convert from 'convert-units';
import './App.css';
import loading from './images/source.gif';
import redocircle from './icons/RedoCircle.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: Date.now(),
      imageLeft: '',
      imageLeftName: '',
      imageRight: '',
      imageRightName: '',
      focalLength: '',
      sensorWidth: '',
      minDisparity: 32,
      numDisparity: 96,
      referencePt1: '',
      referencePt2: '',
      referenceLength: '',
      measurePt1: '',
      measurePt2: '',
      estimatedDistance: '',
      measureUnit: 'mm',
      referenceUnit: 'mm',
      canvasMode: 'view',
      image_width: 640,
      image_height: '',
      validPoints: '',
      currentStep: 1,
      errorLog: '',
    };
  }

  restart = () => {
    this.setState({
      imageLeft: '',
      imageLeftName: '',
      imageRight: '',
      imageRightName: '',
      focalLength: '',
      sensorWidth: '',
      minDisparity: 32,
      numDisparity: 96,
      referencePt1: '',
      referencePt2: '',
      referenceLength: '',
      measurePt1: '',
      measurePt2: '',
      estimatedDistance: '',
      measureUnit: 'mm',
      referenceUnit: 'mm',
      canvasMode: 'view',
      image_width: 640,
      image_height: '',
      validPoints: '',
      currentStep: 1,
      errorLog: '',
    })
  }

  handleStateUpdate = newState => {
    this.setState(newState);
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleOnclickBack = () => {
    const back = this.state.currentStep - 1
    const step = Math.max(1, back)
    let mode = 'view'

    if(step === 4)
      mode = 'reference';
    if(step === 5)
      mode = 'measure';

    this.setState({
      currentStep: step,
      canvasMode: mode
    });
  }

  handleOnclickNext = () => {
    const next = this.state.currentStep + 1
    const step = Math.min(6, next)
    let mode = 'view'

    if(step === 4)
      mode = 'reference';
    if(step === 5)
      mode = 'measure';

    this.setState({
      currentStep: step,
      canvasMode: mode
    });
  }

  getMeasurement = () => {
    let length = this.state.estimatedDistance;
    if (length === '') return length;

    let measureUnit = this.state.measureUnit;
    let referenceUnit = this.state.referenceUnit;

    length = convert(length).from(referenceUnit).to(measureUnit);
    length = Math.round(length * 100) / 100

    return length;
  }

  render() {
    const estimatedDistance = this.getMeasurement(),
          files = {
            session: this.state.session,
            imageLeft: this.state.imageLeft,
            imageRight: this.state.imageRight,
            imageLeftName: this.state.imageLeftName,
            imageRightName: this.state.imageRightName,
          },
          userPoints = {
            referencePt1: this.state.referencePt1,
            referencePt2: this.state.referencePt2,
            measurePt1: this.state.measurePt1,
            measurePt2: this.state.measurePt2,
          },
          params = {
            imageLeftName: this.state.imageLeftName,
            imageRightName: this.state.imageRightName,
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
    const unitchanger = 
          <div className="unit-changer d-flex justify-content-start align-items-center mb-3">
            <h5 className="text-nowrap mr-4 mb-0">Unit of Measure</h5>
            <div class="input-group">
              <select class="custom-select" name="measureUnit" value={this.state.measureUnit} onChange={this.handleChange}>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">inches</option>
                <option value="ft">feet</option>
              </select>
            </div>
          </div>

    return (
      <div className="App">
        <header>
          <nav className="navbar fixed-top">
            <div className="navbar-container d-flex justify-content-between align-items-center">
              <span className="navbar-brand clickable mr-auto" onClick={this.restart}>
                <img src="logo.png" alt="Stereoscopic Image Analyzer"/>
              </span>
              
                {this.state.currentStep > 1 &&
                  <span className="clickable d-flex justify-content-between align-items-center" onClick={this.restart}>
                    <img src={redocircle} className="redo-circle-svg" alt="redo" /> Start Over
                  </span>
                }
            </div>
          </nav>
        </header>
        <div className="Main d-flex justify-content-between">

          <ImagePanel
            resizeWidth={this.state.image_width}
            files={files}
            canvasMode={this.state.canvasMode}
            validPoints={this.state.validPoints}
            userPoints={userPoints}
            currentStep={this.state.currentStep}
            updateState={this.handleStateUpdate}
            handleOnclickNext={this.handleOnclickNext}
            handleOnclickBack={this.handleOnclickBack}
            unitchanger={unitchanger}
          >



          { estimatedDistance !== '' &&
          <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="mr-5"><strong className="mr-3">Estimated Length:</strong> {estimatedDistance} {this.state.measureUnit}</span>
            </div>
            <div></div>
          </div>
          }

          { this.state.currentStep > 3 &&
          <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="mr-5"><strong className="mr-3">Reference Length:</strong> {this.state.referenceLength} {this.state.referenceUnit}</span>
            </div>
            <div><button type="button" className="btn btn-secondary">Edit</button></div>
          </div>
          }

          { this.state.currentStep > 2 &&
            <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="mr-5"><strong className="mr-3">Focal Length:</strong> {this.state.focalLength} mm</span>
                <span><strong className="mr-3">Sensor Width: {this.state.sensorWidth} mm</strong></span>
              </div>
              <div><button type="button" className="btn btn-secondary">Edit</button></div>
            </div>
          }

          </ImagePanel>
          
          <Sidebar 
            params={params}
            calculatedParams={calculatedParams}
            canvasMode={this.state.canvasMode}
            currentStep={this.state.currentStep}
            updateState={this.handleStateUpdate}
            referenceUnit={this.state.referenceUnit}
            handleOnclickNext={this.handleOnclickNext}
            handleOnclickBack={this.handleOnclickBack}
          />
        </div>
      </div>
    );
  }
}

export default App;
