import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { type Backend, createActor } from "../backend";
import type { CreateActorOptions } from "../backend";

type UploadFn = Parameters<typeof createActor>[1];
type DownloadFn = Parameters<typeof createActor>[2];

function boundCreateActor(
  canisterId: string,
  uploadFile: UploadFn,
  downloadFile: DownloadFn,
  options: CreateActorOptions,
): Backend {
  return createActor(canisterId, uploadFile, downloadFile, options);
}

export function useActor(): { actor: Backend | null; isFetching: boolean } {
  return useActorBase(boundCreateActor);
}
