import Fingerprint2 from '@fingerprintjs/fingerprintjs';

let finger: string = '';

export function getFinger(): string {
  if (!finger) {
    const f = new Fingerprint2({
      excludeUserAgent: true,
      excludeScreenResolution: true,
      excludeAvailableScreenResolution: true,
      excludeTimezoneOffset: true,
      excludeAddBehavior: true,
      excludeOpenDatabase: true,
      excludeDoNotTrack: true,
      excludePlugins: true,
      excludeAdBlock: true,
      excludeHasLiedLanguages: true,
      excludeHasLiedResolution: true,
      excludeHasLiedOs: true,
      excludeHasLiedBrowser: true,
      excludeJsFonts: true,
      excludeFlashFonts: true,
      excludePixelRatio: true,
      excludeColorDepth: true,
    });
    f.get((result, _components) => {
      finger = result;
    });
  }

  return finger;
}
