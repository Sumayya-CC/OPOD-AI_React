import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { fabric } from "fabric";

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

  const [canvas, setCanvas] = useState("");
  const [coord, setCoord] = useState("");

  const initCanvas = (props) => {
    let canvas = new fabric.Canvas("canvas", {});

    let rectangle, isDown, origX, origY, coordinates_info;

    let deleteIcon =
      "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    var img = document.createElement("img");
    img.src = deleteIcon;

    canvas.on("mouse:down", function (o) {
      var pointer = canvas.getPointer(o.e);
      if (!isDown) {
        isDown = true;
        origX = pointer.x;
        origY = pointer.y;
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = "red";
        fabric.Object.prototype.cornerStyle = "circle";
        rectangle = new fabric.Rect({
          left: origX,
          top: origY,
          fill: "",
          stroke: "red",
          strokeWidth: 1,
          selectable: true,
          transparentCorners: false,
        });
        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
        coordinates_info = {
          coordinates: canvas._activeObject.lineCoords,
          left: canvas._activeObject.left,
          top: canvas._activeObject.top,
          canvas_width: canvas.width,
          canvas_height: canvas.height,
        };
        setCoord(coordinates_info);
      }
    });

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: "pointer",
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    });

    function deleteObject(eventData, target) {
      canvas.remove(rectangle);
      canvas.requestRenderAll();
    }

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    canvas.on("mouse:move", function (o) {
      if (!isDown) return false;
      var pointer = canvas.getPointer(o.e);
      if (origX > pointer.x) {
        rectangle.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        rectangle.set({ top: Math.abs(pointer.y) });
      }

      rectangle.set({ width: Math.abs(origX - pointer.x) });
      rectangle.set({ height: Math.abs(origY - pointer.y) });
    });

    canvas.on("mouse:up", function (o) {
      isDown = false;

      if (canvas._activeObject) {
        canvas.off("mouse:down");
      } else {
        if (
          canvas._activeObject === null &&
          canvas._objects.length >= 0 &&
          canvas._objects.length < 1
        ) {
          canvas.on("mouse:down", function (o) {
            var pointer = canvas.getPointer(o.e);
            isDown = true;
            origX = pointer.x;
            origY = pointer.y;
            fabric.Object.prototype.transparentCorners = false;
            fabric.Object.prototype.cornerColor = "red";
            fabric.Object.prototype.cornerStyle = "circle";
            rectangle = new fabric.Rect({
              left: origX,
              top: origY,
              fill: "",
              stroke: "red",
              strokeWidth: 1,
              selectable: true,
              transparentCorners: false,
            });
            canvas.add(rectangle);
            canvas.setActiveObject(rectangle);
            coordinates_info = {
              coordinates: canvas._activeObject.lineCoords,
              left: canvas._activeObject.left,
              top: canvas._activeObject.top,
              canvas_width: canvas.width,
              canvas_height: canvas.height,
            };
            setCoord(coordinates_info);
          });
        }
      }
    });

    new fabric.Image.fromURL(
      props.nextImage && props.nextImage.data.link,
      function (oImg) {
        canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / oImg.width,
          scaleY: canvas.height / oImg.height,
        });
      }
    );
  };

  useEffect(() => {
    setCanvas(initCanvas(props));
    setCoord();
  }, [props]);

  useEffect(() => {
    setCoord(coord);
  }, [coord]);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Grid container spacing={0} justify="center">
        <Grid item xs={12} md={12} lg={12} align="center">
          <Paper className={classes.paper} elevation={0}>
            <canvas id="canvas" {...props} width="400" height="400" />
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
                  style={{
                    marginRight: "3em",
                    marginLeft: "3em",
                    marginTop: "3em",
                  }}
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
                            coordinates: coord && coord,
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
                            coordinates: coord && coord,
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
                            coordinates: coord && coord,
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
