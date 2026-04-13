import { loadConfig } from "@caffeineai/core-infrastructure";
import { HttpAgent } from "@icp-sdk/core/agent";

export async function uploadVideoToStorage(
  _videoBytes: Uint8Array,
  _onProgress?: (pct: number) => void,
): Promise<string> {
  const config = await loadConfig();
  const _agent = new HttpAgent({ host: config.backend_host });
  // Video storage via object-storage extension is not enabled for this project.
  // Reel video upload is not supported in the current configuration.
  throw new Error(
    "Video upload is not supported. Please use a video URL instead.",
  );
}
