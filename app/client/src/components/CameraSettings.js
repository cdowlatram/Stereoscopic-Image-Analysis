import React, { Component } from 'react';

class CameraSettings extends Component {
  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
  }

  predictFocal() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ focalLength: res }));
  }

  changeSetting = event => {
    this.props.onSettingsChange(event.target.name, event.target.value)
  }

  onClickHandler = event => {
    this.predictFocal();
  }

  render() {
    return (
      <div className="text-left">
        <label htmlFor="focalLength">Focal Length</label>
        <div className="input-group mb-3">
          <input type="text" 
            id="focalLength" 
            name="focalLength" 
            className="form-control" 
            onChange={this.changeSetting}
            value={this.props.focalLength}/>
          <div className="input-group-append">
            <span className="input-group-text">mm</span>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span>Don't know the focal length?</span>
          <button type="button" className="btn btn-secondary" onClick={this.onClickHandler}>Predict for me</button>
        </div>

        <hr/>

        <label htmlFor="sensorWidth">Sensor Width</label>
        <div className="input-group mb-3">
          <input type="text" 
            id="sensorWidth" 
            name="sensorWidth" 
            className="form-control" 
            onChange={this.changeSetting}
            value={this.props.sensorWidth}/>
          <div className="input-group-append">
            <span className="input-group-text">mm</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CameraSettings;
