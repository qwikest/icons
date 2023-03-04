import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { configs } from "./configs";

const baseLicense = (year: number, name: string) => `MIT License ${year} ${name}

Copyright (c) Year Niklas Portmann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Icons are taken from other projects. Please check each individual license for usage:

`;

const filename = "LICENSE";

async function run() {
  const license = baseLicense(new Date().getFullYear(), "Niklas Portmann");
  const iconLicenses = configs
    .map((config) => `${config.name}: ${config.license}\n${config.licenseUrl}`)
    .join("\n\n");

  const fileContent = license + iconLicenses;
  const currentFileContent = await readFile(filename);

  if (fileContent.trim() === currentFileContent.toString().trim()) {
    console.log("Skipping license update. Nothing changed");
    return;
  }

  await writeFile(filename, license + iconLicenses);
  [`git add ${filename}`, `git commit -m "Update license"`].forEach(execSync);
}

run();
