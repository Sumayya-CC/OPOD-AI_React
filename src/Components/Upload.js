import React, { Component } from 'react';
import './Style.css';
import PublishIcon from '@material-ui/icons/Publish';
import { DropzoneDialog } from 'material-ui-dropzone';



class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
      open: false,
      files: []
    };

  }
  handleClose() {
    this.setState({ open: false });

  }

  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({ files: files, open: false });
    console.log('uploaded')
    // this.props.onFileChange();

  }


  handleOpen() {
    this.setState({ open: true, });
  }

  render() {

    return (
      <div>
        <div style={{ marginTop: '1%', }}>
          <DropzoneDialog
            style={{ width: '50%', height: '40%', background: '#0000FF' }}
            open={this.state.open}
            onSave={this.handleSave.bind(this)}
            acceptedFiles={[".txt", ".pdf"]}
            showPreviews={false}
            maxFileSize={500000000}
            // showPreviews = {false}
            showPreviewsInDropzone={true}
            showFileNames={true}
            onClose={this.handleClose.bind(this)}
            filesLimit={1}
            dropzoneText={"Drag & drop the file here OR"}
            dictDefaultMessage={"Upload PDF document"}
          />
          <div onClick={this.handleOpen.bind(this)} style={{                //submit
            backgroundColor: "none", color: "#000000", width: '18%', height: 40,
            textTransform: 'none', float: 'right', marginRight: '-3%', marginTop: '1%'
          }}>
            <PublishIcon color='primary'
              style={{ marginLeft: "0%", marginRight: '2%', marginTop: '2%' }} />
              Upload File
            </div>
        </div>
      </div>
    );
  }
}

export default Upload;