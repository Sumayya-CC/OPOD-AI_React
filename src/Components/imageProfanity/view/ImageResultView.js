import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import domtoimage from "dom-to-image";
import { saveAs } from 'file-saver';

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

export default function ImageResultView(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Image result grid and container */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Box
              fontWeight="fontWeightRegular"
              mt={3}
              ml={4}
              mb={5}
              className="sub-heading-1"
            >
              Result
            </Box>

            <Container maxWidth="sm" className={classes.customContainer}>
              {props.imgValue && props.imgValue.result !== null && (
                <React.Fragment>
                  <Card className={classes.customCard} id="resultCard">
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={props.imgValue.result}
                        title="result preview"
                      />
                      <CardContent className="custom-card-content">
                        <Grid container spacing={0}>
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography
                              variant="h5"
                              component="h2"
                              className="heading-1"
                            >
                              Is safe to use ?
                            </Typography>
                            {props.data &&
                              props.data.is_safe === true &&
                              props.data.predictions.sfw < 0.75 && (
                                <React.Fragment>
                                  <div className="image-caution image-container-1"></div>
                                  <Typography
                                    variant="body2"
                                    component="p"
                                    className="body-text-1"
                                  >
                                    Use with caution
                                  </Typography>
                                </React.Fragment>
                              )}
                            {props.data &&
                              props.data.is_safe === true &&
                              props.data.predictions.sfw > 0.75 && (
                                <React.Fragment>
                                  <div className="image-safe image-container-1"></div>
                                  <Typography
                                    variant="body2"
                                    component="p"
                                    className="body-text-1"
                                  >
                                    Safe to use
                                  </Typography>
                                </React.Fragment>
                              )}
                            {props.data && props.data.is_safe === false && (
                              <React.Fragment>
                                <div className="image-not-safe image-container-1"></div>
                                <Typography
                                  variant="body2"
                                  component="p"
                                  className="body-text-1"
                                >
                                  Not safe to use
                                </Typography>
                              </React.Fragment>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography
                              variant="h5"
                              component="h2"
                              className="heading-1"
                            >
                              Predictions
                            </Typography>

                            <Typography
                              variant="body2"
                              component="p"
                              className="body-text-1"
                            >
                              Safe for work
                            </Typography>
                            {props.data && props.data.predictions.sfw > 0.75 && (
                              <Typography
                                variant="body2"
                                component="p"
                                className="prob-text-safe"
                              >
                                {Math.round(props.data.predictions.sfw * 100) +
                                  "%"}
                              </Typography>
                            )}
                            {props.data &&
                              props.data.predictions.sfw < 0.75 &&
                              props.data.predictions.sfw > 0.5 && (
                                <Typography
                                  variant="body2"
                                  component="p"
                                  className="prob-text-caution"
                                >
                                  {Math.round(
                                    props.data.predictions.sfw * 100
                                  ) + "%"}
                                </Typography>
                              )}
                            {props.data && props.data.predictions.sfw < 0.5 && (
                              <Typography
                                variant="body2"
                                component="p"
                                className="prob-text-not-safe"
                              >
                                {Math.round(props.data.predictions.sfw * 100) +
                                  "%"}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Button
                    mt={3}
                    component="span"
                    variant="contained"
                    className="button-style-1 button-text-1"
                    onClick={() => {
                      domtoimage
                        .toBlob(document.getElementById("resultCard"))
                        .then((blob) => saveAs(blob, "result"));
                    }}
                  >
                    Download Result
                  </Button>
                </React.Fragment>
              )}
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
