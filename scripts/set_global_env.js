import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');

const CLI_CEB_DEV = process.env.CLI_CEB_DEV || 'false';
const CLI_CEB_FIREFOX = process.env.CLI_CEB_FIREFOX || 'false';

function validateIsBoolean(value, key) {
  if (value !== 'true' && value !== 'false') {
    console.error(`Invalid value for <${key}>. Please use 'true' or 'false'.`);
    process.exit(1);
  }
}

function validateKey(key, isEditableSection = false) {
  if (key && !key.startsWith('#')) {
    if (isEditableSection && !key.startsWith('CEB_')) {
      console.error(`Invalid key: <${key}>. All keys in the editable section must start with 'CEB_'.`);
      process.exit(1);
    } else if (!isEditableSection && !key.startsWith('CLI_CEB_')) {
      console.error(`Invalid key: <${key}>. All CLI keys must start with 'CLI_CEB_'.`);
      process.exit(1);
    }
  }
}

function parseArguments(args) {
  const cliValues = [];
  
  for (const arg of args) {
    const key = arg.split('=')[0];
    const value = arg.split('=').slice(1).join('=');

    validateKey(key);

    switch (key) {
      case 'CLI_CEB_DEV':
        break;
      case 'CLI_CEB_FIREFOX':
        break;
      default:
        cliValues.push(arg);
    }
  }

  return cliValues;
}

function validateEnvKeys() {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    const key = line.split('=')[0];

    if (key.startsWith('CLI_CEB_')) {
      validateKey(key, false);
    } else if (key.startsWith('CEB_')) {
      validateKey(key, true);
    }
  }
}

function createNewFile(cliValues) {
  let newContent = '# THOSE VALUES ARE EDITABLE ONLY VIA CLI\n';
  newContent += `CLI_CEB_DEV=${CLI_CEB_DEV}\n`;
  newContent += `CLI_CEB_FIREFOX=${CLI_CEB_FIREFOX}\n`;
  
  for (const value of cliValues) {
    newContent += `${value}\n`;
  }
  
  newContent += '\n# THOSE VALUES ARE EDITABLE\n';

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    
    let skipCliSection = false;
    
    for (const line of lines) {
      if (line === '# THOSE VALUES ARE EDITABLE ONLY VIA CLI') {
        skipCliSection = true;
        continue;
      }
      
      if (line === '# THOSE VALUES ARE EDITABLE') {
        skipCliSection = false;
        continue;
      }
      
      if (skipCliSection) {
        continue;
      }
      
      if (line.startsWith('CLI_CEB_')) {
        continue;
      }
      
      newContent += `${line}\n`;
    }
  }

  fs.writeFileSync(envPath, newContent);
}

const args = process.argv.slice(2);
const cliValues = parseArguments(args);
validateEnvKeys();
createNewFile(cliValues);
