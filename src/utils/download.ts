export function initiateFileDownload(url: string, filename?: string) {
  browser.downloads.download({
    url,
    filename,
  });
}
