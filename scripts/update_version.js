import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const newVersion = process.argv[2];

if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error(`Version format <${newVersion}> isn't correct, proper format is <0.0.0>`);
  process.exit(1);
}

async function updateVersions() {
  const packageJsonFiles = await fg('**/package.json', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/dist/**']
  });

  for (const file of packageJsonFiles) {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const packageJson = JSON.parse(content);
    
    if (packageJson.version) {
      packageJson.version = newVersion;
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    }
  }

  console.log(`Updated versions to ${newVersion}`);
}

updateVersions().catch(console.error);
