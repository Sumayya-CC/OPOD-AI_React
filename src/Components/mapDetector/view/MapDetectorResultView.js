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
import { saveAs } from "file-saver";
import { red } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";

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
    backgroundSize: "contain",
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
  errMsg: {
    color: red,
  },
  largeIcon: {
    width: 45,
    height: 30,
    cursor: "pointer",
  },
}));

export default function MapDetectorResultView(props) {
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
              {props && !props.data.payload && props.data.error && (
                <Typography
                  variant="body2"
                  component="p"
                  className="body-text-1-not-safe"
                >
                  {props.data.message}
                </Typography>
              )}

              {props &&
                props.data.payload &&
                props.imgValue &&
                props.imgValue.result !== null && (
                  <React.Fragment>
                    <Card className={classes.customCard} id="resultCardMap">
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={props.imgValue.result}
                          title="result preview"
                        />
                        <CardContent className="custom-card-content">
                          <Grid container spacing={0}>
                            <Grid
                              item
                              xs={12}
                              style={{ marginBottom: "2.5em" }}
                            >
                              <Typography
                                variant="h5"
                                component="h2"
                                className="heading-1"
                              >
                                Guidance
                              </Typography>

                              {props.data &&
                                props.data.payload &&
                                props.data.payload.india_classification &&
                                props.data.payload.india_classification[0]
                                  .present &&
                                props.data.payload.india_classification[0]
                                  .classification.correct_percentage >
                                  props.data.payload.india_classification[0]
                                    .classification.incorrect_percentage && (
                                  <React.Fragment>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      className="body-text-1-safe"
                                    >
                                      Possibly correct
                                    </Typography>
                                  </React.Fragment>
                                )}
                              {props.data &&
                                props.data.payload &&
                                props.data.payload.india_classification &&
                                props.data.payload.india_classification[0]
                                  .present &&
                                props.data.payload.india_classification[0]
                                  .classification.correct_percentage <
                                  props.data.payload.india_classification[0]
                                    .classification.incorrect_percentage && (
                                  <React.Fragment>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      className="body-text-1-caution"
                                    >
                                      Possibly incorrect
                                    </Typography>
                                  </React.Fragment>
                                )}
                              {/* {props.data &&
                                props.data.payload &&
                                props.data.payload.india_classification &&
                                props.data.payload.india_classification[0]
                                  .present &&
                                props.data.payload.india_classification[0]
                                  .correct_percentage <
                                  props.data.payload.india_classification[0]
                                    .incorrect_percentage && (
                                  <React.Fragment>
                                    <Typography
                                      variant="body2"
                                      component="p"
                                      className="body-text-1-not-safe"
                                    >
                                      Not safe to use
                                    </Typography>
                                  </React.Fragment>
                                )} */}
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="h5"
                                component="h2"
                                className="heading-1"
                              >
                                Disclaimer
                              </Typography>
                              <Typography
                                variant="body2"
                                component="p"
                                className="body-text-1"
                              >
                                AI guidance is indicative and human moderation
                                shall supersede. Please report incorrect
                                classification by flagging this image.
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                    <Grid container xs={12}>
                      <Grid item xs={8}>
                        <Icon
                          color="primary"
                          className={classes.largeIcon}
                          onClick={(e) =>
                            props.getMapFeedBack(e, 1, props.data.id)
                          }
                        >
                          thumb_up
                        </Icon>
                        <Icon
                          color="secondary"
                          className={classes.largeIcon}
                          onClick={(e) =>
                            props.getMapFeedBack(e, 0, props.data.id)
                          }
                        >
                          thumb_down
                        </Icon>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          mt={3}
                          component="span"
                          variant="contained"
                          className="button-style-1 button-text-1 custom-margin-left-1"
                          onClick={() => {
                            domtoimage
                              .toBlob(document.getElementById("resultCardMap"))
                              .then((blob) => saveAs(blob, "resultMap"));
                          }}
                        >
                          Download Result
                        </Button>
                      </Grid>
                    </Grid>

                    {props && props.notification && (
                      <Typography
                        variant="body2"
                        component="p"
                        className="body-text-1-safe"
                      >
                        {props.notification.message}
                      </Typography>
                    )}
                  </React.Fragment>
                )}
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
