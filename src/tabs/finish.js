/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  ④ 마무리 — 종합 확인 문제 · 나의 계정 점검표와 다짐(활동지 내려받기) · 출처와 선생님께
 *
 *  ⚠ 학번·이름은 이 파일의 지역 변수에만 둔다. 기록소(브라우저 저장소)에 넣지 않는다.
 */
import { h, md, 상자, 글, 링크, 알림, 내려받기, 토스트 } from '../lib/ui.js';
import { 문항목록 } from '../lib/quiz.js';
import { 자료, 자료적기, 모두지우기, 지금기록 } from '../lib/store.js';
import { 탭들, 활동들, 활동점수, 활동끝났나, 탭진행 } from '../data/activities.js';
import { 점검표, 참고한글, 사실출처, 바로잡은곳, 덧붙인곳, 공식주소 } from '../data/content.js';
import { 활동지만들기, 파일이름 } from '../lib/report.js';

export const 하위들 = [
  { id: 'quiz', label: '① 종합 확인 문제' },
  { id: 'pledge', label: '② 점검표와 다짐 · 활동지' },
  { id: 'about', label: '③ 출처와 선생님께' },
];

export function 그리기(자리, 하위, 이동) {
  if (하위 === 'quiz') 종합그리기(자리, 이동);
  else if (하위 === 'pledge') 다짐그리기(자리, 이동);
  else 출처그리기(자리);
}

// ── ① 종합 확인 문제 ─────────────────────────────────────────
function 종합그리기(자리, 이동) {
  const 기록 = 지금기록();
  자리.append(
    h('h2', {}, '종합 확인 문제'),
    글('세 탭에서 배운 것을 모아 확인하자. 헷갈리면 **💡 힌트**를 누르고, 해설까지 꼭 읽자.'),
    h('div', { class: 'tab-progress' }, 탭들.filter((t) => t.id !== 'finish').map((t) => {
      const 진 = 탭진행(기록, t.id);
      return h('button', { class: 'card small-card', onClick: () => 이동(t.id) },
        h('b', {}, t.이름), h('div', { class: 'small' }, `끝낸 활동 ${진.끝} / ${진.전체}`));
    })),
    문항목록('f-quiz'),
  );
}

// ── ② 점검표와 다짐 · 활동지 ─────────────────────────────────
let 학번 = '';
let 이름 = '';

function 다짐그리기(자리, 이동) {
  const 체크 = { ...자료('checklist', {}) };
  const 셈 = h('span', { class: 'chip' });
  const 셈새로 = () => { 셈.textContent = `${점검표.filter((c) => 체크[c.id]).length} / ${점검표.length} 실천 중`; };
  셈새로();

  const 다짐칸 = h('textarea', {
    class: 'text-area', rows: '4', maxlength: '300', placeholder: '예: 이번 주 안에 메일 계정에 2단계 인증을 켜고, 안 쓰는 게임 사이트 세 곳을 정리하겠다.',
    'aria-label': '나의 실천 다짐', onInput: () => {
      자료적기('pledge', 다짐칸.value);
      const 됨 = 다짐칸.value.trim().length >= 10;
      if (됨 !== !!자료('pledge-done', false)) 자료적기('pledge-done', 됨);
      상태.textContent = 됨 ? '✅ 다짐을 적었다' : '10글자 이상 적으면 활동이 끝난다';
    },
  });
  다짐칸.value = 자료('pledge', '');
  const 상태 = h('span', { class: 'small' }, 자료('pledge-done', false) ? '✅ 다짐을 적었다' : '10글자 이상 적으면 활동이 끝난다');

  const 학번칸 = h('input', { type: 'text', class: 'text-input', value: 학번, maxlength: '10', placeholder: '예: 20315', 'aria-label': '학번', autocomplete: 'off', onInput: (e) => { 학번 = e.target.value; } });
  const 이름칸 = h('input', { type: 'text', class: 'text-input', value: 이름, maxlength: '20', placeholder: '이름', 'aria-label': '이름', autocomplete: 'off', onInput: (e) => { 이름 = e.target.value; } });

  const 기록 = 지금기록();
  const 활동표 = h('table', { class: 'tbl' },
    h('thead', {}, h('tr', {}, h('th', {}, '활동'), h('th', {}, '맞힌 문항'), h('th', {}, '상태'))),
    h('tbody', {}, 활동들.map((a) => {
      const s = 활동점수(기록, a);
      const 끝 = 활동끝났나(기록, a);
      return h('tr', {},
        h('td', {}, h('button', { class: 'linkish', onClick: () => 이동(a.탭, a.화면) }, a.제목)),
        h('td', { class: 'num' }, s.전체 ? `${s.맞음} / ${s.전체}` : '-'),
        h('td', {}, 끝 ? '✅ 끝냄' : a.체험 && !기록.data[a.체험.열쇠] ? `⏳ ${a.체험.설명}` : '⏳'));
    })));

  자리.append(
    h('h2', {}, '나의 계정 점검표와 실천 다짐'),
    글('오늘 배운 것 가운데 **이미 하고 있는 것**에 표시하자. 표시하지 못한 것이 이번 주에 할 일이다. (점검표는 이 브라우저에만 남는다)'),
    h('div', { class: 'row' }, 셈),
    h('ul', { class: 'checklist' }, 점검표.map((c) => h('li', {}, h('label', { class: 'check' },
      h('input', { type: 'checkbox', checked: !!체크[c.id], onChange: (e) => { 체크[c.id] = e.target.checked; 자료적기('checklist', { ...체크 }); 셈새로(); } }),
      ` ${c.글}`)))),
    h('h3', {}, '✍️ 나의 실천 다짐'),
    상자('info', '적을 때 주의', 글('다짐에 **이름·비밀번호·사이트 아이디를 쓰지 않는다.** 「무엇을 언제까지 하겠다」로 적으면 좋다.')),
    다짐칸, 상태,
    h('h3', {}, '📄 활동지 내려받기'),
    글('학번·이름은 **내려받는 파일에만** 들어가고, 이 앱에는 저장되지 않는다. 파일을 선생님께 제출하자.'),
    h('div', { class: 'form-row' }, h('label', { class: 'field' }, '학번 ', 학번칸), h('label', { class: 'field' }, '이름 ', 이름칸),
      h('button', {
        class: 'btn primary', onClick: () => {
          내려받기(파일이름(학번, 이름), 활동지만들기(지금기록(), { 학번, 이름 }));
          토스트('📄 활동지를 내려받았습니다');
        },
      }, '📄 활동지 내려받기 (.html)')),
    h('h3', {}, '📋 활동별 진행'),
    활동표,
    h('h3', {}, '🧹 공용 컴퓨터라면'),
    h('div', { class: 'row' }, h('button', {
      class: 'btn danger', onClick: async () => {
        if (await 알림('내 기록 지우기', '이 브라우저에 남은 문항 기록·점검표·다짐을 모두 지웁니다. 되돌릴 수 없습니다.', { 확인: '모두 지우기', 취소: '그만두기' })) {
          모두지우기(); 학번 = ''; 이름 = ''; 자리.replaceChildren(); 다짐그리기(자리, 이동); 토스트('🧹 기록을 지웠습니다');
        }
      },
    }, '🧹 내 기록 지우기')),
  );
}

// ── ③ 출처와 선생님께 ────────────────────────────────────────
function 출처그리기(자리) {
  자리.append(
    h('h2', {}, '출처와 선생님께'),
    h('h3', {}, '📚 참고한 글'),
    글('이 앱은 아래 두 블로그 글의 주제와 흐름을 참고해 만들었다. **문장·예시·문항은 모두 새로 썼고**, 사실은 공식 자료로 다시 확인했다.'),
    h('ul', { class: 'refs' }, 참고한글.map((x) => h('li', {}, 링크(x.주소, x.이름), ` — ${x.곳}`, h('div', { class: 'small' }, `쓴 곳: ${x.쓴곳}`)))),
    h('h3', {}, '🔎 사실을 확인한 자료'),
    h('ul', { class: 'refs' }, 사실출처.map((x) => h('li', {}, 링크(x.주소, x.이름), ` — ${x.기관}`))),
    h('h3', {}, '📝 참고한 글과 다르게 적은 곳'),
    글('몰래 고치지 않고 밝혀 둔다.'),
    h('div', { class: 'grid-wrap' }, h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, h('th', {}, '글'), h('th', {}, '참고한 글의 내용'), h('th', {}, '이 앱의 내용'))),
      h('tbody', {}, 바로잡은곳.map((x) => h('tr', {}, h('td', {}, `블로그 ${x.블로그}`), h('td', {}, x.원래), h('td', {}, x.앱)))))),
    h('h4', {}, '덧붙인 곳'),
    h('ul', {}, 덧붙인곳.map((x) => h('li', {}, `블로그 ${x.블로그} — ${x.글}`))),
    h('h3', {}, '🛡️ 이 앱의 개인정보 약속'),
    h('ul', {},
      h('li', { html: md('입력한 비밀번호는 **이 브라우저 안에서만 계산**하고 저장하지 않는다. 화면을 옮기면 사라진다.') }),
      h('li', { html: md('배포한 앱에는 **콘텐츠 보안 정책(CSP)** 을 넣어, 브라우저가 이 페이지의 모든 통신(`connect-src \'none\'`)을 스스로 막는다. 개발자 도구의 「네트워크」 탭에서 입력할 때 요청이 하나도 없는 것을 직접 확인할 수 있다.') }),
      h('li', {}, '문항 기록·점검표·다짐만 이 브라우저의 저장소에 남는다. 「마무리 → 내 기록 지우기」로 지울 수 있다.'),
      h('li', {}, '학번·이름은 내려받는 활동지 파일에만 들어간다.'),
      h('li', {}, '연습 화면의 사이트·인물(도하람)은 모두 지어낸 것이다. 끝이 .example 인 주소는 예시용으로만 쓰는 주소다.')),
    h('h3', {}, '🧑‍🏫 선생님께 — 수업 흐름 예시 (2차시)'),
    h('div', { class: 'grid-wrap' }, h('table', { class: 'tbl' },
      h('thead', {}, h('tr', {}, h('th', {}, '차시'), h('th', {}, '흐름'), h('th', {}, '주소'))),
      h('tbody', {},
        h('tr', {}, h('td', {}, '1차시'), h('td', {}, '잊힌 계정 도미노 실험 → 포털 조회 따라 하기 → 정리 결정 게임 → 포털 밖 계정 찾기 → 검사기로 내 습관 돌아보기'), h('td', { class: 'mono' }, '#accounts/why · #check/tester')),
        h('tr', {}, h('td', {}, '2차시'), h('td', {}, '해커의 눈·대결 → 규칙의 역사(90일 실험) → 만드는 법 네 가지(도메인 규칙의 약점) → 2단계 인증·패스키 → 운영자 모형 → 종합 문제·다짐·활동지'), h('td', { class: 'mono' }, '#check/persona · #make/methods · #make/operator'))))),
    상자('tip', '💡 실제 조회는 가정에서 보호자와 함께', 글('개인정보 포털 조회에는 **본인 명의** 휴대폰·아이핀·신용카드가 필요하다. 교실에서는 연습 화면으로 익히고, 실제 조회는 과제로 안내하는 편이 좋다.')),
    h('p', {}, '공식 서비스: ', 링크(공식주소.포털, '개인정보 포털'), ' · ', 링크(공식주소.털린정보, '털린 내 정보 찾기')),
    h('p', { class: 'small' }, '관련 성취기준 — [12정05-02] 보호해야 할 정보와 공유해야 할 정보를 구분하고, 올바른 정보 보호 방법을 실천한다. [12정05-03] 정보보안의 필요성을 이해하고, 보안 기술을 활용하여 디지털 윤리를 실천한다.'),
  );
}
