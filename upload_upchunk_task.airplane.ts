import airplane from "airplane"

import Mux from '@mux/mux-node';

export default airplane.task(
	{
		slug: "upload_upchunk_task",
		name: "upload-upchunk-task",
		// Extract the value of the MUX keys from the Airplane config variables
		envVars: {
			MUX_TOKEN: { config: "MUX_TOKEN" },
			MUX_SECRET_KEY: { config: "MUX_SECRET_KEY" }
		}
	},
	// This is your task's entrypoint. When your task is executed, this
	// function will be called.
	async () => {

		// Create a new instance of the Mux Node SDK and initialize it with your credentials
		const { Video } = new Mux(process.env.MUX_TOKEN || "", process.env.MUX_SECRET_KEY || "");
		
		// Use the Mux SDK to create a new authenticated upload URL
		const muxUploadUrl = (await Video.Uploads.create({
			cors_origin: 'https://airplane.dev',
			new_asset_settings: {
				playback_policy: 'public',
			},
		})).url;

		// Send the authenticated URL back to the view
		return muxUploadUrl

	}
)

