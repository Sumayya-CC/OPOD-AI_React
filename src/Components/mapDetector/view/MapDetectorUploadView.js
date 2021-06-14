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
    background: "transparent",
    borderRadius: 0,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(1),
  },
  media: {
    width: "auto",
    height: "30vh",
  },
  customContainer: {
    marginLeft: "0.75em",
  },
  customCard: {
    backgroundColor: "#ffff",
    boxShadow: "none",
    borderRadius: 0,
    marginBottom: "2em",
    width: "auto",
    height: "auto",
    "&:hover": { backgroundColor: "white" },
  },
}));

export default function MapDetectorUploadView(props) {
  const classes = useStyles();

  const [selectedMapFile, setSelectedMapFile] = useState("");
  const [currentMapFile, setCurrentMapFile] = useState("");
  const [imgMapURL, setImgMapURL] = useState("");

  function selectMapUploadFile(event) {
    setSelectedMapFile(event.target.files);
    let reader = new FileReader();

    reader.onload = function () {
      var output = document.getElementById("contained-button-file-2");
      output.src = reader.result;
    };

    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      setTimeout(() => {
        setImgMapURL(reader);
      }, 250);
    }
  }

  function currentFileMapExtract(value) {
    setCurrentMapFile(value[0]);
  }

  useEffect(() => {
    currentFileMapExtract(selectedMapFile);
  }, [selectedMapFile]);

  useEffect(() => {
    if (props && currentMapFile) {
      props.uploadFile(currentMapFile);
    }
  }, [currentMapFile, props]);

  useEffect(() => {
    if (props && imgMapURL) {
      setTimeout(() => {
        props.sendImgValue(imgMapURL);
      }, 500);
    }
  }, [imgMapURL, props]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Image upload grid and container */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Box
              fontWeight="fontWeightRegular"
              mt={3}
              ml={3}
              mb={5}
              className="sub-heading-1"
            >
              Upload Map
            </Box>
            <Container maxWidth="lg">
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file-2"
                type="file"
                onChange={selectMapUploadFile}
              />
              <label htmlFor="contained-button-file-2">
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
        {imgMapURL && imgMapURL.result !== null && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Box
                fontWeight="fontWeightRegular"
                mt={3}
                ml={3}
                mb={5}
                className="sub-heading-1"
              >
                Map Preview
              </Box>
              <Container maxWidth="lg">
                <img
                  className="uploaded-preview"
                  src={imgMapURL.result}
                  alt="uploaded map data"
                />
              </Container>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
