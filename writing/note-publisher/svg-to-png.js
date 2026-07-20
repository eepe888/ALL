// 一時スクリプト: ローカルのSVGファイルをPNGに変換する(note.com等へはアクセスしない)。
const { chromium } = require('playwright');
const path = require('node:path');

async function main() {
  const svgPath = process.argv[2];
  const pngPath = process.argv[3];
  if (!svgPath || !pngPath) {
    console.error('使い方: node svg-to-png.js <入力svgパス> <出力pngパス>');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file:///' + path.resolve(svgPath).replace(/\\/g, '/'));
  await page.screenshot({ path: pngPath, omitBackground: false });
  await browser.close();
  console.log('PNGを出力しました:', pngPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
