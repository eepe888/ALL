// 調査用: note.comの新規記事エディタのDOM構造を確認するための一時スクリプト。
const { chromium } = require('playwright');
const path = require('node:path');

async function main() {
  const storageStatePath = path.join(__dirname, 'storageState.json');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: storageStatePath });
  const page = await context.newPage();

  await page.goto('https://note.com/notes/new');
  await page.waitForTimeout(4000);

  console.log('URL:', page.url());

  const placeholders = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[placeholder]')).map((el) => ({
      tag: el.tagName,
      placeholder: el.getAttribute('placeholder'),
      class: el.className,
      contenteditable: el.getAttribute('contenteditable'),
    }))
  );
  console.log('\n--- placeholder要素 ---');
  console.log(JSON.stringify(placeholders, null, 2));

  const editables = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[contenteditable="true"]')).map((el) => ({
      tag: el.tagName,
      class: el.className,
      dataPlaceholder: el.getAttribute('data-placeholder'),
      ariaLabel: el.getAttribute('aria-label'),
      text: el.textContent.slice(0, 30),
    }))
  );
  console.log('\n--- contenteditable要素 ---');
  console.log(JSON.stringify(editables, null, 2));

  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('\nスクリーンショットを debug-screenshot.png に保存しました。');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
