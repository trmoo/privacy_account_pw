/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  비밀번호를 만드는 네 가지 방법.
 *    ⓐ 도메인 규칙법   — 사이트 주소에서 글자를 뽑아 나만의 비밀 조각에 붙인다 (사이트마다 달라진다)
 *    ⓑ 문장 첫 글자법  — 나만 아는 문장의 낱말마다 첫 음절을 영문 자판으로 친다
 *    ⓒ 무작위 단어 잇기 — 컴퓨터가 무작위로 뽑은 낱말 여러 개를 잇는다
 *    ⓓ 무작위 생성기   — 비밀번호 관리자가 하듯 글자를 무작위로 뽑는다
 *  그리고 ⓐ 의 약점을 보여 주는 「규칙 거꾸로 찾기」(해커의 눈).
 */
import { 한글을자판으로, 한글음절인가 } from './hangul.js';
import { 잇기낱말 } from './words-ko.js';
import { 암호정수, 암호뽑기 } from './random.js';

// ── ⓐ 도메인 규칙법 ──────────────────────────────────────────
// 주소에서 사이트 이름 부분만 꺼낸다: www.naver.com → naver, mail.example.co.kr → example
export function 도메인이름(주소) {
  const 호스트 = String(주소 ?? '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '').split(/[/?#:]/)[0];
  const 칸 = 호스트.split('.').filter(Boolean);
  if (칸[0] === 'www') 칸.shift();
  let 이름;
  if (칸.length >= 3 && /^(co|or|go|ac|ne|re|pe|hs|ms|es|sc|kg)$/.test(칸[칸.length - 2])) 이름 = 칸[칸.length - 3];
  else if (칸.length >= 2) 이름 = 칸[칸.length - 2];
  else 이름 = 칸[0] || '';
  return 이름.replace(/[^a-z0-9]/g, '');
}

export const 뽑는법들 = [
  { id: '앞3', 이름: '앞 세 글자', 뽑기: (d) => d.slice(0, 3) },
  { id: '홀수', 이름: '홀수 번째 글자', 뽑기: (d) => [...d].filter((_, i) => i % 2 === 0).join('') },
  { id: '자음', 이름: '모음(a·e·i·o·u) 빼기', 뽑기: (d) => d.replace(/[aeiou]/g, '') },
  { id: '글자수', 이름: '글자 수', 뽑기: (d) => (d ? String(d.length) : '') },
];

export const 붙일자리들 = [
  { id: '앞', 이름: '비밀 조각 앞에' },
  { id: '가운데', 이름: '비밀 조각 가운데에' },
  { id: '뒤', 이름: '비밀 조각 뒤에' },
];

function 조각만들기(주소, 뽑기, 대문자) {
  const 법 = 뽑는법들.find((x) => x.id === 뽑기) || 뽑는법들[0];
  let 조각 = 법.뽑기(도메인이름(주소));
  if (대문자 && 조각) 조각 = 조각[0].toUpperCase() + 조각.slice(1);
  return 조각;
}

function 끼우기(비밀, 조각, 자리) {
  if (자리 === '앞') return 조각 + 비밀;
  if (자리 === '가운데') {
    const h = Math.ceil(비밀.length / 2);
    return 비밀.slice(0, h) + 조각 + 비밀.slice(h);
  }
  return 비밀 + 조각;
}

export function 도메인규칙(주소, { 비밀 = '', 뽑기 = '자음', 자리 = '뒤', 대문자 = false } = {}) {
  return 끼우기(비밀, 조각만들기(주소, 뽑기, 대문자), 자리);
}

// 해커의 눈: 털린 비밀번호 하나와 그 사이트 주소만으로 규칙 후보를 거꾸로 찾는다.
// 후보가 몇 개 안 되면, 다른 사이트의 비밀번호도 몇 번 만에 맞힐 수 있다.
export function 규칙거꾸로찾기(털린비번, 털린주소) {
  const 후보 = [];
  const 본 = new Set();
  for (const 법 of 뽑는법들) {
    for (const 대문자 of [false, true]) {
      const 조각 = 조각만들기(털린주소, 법.id, 대문자);
      if (!조각) continue;
      for (const 자리 of ['앞', '가운데', '뒤']) {
        const L = 털린비번.length - 조각.length;
        if (L <= 0) continue;
        let 비밀 = null;
        if (자리 === '앞' && 털린비번.startsWith(조각)) 비밀 = 털린비번.slice(조각.length);
        if (자리 === '뒤' && 털린비번.endsWith(조각)) 비밀 = 털린비번.slice(0, L);
        if (자리 === '가운데') {
          const h = Math.ceil(L / 2);
          if (털린비번.slice(h, h + 조각.length) === 조각) 비밀 = 털린비번.slice(0, h) + 털린비번.slice(h + 조각.length);
        }
        if (비밀 === null) continue;
        // 대문자로 바꿔도 조각이 같으면(숫자) 같은 후보다
        const 열쇠 = `${법.id}|${자리}|${조각}|${비밀}`;
        if (본.has(열쇠)) continue;
        본.add(열쇠);
        후보.push({ 뽑기: 법.id, 뽑기이름: 법.이름, 자리, 대문자, 비밀 });
      }
    }
  }
  return 후보;
}

// ── ⓑ 문장 첫 글자법 ─────────────────────────────────────────
// 낱말마다 첫 음절을 영문 자판으로, 숫자는 통째로, 끝의 문장부호는 살린다.
export function 문장첫글자(문장) {
  const 낱말들 = String(문장 ?? '').trim().split(/\s+/).filter(Boolean);
  let 결과 = '';
  const 풀이 = [];
  for (const w of 낱말들) {
    const 첫 = [...w][0];
    let 조각;
    if (한글음절인가(첫)) 조각 = 한글을자판으로(첫);
    else if (/[0-9]/.test(첫)) 조각 = w.match(/^[0-9]+/)[0];
    else 조각 = 첫;
    const 끝 = w.match(/[!?.,~]+$/);
    if (끝 && 끝[0] !== w) 조각 += 끝[0];
    결과 += 조각;
    풀이.push({ 낱말: w, 조각 });
  }
  return { 결과, 풀이 };
}

// ── ⓒ 무작위 단어 잇기 ───────────────────────────────────────
// 낱말 목록에서 암호용 무작위로 뽑는다. 경우의 수 = (목록 크기)^(낱말 수)
export function 단어잇기(낱말수 = 5, { 이음표 = '-', 뽑기 = 암호뽑기 } = {}) {
  const 낱말들 = Array.from({ length: 낱말수 }, () => 뽑기(잇기낱말));
  const 자판 = 낱말들.map(한글을자판으로).join(이음표);
  return { 낱말들, 자판, 목록크기: 잇기낱말.length, lg경우: 낱말수 * Math.log10(잇기낱말.length) };
}

// ── ⓓ 무작위 생성기 ──────────────────────────────────────────
export const 생성글자 = {
  소: 'abcdefghijklmnopqrstuvwxyz',
  대: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  숫: '0123456789',
  기: '!@#$%^&*-_=+?',
};

export function 무작위비밀번호(길이 = 16, 쓸무리 = ['소', '대', '숫', '기'], 헷갈림빼기 = true) {
  let 모음 = 쓸무리.map((k) => 생성글자[k] || '').join('');
  if (헷갈림빼기) 모음 = 모음.replace(/[0Oo1lI]/g, '');
  const 글자들 = [...모음];
  if (!글자들.length) return { 글: '', lg경우: 0, 글자수: 0 };
  let 글 = '';
  for (let i = 0; i < 길이; i++) 글 += 글자들[암호정수(글자들.length)];
  return { 글, lg경우: 길이 * Math.log10(글자들.length), 글자수: 글자들.length };
}
