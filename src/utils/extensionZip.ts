import JSZip from 'jszip';
import { EXTENSION_FILES } from '../data/extensionFiles';

export async function downloadExtensionZip(): Promise<void> {
  const zip = new JSZip();

  // Add all source files to root of zip
  for (const file of EXTENSION_FILES) {
    zip.file(file.path, file.code);
  }

  // Add popup.css
  try {
    const popupCssResp = await fetch('/extension/popup.css');
    if (popupCssResp.ok) {
      zip.file('popup.css', await popupCssResp.text());
    }
  } catch (err) {
    console.warn('Could not bundle popup.css via fetch', err);
  }

  // Add icons
  const iconsFolder = zip.folder('icons');
  if (iconsFolder) {
    const sizes = [16, 48, 128];
    for (const size of sizes) {
      try {
        const resp = await fetch(`/extension/icons/icon${size}.png`);
        if (resp.ok) {
          const blob = await resp.blob();
          iconsFolder.file(`icon${size}.png`, blob);
        }
      } catch (e) {
        console.warn(`Icon ${size} fetch fallback`, e);
      }
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deceptiveshield-chrome-extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
