import React, { Component } from 'react';
import LoadingScreen from './LoadingScreen';
import angleright from '../icons/AngleRight.svg';

class DisparityMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: ['','','','','','','','',''],
      errorLog: '',
      isLoading: false,
      loadingMessage: 'Creating disparity maps...'
    }

    this.setValidPoints = this.setValidPoints.bind(this);
  }

  componentDidMount() {
    this.getDisparityMaps();
  }

  getDisparityMaps = () => {
    this.setState({
      loadingMessage: 'Creating disparity maps...',
      isLoading: true
    });

    // TODO: Do local data validation
    
    let form = new FormData();
    form.append('image_left_name', this.props.params.imageLeftName);
    form.append('image_right_name', this.props.params.imageRightName);
    form.append('focal_length', this.props.params.focalLength);
    form.append('sensor_width', this.props.params.sensorWidth);
    form.append('session_id', this.props.session);
    
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          react.setState({errorLog: ''});
          react.setState({images: this.response});
        } else {
          react.setState({errorLog: this.response});
        }
        react.setState({isLoading: false});
      }
    };
    request.open("POST", "http://localhost:9000/disparity_maps");
    request.send(form);
  }

  getValidPoints = () => {
    this.setState({
      loadingMessage: 'Getting valid selection points on image...',
      isLoading: true
    });

    // TODO: Do local data validation
    
    let form = new FormData();
    form.append('image_left_name', this.props.params.imageLeftName);
    form.append('image_right_name', this.props.params.imageRightName);
    form.append('focal_length', this.props.params.focalLength);
    form.append('sensor_width', this.props.params.sensorWidth);
    form.append('min_disparity', this.props.params.minDisparity);
    form.append('num_disparity', this.props.params.numDisparity);
    form.append('window_size', '9');
    
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          react.props.updateState({errorLog: this.response});
          react.setValidPoints(this.response["is_valid"], this.response["points"]);
          react.props.handleOnclickNext()
        } else {
          this.props.updateState({errorLog: this.response});
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
    this.props.updateState({validPoints: array})
  }

  onClickHandler = () => {
    this.getValidPoints();
  }

  setDisparity = (minDisparity, numDisparity) => {
    this.props.updateState({
      minDisparity: parseInt(minDisparity),
      numDisparity: parseInt(numDisparity),
    })
    this.getValidPoints()
  }

  render() {
    const disparityStyle = {
      width: this.props.mapWidth+'px',
      height: this.props.mapHeight+'px'
    };

    const images = this.state.images;
    const disparitymaps = images.map((image, index) =>
      <div className="col-4 p-3" key={index} >
          {typeof(image.image_name) === 'undefined'&& (
            <div className="disparity-map" style={disparityStyle}>
            </div>
          )}
          {typeof(image.image_name) !== 'undefined'&& (
            <div className="disparity-map active" style={disparityStyle}>
              <img 
                src={'http://localhost:9000/images/' + image.image_name} 
                alt={"Min Disparities: " + image.min_disparity + ", # of Disparities: " + image.num_disparity} 
                title={"Min Disparities: " + image.min_disparity + ", # of Disparities: " + image.num_disparity}
                onClick={this.setDisparity.bind(null, image.min_disparity,image.num_disparity)}
              />
            </div>
          )}
      </div>
    );

    return (
      <div>
        <LoadingScreen 
          isLoading={this.state.isLoading}
          loadingMessage={this.state.loadingMessage}
        />
        <div className="mb-5">
          <span className="clickable d-flex align-items-center" onClick={this.props.handleOnclickBack}>
            <img className="mr-3" src={angleright} alt=""/> Back
          </span>
        </div>
        <div className="mb-3">
          <p>
            Click image that appears to be the clearest (Where objects of interest look distinct)
          </p>
        </div>
        <div className="disparity-maps row justify-content-between">
          {disparitymaps}
        </div>
      </div>
    );
  }
}

export default DisparityMaps;
