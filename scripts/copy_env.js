import fs from 'fs';
import path from 'path';

const exampleEnvPath = path.join(process.cwd(), '.example.env');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath) && fs.existsSync(exampleEnvPath)) {
  fs.copyFileSync(exampleEnvPath, envPath);
  console.log('.example.env has been copied to .env');
}
