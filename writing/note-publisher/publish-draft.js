// 使い方: npm run publish -- ../articles/<案件名>/<記事>.md
//
// note.comは自動操作ブラウザ(Playwright等)によるログインをボット検知で弾くため、
// ここでは「本文をクリップボードにコピーし、note.comの新規記事ページを普段使いの
// ブラウザで開く」ところまでを自動化し、実際の貼り付け・保存はユーザーの手で行う。
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const os = require('node:os');

function parseArticle(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  const frontmatter = {};
  let body = raw;

  if (fmMatch) {
    body = raw.slice(fmMatch[0].length);
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) {
        frontmatter[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
      }
    }
  }

  const bodyLines = body.split(/\r?\n/);
  while (bodyLines.length && bodyLines[0].trim() === '') bodyLines.shift();
  // note.comはH1をペーストするとH2に変換するため、タイトルと重複する先頭のH1は取り除く
  if (bodyLines[0] && bodyLines[0].trim().startsWith('# ')) bodyLines.shift();

  return {
    title: frontmatter.title,
    body: bodyLines.join('\n').trim(),
    frontmatter,
  };
}

function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    const tmpFile = path.join(os.tmpdir(), `note-publisher-body-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, text, 'utf-8');
    const psCommand = `Set-Clipboard -Value ([System.IO.File]::ReadAllText('${tmpFile}', [System.Text.Encoding]::UTF8))`;
    execFile('powershell.exe', ['-NoProfile', '-Command', psCommand], (err) => {
      fs.unlinkSync(tmpFile);
      if (err) reject(err);
      else resolve();
    });
  });
}

function openInBrowser(url) {
  return new Promise((resolve, reject) => {
    execFile('cmd.exe', ['/c', 'start', '""', url], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function main() {
  const articleArg = process.argv[2];
  if (!articleArg) {
    console.error('使い方: npm run publish -- <記事のmarkdownファイルパス>');
    process.exit(1);
  }

  const articlePath = path.resolve(process.cwd(), articleArg);
  if (!fs.existsSync(articlePath)) {
    console.error(`ファイルが見つかりません: ${articlePath}`);
    process.exit(1);
  }

  const { title, body } = parseArticle(articlePath);
  if (!title) {
    console.error('frontmatterに title が見つかりません。記事のfrontmatterを確認してください。');
    process.exit(1);
  }
  if (!body) {
    console.error('本文が空です。');
    process.exit(1);
  }

  await copyToClipboard(body);
  await openInBrowser('https://note.com/notes/new');

  console.log('note.comの新規記事ページを開きました。');
  console.log('本文はクリップボードにコピー済みです(Ctrl+Vで貼り付けてください)。\n');
  console.log('■ タイトル欄に入力する文字列 -----------------------------');
  console.log(title);
  console.log('-------------------------------------------------------\n');
  console.log('本文欄をクリックしてCtrl+Vで貼り付けると、noteがMarkdownを見出し等に自動変換します。');
  console.log('公開は必ず内容を確認したうえで手動で行ってください。');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
