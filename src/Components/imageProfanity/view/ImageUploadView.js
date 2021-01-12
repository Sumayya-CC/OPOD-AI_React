import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: "none",
  },
  paper: {
    background: 'transparent',
    borderRadius: 0,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function ImageUploadView(props) {
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [imgURL, setImgURL] = useState("");

  function selectUploadFile(event) {
    setSelectedFile(event.target.files);
    let reader = new FileReader();

    reader.onload = function () {
      var output = document.getElementById("contained-button-file");
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);

    setImgURL(reader);
  }

  function currentFileExtract(value) {
    setCurrentFile(value[0]);
  }

  useEffect(() => {
    currentFileExtract(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (props && currentFile) {
      props.uploadFile(currentFile);
    }
  }, [currentFile, props]);

  useEffect(() => {
    if (props && imgURL) {
      props.sendImgValue(imgURL);
    }
  }, [imgURL, props]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Image upload grid and container */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Box fontWeight="fontWeightRegular" mt={3} ml={3} mb={5} className="sub-heading-1">
              Upload Image
            </Box>
            <Container maxWidth="lg">
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={selectUploadFile}
              />
              <label htmlFor="contained-button-file">
                <Button
                  component="span"
                  variant="contained"
                  className="button-style-1 button-text-1"
                >
                  Upload
                </Button>
              </label>
            </Container>
          </Paper>
        </Grid>
        {imgURL && imgURL.result !== null && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Box fontWeight="fontWeightRegular" mt={3} ml={3} mb={5}  className="sub-heading-1">
                Image Preview
              </Box>
              <Container maxWidth="lg">
                <img
                  className="uploaded-preview"
                  src={imgURL.result}
                  alt="uploaded data"
                />
              </Container>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
