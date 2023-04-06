import {
  Stack,
  Heading,
  useTaskQuery,
} from "@airplane/views";
import airplane from "airplane";
import { useState } from "react";
import * as UpChunk from '@mux/upchunk';

// Put the main logic of the view here.
// Views documentation: https://docs.airplane.dev/views/getting-started
const UploadUpchunkView  = () => {

  // Create state containers for progress and status messages
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Use a query to generate an authenticated upload URL for Upchunk
  const { output: uploadUrl } = useTaskQuery({ slug: "upload_upchunk_task" });

  // Define a function that handles file upload via UpChunk
  const handleUpload = async (inputRef) => {

    // If the upload URL is not ready, return without uploading
    if (!uploadUrl)
      return
    
    try {

      // Create an UpChunk upload instance
      const upload = UpChunk.createUpload({
        endpoint: uploadUrl,       // Authenticated upload url
        file: inputRef.files[0],   // File to be uploaded
        chunkSize: 512,            // ~0.5 MB chunk size for the upload
      });

      // Subscribe to progress, success, and error events
      upload.on('error', error => {
        setStatusMessage(error.detail);
      });

      upload.on('progress', progress => {
        setProgress(progress.detail);
      });

      upload.on('success', () => {
        setStatusMessage("File uploaded! 👋");
      });
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Stack>
        <Heading>Uploading File in Chunks</Heading>
      
        <label htmlFor="file-picker">Select an mp4 file:</label>
        <input type="file" onChange={(e) => handleUpload(e.target)}
          id="file-picker" name="file-picker" />

        <label htmlFor="upload-progress">Uploading progress:</label>
        <progress value={progress} max="100" />

        <em>{statusMessage}</em>

    </Stack>
  );
};


export default airplane.view(
  {
    slug: "upload_upchunk_view",
    name: "upload-upchunk-view",
  },
  UploadUpchunkView
);
