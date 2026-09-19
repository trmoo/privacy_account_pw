/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  빌드 결과 점검 — `npm run build` 뒤에 돌린다. 배포 워크플로도 이것을 돌린다.
 *
 *  ① 크기(자원이 다 들어갔나) ② 저작권 표시(HTML 주석 · /*! 배너 · 화면 푸터)
 *  ③ 보안 정책(CSP) 이 통신을 막고 있나 ④ 바깥 주소가 모두 content.js 에 적힌 링크인가
 *  ⑤ 바깥 자원(스크립트·스타일·그림)을 부르지 않나 — 인터넷 없는 교실에서도 열려야 한다
 */
import { readFileSync, statSync } from 'node:fs';
import { 참고한글, 사실출처, 공식주소 } from '../src/data/content.js';

const 파일 = 'dist/index.html';
const 글 = readFileSync(파일, 'utf-8');
const 잘못 = [];

const 크기 = statSync(파일).size;
if (크기 < 100000) 잘못.push(`빌드 결과가 너무 작다 (${크기} 바이트) — 자원이 안 들어갔을 수 있다`);

const 티쳐무 = (글.match(/티쳐무/g) || []).length;
if (티쳐무 < 3) 잘못.push(`저작권 표시가 ${티쳐무}곳뿐이다 — esbuild.legalComments 가 'inline' 인지 볼 것`);
if (!글.includes('/*!')) 잘못.push('/*! 배너가 지워졌다');
if (!글.includes('학교 수업 목적으로만 이용해 주세요')) 잘못.push('화면 푸터가 없다');

const csp = 글.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
if (!csp) 잘못.push('콘텐츠 보안 정책(CSP) meta 가 없다');
else if (!csp[1].includes("connect-src 'none'")) 잘못.push("CSP 에 connect-src 'none' 이 없다");

// 바깥 주소 — 링크로만 쓰고, 모두 content.js 에 적어 둔 것이어야 한다
const 허용 = new Set([...참고한글.map((x) => x.주소), ...사실출처.map((x) => x.주소), ...Object.values(공식주소), 'http://www.w3.org/2000/svg']);
const 주소들 = [...new Set(글.match(/https?:\/\/[^\s"'`<>)\\]+/g) || [])];
const 모르는 = 주소들.filter((u) => !허용.has(u));
if (모르는.length) 잘못.push(`content.js 에 없는 바깥 주소가 있다:\n      ${모르는.join('\n      ')}`);

// 바깥 자원을 부르는가
const 자원 = 글.match(/<(?:script|link|img|iframe)[^>]*(?:src|href)=["']https?:/i);
if (자원) 잘못.push(`바깥 자원을 부른다: ${자원[0]}`);

if (잘못.length) {
  console.log(`\n  ❌ 빌드 결과 점검 ${잘못.length}가지 문제\n`);
  for (const m of 잘못) console.log('    ' + m);
  console.log('');
  process.exit(1);
}
console.log(`\n  ✅ 빌드 결과 점검 통과 — ${크기.toLocaleString('ko-KR')}바이트 · 저작권 ${티쳐무}곳 · CSP 통신 차단 · 바깥 주소 ${주소들.length}개 모두 링크 목록에 있음\n`);
