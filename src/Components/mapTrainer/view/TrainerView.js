import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Carousel from "react-material-ui-carousel";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

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
    marginTop: "5em",
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
    background: "transparent",
    boxShadow: "none",
    borderRadius: 0,
    marginBottom: "2em",
    width: "auto",
    height: "auto",
    "&:hover": { backgroundColor: "white" },
  },
}));

export default function TrainerView(props) {
  const classes = useStyles();
  console.log(props);
  return (
    <div className={classes.root}>
      <CssBaseline />

      <Grid container spacing={0} justify="center">
        <Grid item xs={12} md={12} lg={12} align="center">
          <Paper className={classes.paper} elevation={0}>
            <Carousel
              next={() => props.getNextImage && props.getNextImage()}
              prev={() => console.log("Previous")}
              autoPlay={false}
              navButtonsAlwaysInvisible={true}
            >
              <Card className={classes.customCard} id="resultCardMap">
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={props.nextImage && props.nextImage.data.link}
                    title="trainer preview"
                  />
                  <CardContent className="custom-card-content">
                    <Grid container spacing={0}></Grid>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Carousel>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={12} align="center">
          {props.classesOfImage &&
            props.classesOfImage.map((i, j) => {
              return (
                <Button
                  component="span"
                  variant="contained"
                  className={`button-text-1 ${
                    i === "right" ? "button-style-2" : "button-style-1"
                  } ${i === "wrong" ? "button-style-3" : "button-style-1"} ${
                    i === "unrelated" ? "button-style-4" : "button-style-1"
                  }`}
                  style={{ marginRight: "3em", marginLeft: "3em" }}
                  onClick={() => {
                    let data;
                    switch (i) {
                      case "skip":
                        props.getNextImage && props.getNextImage();
                        break;
                      case "right":
                        data = {
                          data: {
                            link: props.nextImage && props.nextImage.data.link,
                            classified: "yes",
                            class: "right",
                            id: props.nextImage && props.nextImage.data.id,
                          },
                        };
                        props.saveData && props.saveData(data);
                        break;
                      case "wrong":
                        data = {
                          data: {
                            link: props.nextImage && props.nextImage.data.link,
                            classified: "yes",
                            class: "wrong",
                            id: props.nextImage && props.nextImage.data.id,
                          },
                        };
                        props.saveData && props.saveData(data);
                        break;
                      case "unrelated":
                        data = {
                          data: {
                            link: props.nextImage && props.nextImage.data.link,
                            classified: "yes",
                            class: "unrelated",
                            id: props.nextImage && props.nextImage.data.id,
                          },
                        };
                        props.saveData && props.saveData(data);
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  {i}
                </Button>
              );
            })}
        </Grid>
      </Grid>
    </div>
  );
}
