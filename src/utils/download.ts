export async function initiateFileDownload(url: string, filename?: string) {
  try {
    const id = await browser.downloads.download({
      url,
      filename,
    });
    console.log(`Download ${url} starts with id ${id}`);
  } catch (e) {
    console.error(`Download ${url} failed: ${e}`);
  }
}
