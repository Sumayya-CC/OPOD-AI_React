import React, { useEffect, useState } from "react";
import ImageUploadView from "../view/ImageUploadView";
import ImageResultView from "../view/ImageResultView";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ImageUploadService from "../../../services/imageProfanity.service";
import ImageURLUploadService from "../../../services/imageURLProfanity.service";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    background: "#F7F8F8",
    borderRadius: 0,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ImageProfanityContainer(props) {
  const classes = useStyles();

  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [imgValue, setImgValue] = useState("");
  const [imgLink, setImgLink] = useState("");

  function getFileData(value) {
    setValue(value);
  }

  function getImageValue(value) {
    setImgValue(value);
  }

  function getImgLink(value) {
    setImgLink(value);
    setImgValue(JSON.parse(value).image_url);
  }

  useEffect(() => {
    uploadFileService(value);
  }, [value]);

  useEffect(() => {
    uploadURLService(imgLink);
  }, [imgLink]);

  function uploadFileService(value) {
    if (value && value !== undefined) {
      ImageUploadService.upload(value).then((res) => {
        if (res.data.code === 200) {
          setData(res.data);
        }
      });
    }
  }

  function uploadURLService(value) {
    if (value && value !== undefined) {
      ImageURLUploadService.urlUpload(value).then((res) => {
        if (res.data.code === 200) {
          setData(res.data);
        }
      });
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Typography component="div">
        <Box fontWeight="fontWeightBold" mt={5} ml={5} className="heading-1">
          Image Profanity
        </Box>
      </Typography>
      <Grid container spacing={0}>
        {/* Right side */}
        <Grid item xs={12} md={6} lg={6}>
          <ImageUploadView
            uploadFile={getFileData}
            sendImgValue={getImageValue}
            sendImgLink={getImgLink}
          />
        </Grid>
        {/* Left side */}
        <Grid item xs={12} md={6} lg={6}>
          <ImageResultView data={data} imgValue={imgValue} />
        </Grid>
      </Grid>
    </div>
  );
}
