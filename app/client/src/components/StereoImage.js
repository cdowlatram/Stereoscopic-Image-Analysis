import React, { Component } from 'react';

class Canvas extends React.Component {  
  constructor(props) {
    super(props);
    this.setPoint = this.setPoint.bind(this);
  }

  componentDidMount() {
    this.setImage(this.props.file)
  }

  componentDidUpdate() {
    this.setImage(this.props.file)
  }

  setImage = file => {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var reader = new FileReader();
    reader.onload = event => {
        var img = new Image();
        img.onload = () => {
            let imageRatio = this.props.width / img.width
            canvas.width = img.width * imageRatio
            canvas.height = img.height * imageRatio
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
            let refpt1 = this.props.points.referencePt1,
                refpt2 = this.props.points.referencePt2,
                measurept1 = this.props.points.measurePt1,
                measurept2 = this.props.points.measurePt2

            if(refpt1 !== ''){
              ctx.fillRect(refpt1.x,refpt1.y,1,1);
            }
            if(refpt2 !== ''){
              ctx.fillRect(refpt2.x,refpt2.y,1,1);
              ctx.beginPath();
              ctx.moveTo(refpt1.x, refpt1.y);
              ctx.lineTo(refpt2.x, refpt2.y);
              ctx.stroke();
            }

            if(measurept1 !== ''){
              ctx.fillRect(measurept1.x,measurept1.y,3,3);
            }
            if(measurept2 !== ''){
              ctx.fillRect(measurept2.x,measurept2.y,3,3);
              ctx.beginPath();
              ctx.moveTo(measurept1.x, measurept1.y);
              ctx.lineTo(measurept2.x, measurept2.y);
              ctx.stroke();
            }
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  setPoint = event => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    let coord = canvas.getBoundingClientRect();
    let x = Math.round(event.clientX - coord.left);
    let y = Math.round(event.clientY - coord.top);

    if(this.props.canvasMode === 'reference'){
      if (this.props.points.referencePt1 === '') {
        this.props.setPoint("referencePt1", x, y)
      } else if (this.props.points.referencePt2 === '') {
        this.props.setPoint("referencePt2", x, y)
      } else {
        this.props.setPoint("referencePt1", '', '')
        this.props.setPoint("referencePt2", '', '')
        this.props.setPoint("referencePt1", x, y)
      }
    }

    if (this.props.canvasMode === 'measure') {
      if (this.props.points.measurePt1 === '') {
        this.props.setPoint("measurePt1", x, y)
      } else if (this.props.points.measurePt2 === '') {
        this.props.setPoint("measurePt2", x, y)
      } else {
        this.props.setPoint("measurePt1", '', '')
        this.props.setPoint("measurePt2", '', '')
        this.props.setPoint("measurePt1", x, y)
      }
    }

    // Renders the point(s) on canvas
    // renderImage(0);
    // ctx.beginPath();
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(300, 150);
    // ctx.stroke();
  }

  render() {
    return(
      <canvas 
        ref="canvas" 
        width={this.props.width} 
        height={250} 
        onClick={this.setPoint}
      />
    )
  }
}

class StereoImage extends Component {
  constructor(props) {
    super(props);
    this.changeImage = this.changeImage.bind(this);
    this.setPoint = this.setPoint.bind(this);
  }

  setPoint = (point, x, y) => {
    this.props.setPoint(point, x, y)
  }

  changeImage = event => {
    this.props.onImageChange(this.props.idName, event.target.files[0])
  }

  onClickHandler = event => {
    this.props.onImageChange(this.props.idName, "")
  }

  render() {
    let upload;
    if (this.props.image === "") {
      upload = <label htmlFor={this.props.idName} className="upload-box d-flex justify-content-center align-items-center"
                  style={{width: this.props.resizeWidth+'px'}}>
                  <div>{this.props.labelText}</div>
                </label>;
    } else {
      upload = 
        <span className="canvaspane">
          <Canvas 
            width={this.props.resizeWidth} 
            file={this.props.image} 
            canvasMode={this.props.canvasMode} 
            points={this.props.points}
            setPoint={this.setPoint}
          /><br/>
          <label onClick={this.onClickHandler} htmlFor={this.props.idName}>Clear Image</label>
        </span>
    }

    return (
      <span>
        {upload}
        <input 
          type="file" 
          id={this.props.idName} 
          name={this.props.idName} 
          onChange={this.changeImage}
          className="inputfile"
          accept=".jpg,.png"
        />
      </span>
    );
  }
}

export default StereoImage;
