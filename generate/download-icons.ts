import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import got from "got";
import StreamZip from "node-stream-zip";
import { join } from "path";
import { IconPackConfig } from "./config.interface";

const basePath = "download";

export async function downloadIcons(pack: IconPackConfig) {
  if (!pack.download) {
    throw new Error("Download key required in pack for downloading.");
  }

  const outputPath = join(basePath, pack.name);
  const zipName = pack.name + ".zip";
  const zipPath = join(basePath, zipName);
  await mkdir(outputPath, { recursive: true });

  const download = got
    .stream(pack.download.zip)
    .pipe(createWriteStream(zipPath));

  await new Promise((fulfill, reject) => {
    download.on("close", fulfill);
    download.on("error", reject);
  });

  const zip = new StreamZip.async({ file: zipPath });
  await zip.extract(pack.download.folder, outputPath);
  await zip.close();
}
