


                <div>
                  { estimatedDistance !== '' &&
                  <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <span className="mr-5"><strong className="mr-3">Estimated Length:</strong> {estimatedDistance} {this.state.measureUnit}</span>
                    </div>
                    <div></div>
                  </div>
                  }

                  { this.props.currentStep > 3 &&
                  <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <span className="mr-5"><strong className="mr-3">Reference Length:</strong> {this.state.referenceLength} {this.state.referenceUnit}</span>
                    </div>
                    <div><button type="button" className="btn btn-secondary">Edit</button></div>
                  </div>
                  }

                  { this.props.currentStep > 2 &&
                    <div className="parameter-box d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <span className="mr-5"><strong className="mr-3">Focal Length:</strong> {this.state.focalLength} mm</span>
                        <span><strong className="mr-3">Sensor Width: {this.state.sensorWidth} mm</strong></span>
                      </div>
                      <div><button type="button" className="btn btn-secondary">Edit</button></div>
                    </div>
                  }
                </div>