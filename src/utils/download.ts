import { type Downloads, downloads } from 'webextension-polyfill';

export async function initiateFileDownload(url: string, filename?: string) {
  try {
    const id = await downloads.download({
      url,
      filename,
    });
    console.log(`Download ${url} starts with id ${id}`);
  } catch (e) {
    const reason = e as Downloads.InterruptReason;
    console.log(`Download ${url} failed: ${reason}`);
  }
}
