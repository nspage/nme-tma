import { compileFunc } from '@ton-community/func-js';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  // Compile the contract
  const result = await compileFunc({
    sources: {
      'event_storage.fc': await readFile(join(__dirname, '../src/contracts/event_storage.fc'), 'utf8'),
    },
    entryPoints: ['event_storage.fc'],
  });

  if (result.status === 'error') {
    console.error('Error compiling contract:', result.message);
    process.exit(1);
  }

  // Save the compiled contract
  const codeBoc = result.codeBoc;
  await writeFile(
    join(__dirname, '../src/contracts/event_storage.cell'),
    Buffer.from(codeBoc, 'base64')
  );

  console.log('Contract compiled successfully!');
}

main().catch(console.error);
