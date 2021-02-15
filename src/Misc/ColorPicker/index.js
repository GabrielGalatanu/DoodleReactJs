import React, { useState } from 'react';

import { ChromePicker } from 'react-color'

import ClickAwayListener from '@material-ui/core/ClickAwayListener';


function ColorPicker(props) {


  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [pickerColor, setPickerColor] = useState('#2e08e8');

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleClickAway = () => {
    setDisplayColorPicker(false);  
  };

  const onColorChange = (color) => {
    setPickerColor(color.hex);
    props.onChangeColor(color.hex);
  }

  const popover = {
    position: 'absolute',
    zIndex: '2',
  }
  const cover = {
    position: 'block',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <button onClick={() => handleClick()}>{props.buttonLabel}</button>
        {displayColorPicker ? <div style={popover}>
          <div style={cover} onClick={() => handleClose()} />
          <ChromePicker
            color={pickerColor}
            onChange={color => onColorChange(color)}
          />
        </div> : null}
      </div>
    </ClickAwayListener>
  )

}

export default ColorPicker;
