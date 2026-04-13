import { l as loadConfig, H as HttpAgent } from "./index-D-r3OyPr.js";
async function uploadVideoToStorage(_videoBytes, _onProgress) {
  const config = await loadConfig();
  new HttpAgent({ host: config.backend_host });
  throw new Error(
    "Video upload is not supported. Please use a video URL instead."
  );
}
export {
  uploadVideoToStorage
};
