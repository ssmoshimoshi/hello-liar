import puppeteer from 'puppeteer';
import path from 'path';

const outDir = '/Users/muhammadfanani/.gemini/antigravity-ide/brain/0f7a364c-1a0a-441a-a7b1-9d850da50ac7';

const pages = [
  { name: '01_Read_SwipeFeed', url: 'http://localhost:3000/id' },
  { name: '02_Write_Confession', url: 'http://localhost:3000/id/write' },
  { name: '03_Vault_Gallery', url: 'http://localhost:3000/id/vault' },
  { name: '04_Illustrated_Tarot', url: 'http://localhost:3000/id/illustrated' }
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone 13 size)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  for (const p of pages) {
    console.log(`Navigating to ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'load' });
    
    if (p.url.endsWith('/id')) {
        // Wait for data to load and initial render (showing the coral cover)
        await new Promise(r => setTimeout(r, 1500));
        const coverPath = path.join(outDir, `01_Read_SwipeFeed_Cover.png`);
        await page.screenshot({ path: coverPath });
        console.log(`Saved ${coverPath}`);
        
        // Wait for the flip animation to completely finish (800ms delay + 800ms flip + extra padding)
        await new Promise(r => setTimeout(r, 4000));
        const storyPath = path.join(outDir, `01_Read_SwipeFeed_Story.png`);
        await page.screenshot({ path: storyPath });
        console.log(`Saved ${storyPath}`);
    } else {
        await new Promise(r => setTimeout(r, 2000));
        const savePath = path.join(outDir, `${p.name}.png`);
        await page.screenshot({ path: savePath });
        console.log(`Saved ${savePath}`);
    }
  }

  await browser.close();
})();
