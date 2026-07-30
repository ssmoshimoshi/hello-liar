import { translateBilingual } from './src/lib/translator.ts';

async function test() {
  const result = await translateBilingual("Saya sedang menguji sistem ini.");
  console.log("Translation Result:", result);
}
test();
