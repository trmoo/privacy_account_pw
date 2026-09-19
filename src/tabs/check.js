/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  ② 비밀번호 안전 검사 — 검사기 · 해커의 눈(가상 인물) · 비밀번호 대결 · 길이 vs 종류 실험실
 *
 *  ⚠ 입력한 비밀번호는 이 파일의 지역 변수에만 잠깐 있고, 기록소·주소창·바깥으로 가지 않는다.
 */
import { h, md, 상자, 글, 접이, 비번칸 } from '../lib/ui.js';
import { 문항목록 } from '../lib/quiz.js';
import { 검사, 공격상황, 등급들, 조각설명, 조각풀이, 무리들, 무작위경우lg } from '../engine/strength.js';
import { 큰수말, 시간말, 제곱말, 횟수말 } from '../engine/format.js';
import { 무작위비밀번호 } from '../engine/makers.js';
import { 인물, 표적선택 } from '../data/persona.js';

export const 하위들 = [
  { id: 'tester', label: '① 비밀번호 검사기' },
  { id: 'persona', label: '② 해커의 눈 (가상 인물)' },
  { id: 'battle', label: '③ 비밀번호 대결' },
  { id: 'math', label: '④ 길이 vs 종류 실험실' },
];

export function 그리기(자리, 하위) {
  if (하위 === 'tester') 검사기그리기(자리);
  else if (하위 === 'persona') 인물그리기(자리);
  else if (하위 === 'battle') 대결그리기(자리);
  else 실험실그리기(자리);
}

// ── 검사 결과 한 벌 ──────────────────────────────────────────
// 다른 탭(만들기)에서도 쓴다.
export function 결과판(결과, { 짧게 = false } = {}) {
  if (!결과.길이) return h('div', { class: 'result empty' }, '비밀번호를 넣으면 여기에 결과가 나옵니다.');
  const 등 = 등급들[결과.등급];
  const 막대 = h('div', { class: 'meter', role: 'img', 'aria-label': `강도 ${등.이름}` },
    ...등급들.map((g) => h('span', { class: `m-seg g${결과.등급}` + (g.점 <= 결과.등급 ? ' fill' : '') })));

  const 조각줄 = h('div', { class: 'pieces' }, 결과.조각들.map((m) => {
    const 설명 = 조각설명[m.종류];
    return h('div', { class: `piece c-${설명.색}`, title: 조각풀이(m) },
      h('div', { class: 'piece-text' }, m.글.replace(/ /g, '␣')),
      h('div', { class: 'piece-kind' }, (m.종류 === '개인정보' ? '🎯 ' : '') + 설명.이름),
      h('div', { class: 'piece-guess' }, 횟수말(m.lg)));
  }));

  const 풀이목록 = h('ul', { class: 'piece-notes' }, 결과.조각들.map((m) => h('li', {},
    h('code', {}, m.글), ' — ', 조각풀이(m))));

  const 시간표 = h('table', { class: 'tbl times' },
    h('thead', {}, h('tr', {}, h('th', {}, '공격 방법'), h('th', {}, '조건'), h('th', {}, '빠르기'), h('th', {}, '뚫리기까지(최대)'))),
    h('tbody', {}, 공격상황.map((s) => {
      const lg초 = 결과.시간[s.id];
      return h('tr', { class: lg초 < Math.log10(86400) ? 'bad' : lg초 < Math.log10(3.15e9) ? 'mid' : 'good' },
        h('td', {}, s.이름), h('td', {}, s.조건), h('td', {}, s.쉬운말), h('td', { class: 'num' }, 시간말(lg초)));
    })));

  const 종류칩 = h('div', { class: 'chips' },
    h('span', { class: 'chip' }, `길이 ${결과.길이}글자`),
    ...무리들.filter((m) => m.id !== '그').map((m) => h('span', { class: 'chip' + (결과.종류[m.id] ? ' on' : ' off') }, `${결과.종류[m.id] ? '✓' : '·'} ${m.이름}`)));

  return h('div', { class: `result g${결과.등급}` },
    h('div', { class: 'grade-row' },
      h('div', { class: 'grade' }, h('span', { class: 'face' }, 등.얼굴), h('b', {}, 등.이름)),
      막대,
      h('div', { class: 'grade-sub' }, `${등.기준} · 기준: 털린 파일을 느린 암호화로 저장한 사이트(1초에 1만 번)`)),
    종류칩,
    결과.한글풀이 && h('div', { class: 'hanyeong' }, '⌨️ 한글 자판으로 치면: ', h('b', {}, `「${결과.한글풀이}」`)),
    h('h4', {}, '🔍 해커가 쪼개 본 모습'),
    조각줄,
    !짧게 && 풀이목록,
    h('p', { class: 'guess-line', html: md(`해커가 맞히려면 **약 ${횟수말(결과.lg)}** (${제곱말(결과.lg)} 정도) 시도해야 한다.`) }),
    !짧게 && 시간표,
    결과.경고.length > 0 && h('ul', { class: 'warns' }, 결과.경고.map((x) => h('li', {}, '⚠️ ', x))),
    결과.제안.length > 0 && h('ul', { class: 'tips' }, 결과.제안.map((x) => h('li', {}, '💡 ', x))),
  );
}

// ── ① 검사기 ─────────────────────────────────────────────────
const 예시들 = [
  { 글: 'qwer1234', 뜻: '자판 배열 + 연속 숫자' },
  { 글: 'P@ssw0rd!', 뜻: '바꿔치기한 password' },
  { 글: 'tkfkdgo', 뜻: '한영 전환' },
  { 글: '20090315', 뜻: '생일 모양' },
  { 글: 'dragon2026!', 뜻: '낱말 + 연도 + !' },
  { 글: 'rhdiddl-qkek-tkrhk', 뜻: '직접 고른 흔한 낱말 셋 (고양이-바다-사과)' },
  { 글: 'enejwl-rPfidzjq-ghal-tnwjdrhk-tmvosj', 뜻: '뽑기로 고른 낱말 다섯 (두더지-계량컵-호미-수정과-스패너)' },
];

function 검사기그리기(자리) {
  const 결과자리 = h('div', {});
  const 새로 = (값) => 결과자리.replaceChildren(결과판(검사(값)));
  const 칸 = 비번칸({ 바뀔때: 새로, 보이기: true, 이름: '검사할 연습용 비밀번호' });
  새로('');

  자리.append(
    h('h2', {}, '내 비밀번호, 얼마나 버틸까?'),
    상자('now', '🛡️ 이 검사기는 인터넷을 쓰지 않는다',
      글('입력한 글자는 **이 화면 안에서만 계산**되고, 저장되지 않으며, 다른 화면으로 가면 사라진다. 인터넷을 끊어도 똑같이 동작한다.'),
      글('그래도 **진짜 쓰는 비밀번호는 넣지 말자.** 「비밀번호 검사」라며 진짜 비밀번호를 넣게 하는 곳이 가짜일 수도 있다는 것 — 이것이 이 수업의 첫 번째 교훈이다. 비슷한 모양의 연습용 비밀번호로 충분하다.')),
    h('div', { class: 'examples' }, h('span', { class: 'small' }, '예시로 넣어 보기:'),
      ...예시들.map((x) => h('button', { class: 'btn small', title: x.뜻, onClick: () => 칸.넣기(x.글) }, x.글.length > 18 ? `${x.글.slice(0, 16)}…` : x.글)),
      h('button', { class: 'btn small primary', onClick: () => 칸.넣기(무작위비밀번호(16).글) }, '🎲 무작위 16글자')),
    칸,
    결과자리,
    접이('🔬 더 깊이 — 추측 횟수는 어떻게 셀까?',
      글('해커는 한 글자씩 맞히지 않는다. 흔한 비밀번호 목록, 영어·한영 사전, 자판 배열, 날짜 같은 **덩어리**를 먼저 넣어 본다. 검사기는 비밀번호를 덩어리로 쪼개는 여러 방법 가운데 **해커에게 가장 쉬운 방법**을 찾는다(동적 계획법).'),
      글('전체 추측 횟수 = (덩어리 수)! × (덩어리마다의 추측 횟수를 모두 곱한 값) + 10000^(덩어리 수 − 1)'),
      글('(덩어리 수)! 은 어떤 덩어리가 어떤 차례로 오는지 모르는 값이다. 무작위 글자 덩어리는 섞인 글자 종류의 수를 길이만큼 곱한다(예: 소문자·숫자 섞인 6글자 → 36⁶).'),
      글('이 검사기는 수업용 어림이다. 실제 해커 도구는 수억 개짜리 사전과 규칙을 쓰므로, 여기서 「강함」이 나와도 **사이트마다 다르게 쓰고 2단계 인증을 켜는 것**은 여전히 필요하다. 생각의 틀은 Dropbox 의 zxcvbn 연구(2016)에서 널리 알려진 방식을 따랐고, 코드와 한국어 사전(한영 전환)은 새로 만들었다.')),
    h('h3', {}, '✏️ 확인 문제'),
    문항목록('c-tester'),
  );
  칸.입력.focus();
}

// ── ② 해커의 눈 (가상 인물) ──────────────────────────────────
const 인물예시 = ['Haram0315!', 'zhddl2009', 'Kongi777!', 'byeolbit7', 'gkfka4827', 'rhdiddl-qkek-tkrhk'];

function 인물그리기(자리) {
  const 결과자리 = h('div', {});
  const 새로 = (값) => 결과자리.replaceChildren(결과판(검사(값, 표적선택)));
  const 칸 = 비번칸({ 바뀔때: 새로, 보이기: true, 이름: '하람이가 만들 법한 비밀번호', 자리표시: '하람이가 만들 법한 비밀번호를 넣어 보세요' });
  새로('');

  자리.append(
    h('h2', {}, '해커의 눈으로 보기 — 표적 공격'),
    글('해커가 **한 사람을 노리면** 그 사람의 SNS부터 살펴본다. 이름·생일·반려동물·학교·전화번호를 모아 그것부터 넣어 본다. 이런 공격을 **표적 공격**이라고 한다.'),
    상자('info', '🧑‍🎓 가상 인물이다', 글('아래 인물은 수업을 위해 지어낸 사람이다. 내 이름·생일은 넣지 말고, 하람이의 입장이 되어 실험해 보자.')),
    h('div', { class: 'sns' },
      h('div', { class: 'sns-head' }, h('span', { class: 'avatar' }, '🙂'), h('div', {}, h('b', {}, `${인물.이름} `), h('span', { class: 'small' }, 인물.아이디), h('div', { class: 'small' }, 인물.소개))),
      ...인물.게시물.map((g) => h('div', { class: 'sns-post' }, h('span', { class: 'post-ico' }, g.표), h('span', {}, g.글)))),
    h('p', {}, '🕵️ 해커처럼 읽어 보자 — 이 게시물에서 비밀번호에 쓰일 만한 정보는 몇 개일까? 이제 하람이가 만들 법한 비밀번호를 넣어 보자. 개인정보 조각은 ', h('b', {}, '🎯 분홍색'), '으로 나온다.'),
    h('div', { class: 'examples' }, h('span', { class: 'small' }, '예시:'), ...인물예시.map((x) => h('button', { class: 'btn small', onClick: () => 칸.넣기(x) }, x))),
    칸,
    결과자리,
    상자('tip', '💡 표적 공격을 막는 법', 글('비밀번호에서 **나와 관련된 정보를 모두 뺀다.** 거꾸로 쓰기·대문자·기호 붙이기로 가리는 것은 해커 도구가 자동으로 되돌려 본다.')),
    h('h3', {}, '✏️ 확인 문제'),
    문항목록('c-persona'),
  );
}

// ── ③ 비밀번호 대결 ──────────────────────────────────────────
function 한줄판정(비번) {
  const r = 검사(비번);
  const 등 = 등급들[r.등급];
  return h('div', { class: `mini g${r.등급}` },
    h('div', {}, h('span', { class: 'face' }, 등.얼굴), ' ', h('b', {}, 등.이름)),
    h('div', { class: 'small' }, `약 ${횟수말(r.lg)} · 느린 암호화로 ${시간말(r.시간.offlineSlow)}`),
    h('div', { class: 'mini-pieces' }, r.조각들.map((m) => h('span', { class: `tag c-${조각설명[m.종류].색}` }, `${m.글} → ${조각설명[m.종류].이름}`))));
}

function 대결그리기(자리) {
  const 왼 = h('div', {});
  const 오른 = h('div', {});
  const 칸A = 비번칸({ 바뀔때: (v) => 왼.replaceChildren(v ? 한줄판정(v) : ''), 보이기: true, 이름: '대결 A', 자리표시: 'A 비밀번호' });
  const 칸B = 비번칸({ 바뀔때: (v) => 오른.replaceChildren(v ? 한줄판정(v) : ''), 보이기: true, 이름: '대결 B', 자리표시: 'B 비밀번호' });

  자리.append(
    h('h2', {}, '비밀번호 대결 — 어느 쪽이 더 강할까?'),
    글('먼저 **예상해서 고르자.** 고르고 나면 검사기가 두 비밀번호를 판정해 보여 준다. 복잡해 보이는 쪽이 늘 이길까?'),
    문항목록('c-battle', {
      그림: (문항, r) => h('div', { class: 'duel' },
        h('div', { class: 'duel-side' }, h('div', { class: 'duel-tag' }, 'A'), h('code', { class: 'duel-pw' }, 문항.A), r && (r.ok || r.shown) && 한줄판정(문항.A)),
        h('div', { class: 'vs' }, 'VS'),
        h('div', { class: 'duel-side' }, h('div', { class: 'duel-tag' }, 'B'), h('code', { class: 'duel-pw' }, 문항.B), r && (r.ok || r.shown) && 한줄판정(문항.B))),
    }),
    h('h3', {}, '🥊 직접 대결시켜 보기'),
    h('div', { class: 'duel free' },
      h('div', { class: 'duel-side' }, 칸A, 왼),
      h('div', { class: 'vs' }, 'VS'),
      h('div', { class: 'duel-side' }, 칸B, 오른)),
  );
}

// ── ④ 길이 vs 종류 실험실 ────────────────────────────────────
const 실험 = { 길이: 10, 무리: new Set(['소']) };
const 실험무리 = 무리들.filter((m) => ['소', '대', '숫', '기'].includes(m.id));

function 실험실그리기(자리) {
  const 판 = h('div', {});
  const 길이글 = h('b', {}, `${실험.길이}글자`);
  const 새로 = () => { 길이글.textContent = `${실험.길이}글자`; 판.replaceChildren(실험판()); };
  const 슬라이더 = h('input', {
    type: 'range', min: '4', max: '24', value: String(실험.길이), class: 'slider', 'aria-label': '길이',
    onInput: (e) => { 실험.길이 = Number(e.target.value); 새로(); },
  });
  const 고르기 = h('div', { class: 'chips' }, 실험무리.map((m) => h('label', { class: 'chip-check' },
    h('input', { type: 'checkbox', checked: 실험.무리.has(m.id), onChange: (e) => { if (e.target.checked) 실험.무리.add(m.id); else 실험.무리.delete(m.id); 새로(); } }),
    ` ${m.이름} (${m.크기})`)));
  새로();

  자리.append(
    h('h2', {}, '길이 vs 종류 — 무엇이 더 힘이 셀까?'),
    글('컴퓨터가 **무작위로** 뽑은 비밀번호라면 경우의 수는 **(글자 종류 수)^(길이)** 다. 종류를 늘리면 밑이, 길이를 늘리면 지수가 커진다. 슬라이더를 움직여 보자.'),
    h('div', { class: 'lab-controls' }, h('label', { class: 'field' }, '길이 ', 슬라이더, 길이글), 고르기),
    판,
    h('h3', {}, '📊 한눈에 보기 — 그래픽카드 한 장이 빠른 암호화 파일을 풀 때(1초에 1,000억 번)'),
    시간격자(),
    상자('warn', '⚠️ 이 계산은 「무작위」일 때만 맞다',
      글('사람이 만든 비밀번호는 낱말·날짜·자판 배열 같은 패턴이 있어서 이 표보다 **훨씬 빨리** 뚫린다. 그래서 ① 검사기가 이 표와 다른 값을 내고, ② 길이를 늘릴 때도 **예측할 수 없게** 늘려야 한다 (`Password1` → `Password1111111` 은 거의 그대로다).')),
    h('h3', {}, '✏️ 확인 문제'),
    문항목록('c-math'),
  );
}

function 실험판() {
  const N = 실험무리.filter((m) => 실험.무리.has(m.id)).reduce((s, m) => s + m.크기, 0);
  if (!N) return h('p', { class: 'small' }, '글자 종류를 하나 이상 골라 주세요.');
  const 지금 = 무작위경우lg(실험.길이, N);
  const 남은 = 실험무리.filter((m) => !실험.무리.has(m.id));
  const 큰종류 = 남은.sort((a, b) => b.크기 - a.크기)[0];
  const 후보 = [
    { 이름: `지금 (${N}가지 × ${실험.길이}글자)`, lg: 지금, 식: `${N}^${실험.길이}` },
    큰종류 && { 이름: `종류 하나 더: +${큰종류.이름}`, lg: 무작위경우lg(실험.길이, N + 큰종류.크기), 식: `${N + 큰종류.크기}^${실험.길이}` },
    { 이름: '한 글자 더', lg: 무작위경우lg(실험.길이 + 1, N), 식: `${N}^${실험.길이 + 1}` },
    { 이름: '네 글자 더', lg: 무작위경우lg(실험.길이 + 4, N), 식: `${N}^${실험.길이 + 4}` },
  ].filter(Boolean);
  const 최대 = Math.max(...후보.map((x) => x.lg));
  return h('div', { class: 'lab' },
    h('p', { class: 'big-num', html: md(`경우의 수 = ${N}^${실험.길이} ≈ **${큰수말(지금)}** 가지 (${제곱말(지금)})`) }),
    h('p', { class: 'small' }, `1초에 1만 번(느린 암호화) → ${시간말(지금 - 4)} · 1초에 1,000억 번(빠른 암호화) → ${시간말(지금 - 11)}`),
    h('div', { class: 'bars' }, 후보.map((x) => h('div', { class: 'bar-row' },
      h('span', { class: 'bar-name' }, x.이름),
      h('div', { class: 'bar-track' }, h('div', { class: 'bar-val', style: { width: `${Math.max(3, (x.lg / 최대) * 100)}%` } }, `${x.식} ≈ ${큰수말(x.lg)}`))))),
    h('p', { class: 'small' }, '막대 길이는 「0이 몇 개인가(자릿수)」에 비례한다. 막대가 조금만 길어져도 실제 수는 몇 배, 몇만 배가 된다.'),
  );
}

function 시간격자() {
  const 길이들 = [6, 8, 10, 12, 14, 16, 20];
  const 종류들 = [
    { 이름: '숫자만', 크기: 10 },
    { 이름: '소문자만', 크기: 26 },
    { 이름: '대·소문자', 크기: 52 },
    { 이름: '대·소문자+숫자', 크기: 62 },
    { 이름: '네 종류 모두', 크기: 95 },
  ];
  return h('div', { class: 'grid-wrap' }, h('table', { class: 'tbl grid' },
    h('thead', {}, h('tr', {}, h('th', {}, '길이'), ...종류들.map((k) => h('th', {}, `${k.이름} (${k.크기})`)))),
    h('tbody', {}, 길이들.map((L) => h('tr', {}, h('th', {}, `${L}글자`), ...종류들.map((k) => {
      const lg초 = 무작위경우lg(L, k.크기) - 11;
      const 칸 = lg초 < Math.log10(3600) ? 'bad' : lg초 < Math.log10(3.15e7) ? 'mid' : lg초 < Math.log10(3.15e9) ? 'ok' : 'good';
      const 글자 = 시간말(lg초);
      return h('td', { class: `cell ${칸}` }, 글자.startsWith('우주') ? '🌌 우주 나이보다 김' : 글자);
    }))))));
}
