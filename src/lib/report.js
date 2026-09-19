/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  활동지 HTML 만들기 — 내려받아 제출하는 한 장짜리 파일.
 *
 *  ⚠ DOM 을 만들지 말 것(node 로 시험한다). 글자를 이어 붙여 HTML 문자열만 만든다.
 *  ⚠ 학생이 쓴 글(다짐·학번·이름)은 반드시 이스케이프 — <script> 가 들어와도 글자로만 보이게.
 *  ⚠ 비밀번호는 기록소에 없으므로 활동지에도 들어가지 않는다.
 */
import { 탭들, 활동들, 활동점수, 활동끝났나, 진행률, 전체점수 } from '../data/activities.js';
import { 점검표 } from '../data/content.js';

export function 이스케이프(글) {
  return String(글 ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function 파일이름(학번, 이름) {
  const 깨끗 = (s) => String(s ?? '').trim().replace(/[\\/:*?"<>|\s]+/g, '').slice(0, 20);
  const 붙 = [깨끗(학번), 깨끗(이름)].filter(Boolean).join('_');
  return `계정지킴이_${붙 || '활동지'}.html`;
}

export function 활동지만들기(기록, { 학번 = '', 이름 = '', 날짜 = new Date() } = {}) {
  const 진 = 진행률(기록);
  const 점 = 전체점수(기록);
  const 날 = `${날짜.getFullYear()}. ${날짜.getMonth() + 1}. ${날짜.getDate()}.`;
  const 체크 = 기록.data.checklist || {};
  const 다짐 = String(기록.data.pledge || '').trim();

  const 탭칸 = 탭들.map((탭) => {
    const 줄들 = 활동들.filter((a) => a.탭 === 탭.id).map((a) => {
      const s = 활동점수(기록, a);
      const 끝 = 활동끝났나(기록, a);
      const 체험 = a.체험 ? (기록.data[a.체험.열쇠] ? '체험 ✔' : '체험 전') : '';
      const 문항 = s.전체 ? `${s.맞음} / ${s.전체}${s.정답봄 ? ` (정답을 보고 넘어감 ${s.정답봄})` : ''}` : '';
      const 문항칸 = [문항, 체험].filter(Boolean).join(' · ') || '-';
      return `<tr><td>${이스케이프(a.제목)}</td><td class="c">${문항칸}</td><td class="c">${끝 ? '✅ 끝냄' : '…'}</td></tr>`;
    }).join('');
    return `<h2>${이스케이프(탭.이름)}</h2><table><thead><tr><th>활동</th><th>맞힌 문항</th><th>상태</th></tr></thead><tbody>${줄들}</tbody></table>`;
  }).join('');

  const 체크칸 = 점검표.map((c) => `<li>${체크[c.id] ? '☑' : '☐'} ${이스케이프(c.글)}</li>`).join('');

  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>내 계정 지킴이 활동지 — ${이스케이프(학번)} ${이스케이프(이름)}</title>
<style>
body{font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;max-width:820px;margin:24px auto;padding:0 16px;color:#1f2937;line-height:1.6}
h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:22px 0 8px;border-left:6px solid #2563eb;padding-left:8px}
.meta{display:flex;gap:18px;flex-wrap:wrap;font-size:16px;margin:10px 0 16px}.meta b{display:inline-block;min-width:90px;border-bottom:1px solid #9ca3af}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{border:1px solid #d1d5db;padding:6px 8px}th{background:#eff6ff}td.c{text-align:center}
.sum{background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:10px 14px;font-size:16px}
ul{padding-left:0;list-style:none}li{margin:4px 0}.pledge{border:1px solid #d1d5db;border-radius:10px;padding:12px;min-height:60px;white-space:pre-wrap}
.foot{margin-top:28px;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:8px}
@media print{body{margin:0}.sum{break-inside:avoid}}
</style></head><body>
<h1>🔐 내 계정 지킴이 — 활동지</h1>
<div>정보 Ⅴ. 디지털 문화 · 가입한 사이트 찾기 · 비밀번호 안전 검사 · 안전한 비밀번호 만들기</div>
<div class="meta"><span>학번 <b>${이스케이프(학번)}</b></span><span>이름 <b>${이스케이프(이름)}</b></span><span>날짜 <b>${날}</b></span></div>
<div class="sum">끝낸 활동 <b>${진.끝} / ${진.전체}</b> · 맞힌 문항 <b>${점.맞음} / ${점.전체}</b></div>
${탭칸}
<h2>☑ 나의 계정 점검표</h2><ul>${체크칸}</ul>
<h2>✍ 나의 실천 다짐</h2><div class="pledge">${이스케이프(다짐) || '(적지 않음)'}</div>
<div class="foot">이 활동지에는 비밀번호가 들어 있지 않습니다. 앱은 입력한 비밀번호를 저장하지 않습니다.<br>
내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유 · 학교 수업 목적으로만 이용해 주세요.</div>
</body></html>`;
}
