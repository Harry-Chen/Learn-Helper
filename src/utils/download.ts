export function initiateFileDownload(url: string, filename?: string) {
  chrome.downloads.download({
    url,
    filename,
  });
}
