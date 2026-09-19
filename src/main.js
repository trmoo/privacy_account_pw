/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  학교 수업 목적으로만 이용해 주세요. 무단 배포·상업적 이용을 금합니다.
 *
 *  정보 · Ⅴ. 디지털 문화
 *    [12정05-02] 보호해야 할 정보와 공유해야 할 정보를 구분하고, 올바른 정보 보호 방법을 실천한다.
 *    [12정05-03] 정보보안의 필요성을 이해하고, 보안 기술을 활용하여 디지털 윤리를 실천한다.
 *
 *  탭 네 개
 *    ① 가입한 사이트 찾기 → ② 비밀번호 안전 검사 → ③ 안전한 비밀번호 만들기 → ④ 마무리
 *
 *  주소 해시로 화면을 가리킬 수 있다 (#check/tester · #make/operator).
 *  수업에서 「지금 이 화면을 열어 보세요」라고 주소를 불러 주기 위함이다.
 */
import './style.css';
import { h, 화면시작 } from './lib/ui.js';
import { 불러오기, 구독, 지금기록 } from './lib/store.js';
import { 탭들, 진행률, 전체점수 } from './data/activities.js';
import * as 사이트탭 from './tabs/accounts.js';
import * as 검사탭 from './tabs/check.js';
import * as 만들기탭 from './tabs/make.js';
import * as 마무리탭 from './tabs/finish.js';

const 탭모듈 = { accounts: 사이트탭, check: 검사탭, make: 만들기탭, finish: 마무리탭 };

불러오기();

const 탭줄 = h('nav', { class: 'tabs', 'aria-label': '큰 갈래' });
const 진행 = h('div', { class: 'progress' });
const 본문 = h('main', { class: 'main' });

document.getElementById('app').append(
  h('header', { class: 'topbar' },
    h('div', { class: 'brand' },
      h('h1', {}, '🔐 내 계정 지킴이'),
      h('span', { class: 'std' }, '정보 Ⅴ. 디지털 문화 — 가입한 사이트 찾기 · 비밀번호 안전 검사 · 안전한 비밀번호 만들기'),
      진행),
    탭줄),
  h('div', { class: 'safe-bar', role: 'note' },
    '🛡️ 이 앱에 넣은 비밀번호는 이 컴퓨터 밖으로 나가지 않고 저장되지도 않습니다. 그래도 ',
    h('b', {}, '진짜 쓰는 비밀번호는 넣지 마세요'),
    ' — 비슷한 모양의 연습용 비밀번호로 충분합니다.'),
  본문,
  h('footer', { class: 'footer' },
    h('div', { class: 'cr' }, '© 2026 티쳐무 · 모든 권리 보유'),
    h('div', {}, '학교 수업 목적으로만 이용해 주세요. 무단 배포와 상업적 이용을 금합니다.'),
    h('div', {}, '연습 화면의 사이트·인물은 모두 지어낸 것입니다.'),
    h('div', {}, '개인정보를 수집하지 않습니다. 문항 기록만 이 브라우저에 남고, 비밀번호는 어디에도 저장하지 않습니다.')),
);

// ── 주소 읽기 ────────────────────────────────────────────────
function 주소() {
  const [탭, 하위] = (location.hash || '').replace(/^#/, '').split('/');
  const 모듈 = 탭모듈[탭] ? 탭 : 'accounts';
  const 하위들 = 탭모듈[모듈].하위들;
  const 고른하위 = 하위들.find((x) => x.id === 하위) ? 하위 : 하위들[0].id;
  return { 탭: 모듈, 하위: 고른하위 };
}

export function 이동(탭, 하위) {
  const 다음 = '#' + 탭 + (하위 ? '/' + 하위 : '');
  if (location.hash === 다음) 그리기();
  else location.hash = 다음;
}

// 지금 화면 다음 차례(같은 탭의 다음 하위, 없으면 다음 탭의 첫 하위)
function 다음자리(탭, 하위) {
  const 하위들 = 탭모듈[탭].하위들;
  const i = 하위들.findIndex((x) => x.id === 하위);
  if (i < 하위들.length - 1) return { 탭, 하위: 하위들[i + 1].id, 이름: 하위들[i + 1].label };
  const j = 탭들.findIndex((t) => t.id === 탭);
  if (j < 탭들.length - 1) {
    const 다음탭 = 탭들[j + 1];
    return { 탭: 다음탭.id, 하위: 탭모듈[다음탭.id].하위들[0].id, 이름: 다음탭.이름 };
  }
  return null;
}

function 진행그리기() {
  const 진 = 진행률(지금기록());
  const 점 = 전체점수(지금기록());
  진행.replaceChildren(
    h('span', { class: 'chip' }, `끝낸 활동 ${진.끝}/${진.전체}`),
    h('span', { class: 'chip' }, `맞힌 문항 ${점.맞음}/${점.전체}`),
  );
}

function 그리기() {
  화면시작();
  const { 탭, 하위 } = 주소();
  탭줄.replaceChildren(...탭들.map((t) => h('button', {
    class: 'tab' + (t.id === 탭 ? ' on' : ''),
    'aria-current': t.id === 탭 ? 'page' : null,
    onClick: () => 이동(t.id),
  }, t.이름)));

  const 모듈 = 탭모듈[탭];
  const 하위줄 = 모듈.하위들.length > 1
    ? h('div', { class: 'pills', role: 'tablist' }, 모듈.하위들.map((x) => h('button', {
      class: 'pill' + (x.id === 하위 ? ' on' : ''), onClick: () => 이동(탭, x.id),
      'aria-current': x.id === 하위 ? 'true' : null,
    }, x.label)))
    : null;

  const 자리 = h('div', { class: 'screen' });
  const 다음 = 다음자리(탭, 하위);
  // ⚠ replaceChildren 은 null 을 「null」 글자로 넣는다. 빈 자리는 걸러 낸다.
  본문.replaceChildren(...[
    하위줄,
    자리,
    다음 && h('div', { class: 'next-row' },
      h('button', { class: 'btn primary big', onClick: () => { 이동(다음.탭, 다음.하위); window.scrollTo(0, 0); } }, `다음: ${다음.이름} →`)),
  ].filter(Boolean));
  모듈.그리기(자리, 하위, 이동);
}

구독(진행그리기);
window.addEventListener('hashchange', () => { 그리기(); window.scrollTo(0, 0); });
진행그리기();
그리기();
