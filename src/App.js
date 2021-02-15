import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Knob from './Misc/Knob/index.js';
import ColorPicker from './Misc/ColorPicker/index.js';
import SaveButtonModal from './Misc/SaveButtonModal/index.js';

import SingleLineGridList from './Misc/SingleLineGridList/index.js';

function App() {

  var canvasRef = useRef(null);
  var contextRef = useRef(null);


  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(700);

  const [knobX, setKnobX] = useState(1000 / 4);
  const [knobY, setKnobY] = useState(700 / 4);
  const [oldKnobX, setOldKnobX] = useState(1000 / 4);
  const [oldKnobY, setOldKnoxY] = useState(700 / 4);

  const [drawingColor, setDrawingColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#4d2600');

  const [imagesArray, setImagesArray] = useState([]);
  const [imagesArrayCloud, setImagesArrayCloud] = useState([]);

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
  }
  Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
  }

  useEffect(() => {
    

    getCloudImages();

    var canvas = canvasRef.current;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth / 2}px`;
    canvas.style.height = `${canvasHeight / 2}px`;

    const context = canvas.getContext("2d");

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = drawingColor;
    context.lineWidth = 5;
    contextRef.current = context;

    setImagesArray(localStorage.getObj('Images'));

    
  }, [])

  useEffect(() => {

    contextRef.current.strokeStyle = drawingColor;

  }, [drawingColor])

  useEffect(() => {

    contextRef.current.fillStyle = backgroundColor;
    contextRef.current.fillRect(0, 0, canvasWidth, canvasHeight);

  }, [backgroundColor])

  useEffect(() => {

    contextRef.current.beginPath()

    contextRef.current.moveTo(oldKnobX, oldKnobY);
    contextRef.current.lineTo(knobX, knobY);
    contextRef.current.stroke();

    contextRef.current.closePath();

    setOldKnobX(knobX);
    setOldKnoxY(knobY);

  }, [knobX, knobY])

  const getCloudImages = () => {
    async function getImages() {
      try {

        const response = await fetch('http://localhost:2999/image');
        const json = await response.json();
        var arrayImagesCloud = Object.values(json);

        var tempImages = [];
        arrayImagesCloud.forEach(function (image, key) {
          tempImages.push({ img: image.imageBase64, name: image.image.name })
        });

        setImagesArrayCloud(tempImages);

      } catch (error) {

        console.log(error);

      }
    }
    getImages();
  }

  const saveDrawing = (name) => {

    if (localStorage.getItem('Images') == null) {
      var arrayImages = [];
    } else {
      var arrayImages = localStorage.getObj('Images');
    }

    arrayImages.push({ img: canvasRef.current.toDataURL(), name: name });
    localStorage.setObj('Images', arrayImages);
    setImagesArray(localStorage.getObj('Images'));

  }

  const uploadHandle = (index) => {
    var images = localStorage.getObj('Images');

    var image = new Image();
    image.src = images[index];

    var array = [];
    array.push({ 'image': images[index] });

    const request = {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(array)
      //body: JSON.stringify({ title: 'React POST Request Example' })

    }

    async function uploadImage() {
      try {

        const response = await fetch('http://localhost:2999/image', request);
        const json = await response.json();

        if (json.status == 'Ok') {
          setSnackBarOpen(true);
          getCloudImages();
        }

      } catch (error) {

        console.log(error);

      }
    }
    uploadImage();

  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };



  return (
    <div className='container'>

      <div className="topContainer">
        <div className="topContainerLeft">
          <div className='saveButton'>
            <SaveButtonModal
              saveButton={(name) => saveDrawing(name)}
            />
          </div>
        </div>
        <div className="topContainerRight">
          <div className="topContainerRightButtonLeft">
            <ColorPicker
              buttonLabel={'Drawing Color'}
              onChangeColor={color => setDrawingColor(color)}
            />
          </div>
          <div className="topContainerRightButtonRight">
            <ColorPicker
              buttonLabel={'Background Color'}
              onChangeColor={color => setBackgroundColor(color)}
            />
          </div>
        </div>
      </div>


      <div className="drawingCanvasContainer">
        <div className="drawingControls">
          <Knob
            textLabel={'Left/Right'}
            maxValue={canvasWidth / 2}
            currentValue={knobX}
            onChange={(index) => setKnobX(index)}
          />

          <Knob
            textLabel={'Up/Down'}
            maxValue={canvasHeight / 2}
            currentValue={knobY}
            onChange={(index) => setKnobY(index)}
          />
        </div>
        <div>

          <canvas className="drawingCanvas"
            ref={canvasRef}
          />

        </div>

      </div>
     
      <div className="imagesGridListContainer">
        Locally:
        <SingleLineGridList
          imagesArray={imagesArray}
          uploadHandle={(index) => uploadHandle(index)}
          displayCloudButton={true}
        />
        Cloud:
        <SingleLineGridList
          imagesArray={imagesArrayCloud}
          uploadHandle={(index) => uploadHandle(index)}
          displayCloudButton={false}
        />

      </div>

      <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="success">
          Image succesfully uploaded to cloud!
        </Alert>
      </Snackbar>

    </div>
  );
}

export default App;
