/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  화면을 만드는 잔손. 요소 만들기 · 화면 수명 관리 · 알림창 · 파일 내려받기 · 비밀번호 입력칸.
 */

// 요소 하나 만들기.
// ⚠ 자식 자리에 넣는 문자열은 글자 그대로 들어간다. 태그를 쓰려면 { html: '...' }.
export function h(태그, 속성 = {}, ...자식들) {
  const el = document.createElement(태그);
  for (const [k, v] of Object.entries(속성 || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = !!v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of 자식들.flat(9)) {
    if (c == null || c === false || c === '') continue;
    el.appendChild(c?.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

// SVG 요소는 이름공간이 달라서 따로 만든다.
export function s(태그, 속성 = {}, ...자식들) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 태그);
  for (const [k, v] of Object.entries(속성 || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const c of 자식들.flat(9)) {
    if (c == null || c === false || c === '') continue;
    el.appendChild(c?.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

// **굵게** 는 <b>, `글쇠` 는 <code> 로 바꾼 html 조각. 글 안의 < > & 는 먼저 안전하게 바꾼다.
export function md(글) {
  return 이스케이프(글)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

export function 이스케이프(글) {
  return String(글 ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 설명 상자: 종류 = 'info' | 'tip' | 'warn' | 'now' | 'fix'
export function 상자(종류, 제목, ...내용) {
  return h('div', { class: `box box-${종류}` }, 제목 && h('div', { class: 'box-title' }, 제목), ...내용);
}

// 문단 하나 (**굵게** 를 살린다)
export function 글(내용, 속성 = {}) {
  return h('p', { ...속성, html: md(내용) });
}

// 접었다 펴는 상자
export function 접이(제목, ...내용) {
  return h('details', { class: 'more' }, h('summary', {}, 제목), h('div', { class: 'more-body' }, ...내용));
}

// 바깥 사이트로 가는 링크. 새 탭으로 열고, 이 앱 주소를 넘기지 않는다.
export function 링크(주소, 이름) {
  return h('a', { href: 주소, target: '_blank', rel: 'noopener noreferrer', class: 'ext' }, 이름 || 주소, ' ↗');
}

// ── 화면 수명 관리 ───────────────────────────────────────────
// 탭을 옮기면 화면은 지워지지만 window 에 걸어 둔 리스너·타이머·애니메이션은 살아남아
// 오갈 때마다 쌓인다. 새 화면을 그리기 직전에 여기서 걷어 낸다.
// ⚠ 탭 파일에서 window.addEventListener('resize', …)·setInterval·setTimeout·requestAnimationFrame 을 직접 쓰지 말 것.
let 리사이즈들 = [];
let 타이머들 = [];
let 한번타이머들 = [];
let 애니들 = [];

export function 화면시작() {
  리사이즈들.forEach((f) => window.removeEventListener('resize', f));
  리사이즈들 = [];
  타이머들.forEach(clearInterval);
  타이머들 = [];
  한번타이머들.forEach(clearTimeout);
  한번타이머들 = [];
  애니들.forEach((a) => { a.멈춤 = true; cancelAnimationFrame(a.id); });
  애니들 = [];
}

export function 창크기바뀔때(fn) {
  window.addEventListener('resize', fn);
  리사이즈들.push(fn);
}

export function 화면타이머(fn, ms) {
  const id = setInterval(fn, ms);
  타이머들.push(id);
  return id;
}

export function 타이머멈춤(id) {
  clearInterval(id);
  타이머들 = 타이머들.filter((x) => x !== id);
}

// ms 뒤에 한 번. 화면을 옮기면 저절로 취소된다.
export function 나중에(fn, ms) {
  const id = setTimeout(fn, ms);
  한번타이머들.push(id);
  return id;
}

// 매 프레임 fn(지금ms) 를 부른다. 화면을 옮기면 저절로 멈춘다.
export function 화면애니(fn) {
  const 애니 = { id: 0, 멈춤: false };
  const 한번 = (t) => {
    if (애니.멈춤) return;
    fn(t);
    애니.id = requestAnimationFrame(한번);
  };
  애니.id = requestAnimationFrame(한번);
  애니들.push(애니);
  return 애니;
}

// ── 알림창 ───────────────────────────────────────────────────
// 브라우저 기본 alert·confirm 은 주소를 함께 보여 주어 교실 화면에 어울리지 않는다.
export function 알림(제목, 내용, { 확인 = '확인', 취소 = null } = {}) {
  return new Promise((resolve) => {
    const 닫기 = (값) => { 덮개.remove(); document.removeEventListener('keydown', 키); resolve(값); };
    const 키 = (e) => { if (e.key === 'Escape') 닫기(false); };
    const 단추들 = h('div', { class: 'modal-btns' },
      취소 && h('button', { class: 'btn', onClick: () => 닫기(false) }, 취소),
      h('button', { class: 'btn primary', onClick: () => 닫기(true) }, 확인),
    );
    const 본문 = typeof 내용 === 'string' ? h('p', { html: md(내용) }) : 내용;
    const 창 = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, h('h3', {}, 제목), 본문, 단추들);
    const 덮개 = h('div', { class: 'overlay', onClick: (e) => { if (e.target === 덮개) 닫기(false); } }, 창);
    document.body.appendChild(덮개);
    document.addEventListener('keydown', 키);
    창.querySelector('.primary').focus();
  });
}

// 잠깐 떴다 사라지는 알림
export function 토스트(글) {
  const el = h('div', { class: 'toast', role: 'status' }, 글);
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('out'), 1800);
  setTimeout(() => el.remove(), 2300);
}

// ── 파일 내려받기 ─────────────────────────────────────────────
// 서버 없이 브라우저 안에서 파일을 만들어 내려받게 한다(인터넷 없이도 된다).
export function 내려받기(파일이름, 내용, 종류 = 'text/html') {
  const blob = new Blob([내용], { type: `${종류};charset=utf-8` });
  const 주소 = URL.createObjectURL(blob);
  const a = h('a', { href: 주소, download: 파일이름, style: { display: 'none' } });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(주소); a.remove(); }, 1000);
}

// 알약 단추 줄 (화면 안의 작은 갈래 고르기)
export function 알약줄(항목들, 지금, 고를때) {
  return h('div', { class: 'pills small' },
    항목들.map((항) => h('button', {
      class: 'pill' + (항.id === 지금 ? ' on' : ''),
      'aria-pressed': 항.id === 지금 ? 'true' : 'false',
      onClick: () => 고를때(항.id),
    }, 항.label)));
}

// ── 비밀번호 입력칸 ──────────────────────────────────────────
// 브라우저가 입력을 기억하거나(자동 완성) 맞춤법 검사로 보내지 않게 막는다.
// 값은 이 칸 안에만 있고, 기록소(브라우저 저장소)·주소창 어디에도 넣지 않는다.
export function 비번칸({ 자리표시 = '연습용 비밀번호를 넣어 보세요', 처음 = '', 바뀔때 = () => {}, 이름 = '비밀번호 입력', 보이기 = false } = {}) {
  const 입력 = h('input', {
    type: 보이기 ? 'text' : 'password', class: 'pw-input', value: 처음, placeholder: 자리표시,
    autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
    'data-lpignore': 'true', 'aria-label': 이름, maxlength: '64',
    onInput: () => 바뀔때(입력.value),
  });
  const 눈 = h('button', {
    class: 'btn small ghost eye', type: 'button', 'aria-label': '비밀번호 보이기/가리기',
    onClick: () => {
      입력.type = 입력.type === 'password' ? 'text' : 'password';
      눈.textContent = 입력.type === 'password' ? '👁 보이기' : '🙈 가리기';
    },
  }, 보이기 ? '🙈 가리기' : '👁 보이기');
  const 칸 = h('div', { class: 'pw-row' }, 입력, 눈);
  칸.값 = () => 입력.value;
  칸.넣기 = (v) => { 입력.value = v; 바뀔때(v); };
  칸.입력 = 입력;
  return 칸;
}
