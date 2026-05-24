import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const clientDir = resolve(rootDir, 'client');
const distDir = resolve(clientDir, 'dist');
const infinityfreeDir = resolve(rootDir, 'infinityfree', 'htdocs');

function run(command, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const vitePackage = require.resolve('vite/package.json', { paths: [clientDir] });
  const viteBin = resolve(dirname(vitePackage), 'bin', 'vite.js');

  await run(process.execPath, [viteBin, 'build'], clientDir);

  await rm(infinityfreeDir, { recursive: true, force: true });
  await mkdir(infinityfreeDir, { recursive: true });
  await cp(distDir, infinityfreeDir, { recursive: true });

  const readmeSource = resolve(rootDir, 'infinityfree', 'README.md');
  const readmeTarget = resolve(infinityfreeDir, 'README.txt');
  await writeFile(
    readmeTarget,
    [
      'InfinityFree deployment bundle',
      '',
      'Upload the contents of this folder into the htdocs directory of your InfinityFree account.',
      'Remember: InfinityFree free hosting does not run Node.js / Express.',
      'Set VITE_API_URL before building if your frontend talks to an external backend.',
    ].join('\n'),
    'utf8',
  );

  console.log(`InfinityFree build staged in ${infinityfreeDir}`);
  console.log(`Source notes: ${readmeSource}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
