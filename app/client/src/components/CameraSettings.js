import React, { Component } from 'react';

class CameraSettings extends Component {
  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
  }

  predictFocal() {
    let image = this.props.image;
    
    // TODO: Do local data validation
    
    let form = new FormData();
    form.append('image', image);
    
    let request = new XMLHttpRequest();
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          react.changeSetting("focalLength", this.responseText);
        } else {
          react.changeSetting("errorLog", this.responseText);
        }
      }
    };
    request.open("POST", "http://localhost:9000/focal_length");
    request.send(form);
  }

  changeSetting = (name, value) => {
    this.props.onSettingsChange({[name]: value});
  }

  onChangeHandler = event => {
    this.props.onSettingsChange({[event.target.name]: event.target.value});
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
            onChange={this.onChangeHandler}
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
            onChange={this.onChangeHandler}
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
