// 初回のみ実行: 手動でNoteにログインし、セッションを storageState.json に保存する。
// パスワードはこのスクリプトには一切渡さない。ログイン完了はCookieの出現で自動検知する。
const { chromium } = require('playwright');

const LOGIN_WAIT_TIMEOUT_MS = 10 * 60 * 1000; // 10分以内にログインしてください
const POLL_INTERVAL_MS = 2000;

async function waitForLoginCookie(context) {
  const start = Date.now();
  while (Date.now() - start < LOGIN_WAIT_TIMEOUT_MS) {
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => /session/i.test(c.name) && c.domain.includes('note.com'));
    if (sessionCookie) return true;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://note.com/login');

  console.log('\nブラウザでNoteに手動でログインしてください。');
  console.log('ログインを検知したら自動でセッションを保存します(最大10分待機します)。\n');

  const loggedIn = await waitForLoginCookie(context);
  if (!loggedIn) {
    console.error('ログインを検知できませんでした(タイムアウト)。もう一度お試しください。');
    await browser.close();
    process.exit(1);
  }

  // localStorage等のクライアント側認証情報も確定させるため、トップページへ遷移してから保存する。
  await page.goto('https://note.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await context.storageState({ path: 'storageState.json' });
  console.log('ログインセッションを storageState.json に保存しました。');
  console.log('このファイルはログインCookieを含むため、絶対にコミット・共有しないでください(.gitignore済み)。');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
