import puppeteer from 'puppeteer';

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('Taking screenshot of top section...');
    await page.screenshot({ path: 'screenshot-top.png', fullPage: false });
    
    console.log('Taking full page screenshot...');
    await page.screenshot({ path: 'screenshot-full.png', fullPage: true });
    
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height: ${pageHeight}px`);
    
    if (pageHeight > 1080) {
      console.log('Scrolling to middle section...');
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.screenshot({ path: 'screenshot-middle.png', fullPage: false });
      
      console.log('Scrolling to bottom section...');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.screenshot({ path: 'screenshot-bottom.png', fullPage: false });
    }
    
    console.log('Screenshots saved successfully!');
    console.log('- screenshot-top.png (top viewport)');
    console.log('- screenshot-full.png (full page)');
    if (pageHeight > 1080) {
      console.log('- screenshot-middle.png (middle section)');
      console.log('- screenshot-bottom.png (bottom section)');
    }
  } catch (error) {
    console.error('Error taking screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
