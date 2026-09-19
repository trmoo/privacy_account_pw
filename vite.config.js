/*! 내 계정 지킴이 (privacy_account_pw)
 *  © 2026 티쳐무 · 모든 권리 보유
 *  학교 수업 목적으로만 이용해 주세요. 자세한 내용은 LICENSE 파일을 보세요.
 */
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 빌드 결과 맨 앞에 남길 저작권 배너.
// `/*!` 로 시작해야 압축 과정에서 지워지지 않는다.
const 배너 = `/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 * 학교 수업 목적으로만 이용해 주세요. 무단 배포·상업적 이용을 금합니다. */`;

// ── 콘텐츠 보안 정책(CSP) ──────────────────────────────────────
// 이 앱은 학생이 비밀번호를 입력해 보는 곳이다. 「어디에도 보내지 않는다」를 말로만 하지 않고
// 브라우저가 스스로 통신을 막게 한다. connect-src 'none' 이면 fetch·XHR·WebSocket 이 모두 막힌다.
// ⚠ 개발 서버(npm start)는 모듈 파일·HMR 연결이 필요해서 빌드할 때만 넣는다.
const 보안정책 = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  'font-src data:',
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "object-src 'none'",
].join('; ');

function 보안정책넣기() {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${보안정책}" />`,
      );
    },
  };
}

export default defineConfig({
  // GitHub Pages 하위 경로에서도 자원이 열리도록 상대 경로를 쓴다.
  base: './',
  // 빌드 결과를 dist/index.html 한 파일로 묶어 더블클릭만으로 열리게 한다.
  plugins: [보안정책넣기(), viteSingleFile()],
  // legalComments 를 'none' 으로 두면 `/*!` 배너까지 지워진다. 반드시 'inline'.
  esbuild: { legalComments: 'inline' },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: { output: { banner: 배너 } },
  },
});
