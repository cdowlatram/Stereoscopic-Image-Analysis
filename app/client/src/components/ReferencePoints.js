import React from 'react';

class ReferencePoints extends React.Component {

  updateReferenceUnit = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.props.updateState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <h2 className="mb-4">Reference Length</h2>
        <p>Click on the image to set two points for your reference length</p>

        <div className="mt-4 mb-5">
          <button type="button" className="btn btn-secondary" onClick={this.props.clearPoints}>Clear Reference Points</button>
        </div>

        <label htmlFor="referenceLength">Length of Reference Measurement</label>
        <div className="input-group mb-3">
          <input type="text" 
            id="referenceLength" 
            name="referenceLength" 
            className="form-control" 
            onChange={this.props.onChangeHandler}
            value={this.props.referenceLength}/>
        </div>
        <div className="text-left">
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-mm" className="custom-control-input" 
              name="referenceUnit"
              value="mm"
              checked={this.props.referenceUnit === "mm"}
              onChange={this.updateReferenceUnit}/>
            <label className="custom-control-label" htmlFor="unit-mm">mm</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-cm" className="custom-control-input" 
              name="referenceUnit"
              value="cm"
              checked={this.props.referenceUnit === "cm"}
              onChange={this.updateReferenceUnit}/>
            <label className="custom-control-label" htmlFor="unit-cm">cm</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-m" className="custom-control-input" 
              name="referenceUnit"
              value="m"
              checked={this.props.referenceUnit === "m"}
              onChange={this.updateReferenceUnit}/>
            <label className="custom-control-label" htmlFor="unit-m">m</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-in" className="custom-control-input" 
              name="referenceUnit"
              value="in"
              checked={this.props.referenceUnit === "in"}
              onChange={this.updateReferenceUnit}/>
            <label className="custom-control-label" htmlFor="unit-in">in</label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="unit-ft" className="custom-control-input" 
              name="referenceUnit"
              value="ft"
              checked={this.props.referenceUnit === "ft"}
              onChange={this.updateReferenceUnit}/>
            <label className="custom-control-label" htmlFor="unit-ft">ft</label>
          </div>
        </div>

      </div>
    )
  }
}

export default ReferencePoints;