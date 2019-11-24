import React from 'react';
import LoadingScreen from './LoadingScreen';

class MeasurePoints extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      loadingMessage: 'Measuring distance between selected points...'
    };
  }

  predictLength = () => {
    this.setState({isLoading: true});

    // TODO: Do local data validation

    let form = new FormData();
    form.append('image_left_name', this.props.params.imageLeftName);
    form.append('image_right_name', this.props.params.imageRightName);
    form.append('focal_length', this.props.params.focalLength);
    form.append('sensor_width', this.props.params.sensorWidth);
    form.append('min_disparity', this.props.params.minDisparity);
    form.append('num_disparity', this.props.params.numDisparity);
    form.append('window_size', '9');

    let reference_points = `${this.props.params.referencePt1.x},${this.props.params.referencePt1.y}`;
    reference_points += `,${this.props.params.referencePt2.x},${this.props.params.referencePt2.y}`;

    let measurement_points = `${this.props.params.measurePt1.x},${this.props.params.measurePt1.y}`;
    measurement_points += `,${this.props.params.measurePt2.x},${this.props.params.measurePt2.y}`;

    form.append('reference_points', reference_points);
    form.append('reference_length', this.props.params.referenceLength);
    form.append('measurement_points', measurement_points);
    
    let request = new XMLHttpRequest();
    let react = this;
    request.onreadystatechange = function() {
      if(this.readyState === 4) { 
        if(this.status === 200) {
          // errorLog.innerHTML = '';
          react.props.updateAppState({
            estimatedDistance: Math.round(JSON.parse(this.responseText)["distance"]).toString()
          });
        } else {
          // errorLog.innerHTML = this.responseText;
        }
        react.setState({isLoading: false});
      }
    };
    request.open("POST", "http://localhost:9000/estimate_distance");
    request.send(form);
  }

  render() {
    return (
      <div>
        <LoadingScreen 
          isLoading={this.state.isLoading}
          loadingMessage={this.state.loadingMessage}
        />
        
        <h2 className="mb-4">Points to Measure</h2>
        <p>Click on the image to set two points you would like the measurement of.</p>

        <div className="mt-4 mb-5">
          <button type="button" className="btn btn-secondary" onClick={this.props.clearPoints}>Clear Measurement Points</button>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span>Predict Measurement</span>
          <button type="button" className="btn btn-primary" onClick={this.predictLength}>Measure</button>
        </div>
      </div>
    )
  }
}

export default MeasurePoints;