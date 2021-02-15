import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ImageNameTextField from '../ImageNameTextField/index.js';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function SimpleModal(props) {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [snackBarOpen, setSnackBarOpen] = React.useState(false);

    const [isError, setIsError] = React.useState(false);
    const [nameTextFieldValue, setNameTextFieldValue] = React.useState('');
    const [nameTextFieldHelperText, setNameTextFieldHelperText] = React.useState('');


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackBarOpen(false);
    };

    const nameTextFieldOnChange = (event) => {
        setNameTextFieldValue(event.target.value);
    }

    const saveButtonPressed = () => {

        setIsError(false);
        setNameTextFieldHelperText('');

        if (nameTextFieldValue.length < 2 || nameTextFieldValue.length > 16) {
            setIsError(true);
            setNameTextFieldHelperText('Name has to be between 3 and 16 characters');
            return;
        }

        if (!isError) {
            props.saveButton(nameTextFieldValue);
            setSnackBarOpen(true);
            setOpen(false);
        }
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Save Image</h2>
            <p id="simple-modal-description">
                What name do you wish the image to have?
      </p>
            <ImageNameTextField
                isError={isError}
                nameTextFieldValue={nameTextFieldValue}
                nameTextFieldOnChange={(index) => nameTextFieldOnChange(index)}
                nameTextFieldHelperText={nameTextFieldHelperText}
            />
            <button onClick={() => saveButtonPressed()}>Save</button>
        </div>
    );

    return (
        <div>
            <button type="button" onClick={handleOpen}>
                Save
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>

            <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar}>
                <Alert onClose={handleCloseSnackBar} severity="success">
                    Your drawing has been saved!
                </Alert>
            </Snackbar>

        </div>
    );
}
