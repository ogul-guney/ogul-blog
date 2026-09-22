import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dir, zipFolder, baseDir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (
      file === 'node_modules' ||
      file === '.git' ||
      file === 'dist' ||
      file === 'ogul-minimal-blog-netlify.zip' ||
      file === 'scripts'
    ) {
      continue;
    }
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(file);
      addFilesRecursively(fullPath, subFolder, baseDir);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(file, content);
    }
  }
}

async function main() {
  const root = process.cwd();
  addFilesRecursively(root, zip, root);
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(root, 'ogul-minimal-blog-netlify.zip'), buffer);
  console.log('Successfully generated ogul-minimal-blog-netlify.zip in root directory.');
}

main().catch(console.error);
