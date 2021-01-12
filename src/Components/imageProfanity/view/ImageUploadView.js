import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

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
}));

export default function ImageUploadView(props) {
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [err, setErr] = useState(false);
  const [tempUrl, setTempURL] = useState("");
  const [url, setURL] = useState("");

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

  function validateURL(event) {
    let urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );

    let validationRes = !!urlPattern.test(event.target.value);

    if (validationRes) {
      setErr(false);
      let data = {
        "image_url" : event.target.value
      }
      setTempURL(JSON.stringify(data));
    } else {
      setErr(true);
      setTempURL("");
    }
  }

  function submitUrl() {
    setURL(tempUrl);
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

  useEffect(() => {
    if (props && url) {
      props.sendImgLink(url);
    }
  }, [url, props]);

  useEffect(() => {
    setErr(err);
  }, [err]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Image upload grid and container */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Grid container>
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  fontWeight="fontWeightRegular"
                  mt={3}
                  ml={3}
                  mb={5}
                  className="sub-heading-1"
                >
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
              </Grid>
              {/*Image URL upload*/}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  fontWeight="fontWeightRegular"
                  mt={3}
                  ml={3}
                  mb={5}
                  className="sub-heading-1"
                >
                  Paste Image URL
                </Box>
                <Container maxWidth="lg" style={{ display: "flex" }}>
                  <TextField
                    hinttext="Image URL"
                    floatinglabeltext="Image URL"
                    name="url"
                    label="Image URL"
                    defaultValue=""
                    variant="outlined"
                    onChange={validateURL}
                    error={err}
                    size="small"
                    InputLabelProps={{ style: { fontSize: 13 } }}
                  />
                  {!err && tempUrl.length > 0 && (
                    <Button
                    component="span"
                    variant="contained"
                    className="button-style-1 button-text-1"
                    style={{ marginLeft: "1em"}}
                    onClick={submitUrl}
                  >
                    Submit
                  </Button>
                  )}
                </Container>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {imgURL && imgURL.result !== null && tempUrl === "" && url === "" && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Box
                fontWeight="fontWeightRegular"
                mt={3}
                ml={3}
                mb={5}
                className="sub-heading-1"
              >
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
