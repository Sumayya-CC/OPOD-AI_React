import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
    height: 160,
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
            <Box fontWeight="fontWeightRegular" mt={3} ml={4} mb={5}>
              Result
            </Box>
            <Container maxWidth="sm">
              {props.imgValue && props.imgValue.result !== null && (
                <Card width="50%" >
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={props.imgValue.result}
                      title="result preview"
                    />
                    <CardContent>
                      <Typography variant="h5" component="h2">
                      Predictions
                      </Typography>
                     
                      
                      <Typography variant="h6" component="h3">
                        Predictions
                      </Typography>
                      <Typography variant="body2" component="p">
                        India Probability: {" "}
                        {props.data &&
                          Math.round(props.data.payload.india 1.percentage_probability * 100) + "%"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
