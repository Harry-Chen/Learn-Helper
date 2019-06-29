export function initiateFileDownload(url: string, filename?: string) {
  browser.downloads
    .download({
      url,
      filename,
    })
    .then(id => {
      console.log(`Download ${url} starts with id ${id}`);
    })
    .catch(e => {
      console.log(`Download ${url} failed: ${e}`);
    });
}
