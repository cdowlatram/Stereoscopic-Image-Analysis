import React from 'react';
import LoadingScreen from './LoadingScreen';

class MeasurePoints extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: '',
      isGroundDistance: true,
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
    form.append('is_ground_distance', this.state.isGroundDistance)

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
          let responseDistance = Math.round(JSON.parse(this.responseText)["distance"]).toString();
          react.props.updateAppState({
            estimatedDistance: responseDistance
          });
          react.setState({distance: responseDistance})
        } else {
          // errorLog.innerHTML = this.responseText;
        }
        react.setState({isLoading: false});
      }
    };
    request.open("POST", "http://localhost:9000/estimate_distance");
    request.send(form);
  }

  updateMeasureUnit = event => {
    const target = event.target;
    const value = target.value;

    this.props.updateAppState({
      measureUnit: value
    });
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
        <div className="text-left">
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-mm" className="custom-control-input" 
              name="referenceUnit"
              value="mm"
              checked={this.props.measureUnit === "mm"}
              onChange={this.updateMeasureUnit}/>
            <label className="custom-control-label" htmlFor="unit-mm">mm</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-cm" className="custom-control-input" 
              name="referenceUnit"
              value="cm"
              checked={this.props.measureUnit === "cm"}
              onChange={this.updateMeasureUnit}/>
            <label className="custom-control-label" htmlFor="unit-cm">cm</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-m" className="custom-control-input" 
              name="referenceUnit"
              value="m"
              checked={this.props.measureUnit === "m"}
              onChange={this.updateMeasureUnit}/>
            <label className="custom-control-label" htmlFor="unit-m">m</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-in" className="custom-control-input" 
              name="referenceUnit"
              value="in"
              checked={this.props.measureUnit === "in"}
              onChange={this.updateMeasureUnit}/>
            <label className="custom-control-label" htmlFor="unit-in">in</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-ft" className="custom-control-input" 
              name="referenceUnit"
              value="ft"
              checked={this.props.measureUnit === "ft"}
              onChange={this.updateMeasureUnit}/>
            <label className="custom-control-label" htmlFor="unit-ft">ft</label>
          </div>
        </div>

        <div className="mt-4 mb-5">
          <button type="button" className="btn btn-secondary" onClick={this.props.clearPoints}>Clear Measurement Points</button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-5">
          <span>Predict Measurement</span>
          <button type="button" className="btn btn-primary" onClick={this.predictLength}>Measure</button>
        </div>

        { this.props.estimatedDistance !== '' &&
          (<div className="parameter-box d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="mr-5"><strong className="mr-3">Estimated Length:</strong> {this.props.estimatedDistance} {this.props.measureUnit}</span>
            </div>
            <div></div>
          </div>)
        }
      </div>
    )
  }
}

export default MeasurePoints;