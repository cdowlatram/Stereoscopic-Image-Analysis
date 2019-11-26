import React, { Component } from 'react';
import LoadingScreen from './LoadingScreen';

class CameraSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      loadingMessage: 'Predicting Focal Length...'
    };

    this.changeSetting = this.changeSetting.bind(this);
  }

  predictFocal() {
    this.setState({isLoading: true});

    // TODO: Do local data validation

    let form = new FormData();
    form.append('image_name', this.props.imageName);
    
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          console.log(this.response)
          react.changeSetting("focalLength", this.response["focal_length"]);
          react.changeSetting("sensorWidth", this.response["sensor_width"]);
        } else {
          react.changeSetting("errorLog", this.responseText);
        }
        react.setState({isLoading: false});
      }
    };
    request.open("POST", "http://localhost:9000/predict_aov");
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
      <div>
        <LoadingScreen 
          isLoading={this.state.isLoading}
          loadingMessage={this.state.loadingMessage}
        />

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
