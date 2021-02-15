import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch"
    }
  }
}));

export default function BasicTextFields(props) {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField 
      error={props.isError}
      value = {props.nameTextFieldValue}
      onChange = {(event) => props.nameTextFieldOnChange(event)}
      id="standard-basic" 
      label="Image Name"
      helperText={props.nameTextFieldHelperText} />
    </form>
  );
}
