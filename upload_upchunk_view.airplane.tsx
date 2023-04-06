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

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const { output: result } = useTaskQuery({ slug: "upload_upchunk_task" });

  const handleUpload = async (inputRef) => {
    console.log("Upload called. URL exists: " + (result !== null))
    if (!result)
      return
    try {
      const url = result;

      const upload = UpChunk.createUpload({
        endpoint: url, // Authenticated url
        file: inputRef.files[0], // File object with your video file’s properties
        chunkSize: 512, // Uploads the file in ~0.5 MB chunks
      });

      // Subscribe to events
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
