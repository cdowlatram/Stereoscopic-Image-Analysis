import React, { Component } from 'react';
import LoadingScreen from './LoadingScreen';

class DisparitySettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      loadingMessage: 'Calculating valid points on image...'
    };

    this.changeSetting = this.changeSetting.bind(this);
    this.setValidPoints = this.setValidPoints.bind(this);
  }

  getValidPoints = (minDisparity, numDisparity) => {
    this.setState({isLoading: true});

    // TODO: Do local data validation
    
    let form = new FormData();
    form.append('image_left_name', this.props.params.imageLeftName);
    form.append('image_right_name', this.props.params.imageRightName);
    form.append('focal_length', this.props.params.focalLength);
    form.append('sensor_width', this.props.params.sensorWidth);
    form.append('min_disparity', minDisparity);
    form.append('num_disparity', numDisparity);
    form.append('window_size', '9');
    
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          react.changeSetting('errorLog', '');
          react.setValidPoints(this.response["is_valid"], this.response["points"]);
          react.props.nextStep()
        } else {
          react.changeSetting('errorLog', this.response);
        }
        react.setState({isLoading: false});
      }
    };
    request.open("POST", "http://localhost:9000/valid_points");
    request.send(form);
  }


  setValidPoints = (is_valid, points) => {
    let i, j,
        width = parseInt(this.props.imageWidth),
        height = parseInt(this.props.imageHeight);
    let array = [];

    // Set initial valid values for points
    for(i=0; i < width; i++) {
      array[i] = [];
      for(j=0; j < height; j++) {
        array[i][j] = !is_valid;
      }
    }

    // Set valid/invalid points
    for(i=0; i < points.length; i++) {
      let x = points[i][0],
          y = points[i][1];

      array[x][y] = is_valid;
    }

    this.changeSetting('validPoints', array);
  }

  changeSetting = (name, value) => {
    this.props.onSettingsChange({[name]: value});
  }

  onChangeHandler = event => {
    this.props.onSettingsChange({[event.target.name]: event.target.value});
  }

  onClickHandler = () => {
    this.getValidPoints();
  }

  render() {
    return (
      <div>
        <LoadingScreen 
          isLoading={this.state.isLoading}
          loadingMessage={this.state.loadingMessage}
        />

        <label htmlFor="numDisparity">Number of Disparity</label>
        <div className="input-group mb-3">
          <input type="text" 
            id="numDisparity" 
            name="numDisparity" 
            className="form-control" 
            onChange={this.onChangeHandler}
            value={this.props.params.numDisparity}/>
        </div>

        <hr/>

        <label htmlFor="minDisparity">Minimum Disparity</label>
        <div className="input-group mb-3">
          <input type="text" 
            id="minDisparity" 
            name="minDisparity" 
            className="form-control" 
            onChange={this.onChangeHandler}
            value={this.props.params.minDisparity}/>
        </div>



        <div className="text-right mt-5">
          <button type="button" className="btn btn-primary" onClick={this.onClickHandler}>Continue &rsaquo;</button>
        </div>
      </div>
    );
  }
}

export default DisparitySettings;
