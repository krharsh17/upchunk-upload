import airplane from "airplane"

import Mux from '@mux/mux-node';

export default airplane.task(
	{
		slug: "upload_upchunk_task",
		name: "upload-upchunk-task",
		envVars: {
			MUX_TOKEN: { config: "MUX_TOKEN" },
			MUX_SECRET_KEY: { config: "MUX_SECRET_KEY" }
		}
	},
	// This is your task's entrypoint. When your task is executed, this
	// function will be called.
	async () => {

		const { Video } = new Mux(process.env.MUX_TOKEN || "", process.env.MUX_SECRET_KEY || "");
		const muxUploadUrl = (await Video.Uploads.create({
			cors_origin: 'https://airplane.dev',
			new_asset_settings: {
				playback_policy: 'public',
			},
		})).url;

		console.log("Mux upload URL created: " + JSON.stringify(muxUploadUrl))

		return muxUploadUrl

	}
)

