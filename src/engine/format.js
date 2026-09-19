/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  아주 큰 수와 시간을 읽기 쉬운 우리말로 바꾼다.
 *    큰수말(8.5)  → '3.2억'     (10의 8.5제곱 ≈ 316,227,766)
 *    시간말(7.2)  → '6개월'     (10의 7.2제곱 초)
 *  수는 모두 상용로그(log10)로 받는다. 10의 40제곱 같은 수도 넘치지 않게 다루기 위해서다.
 */

// 우리 숫자는 네 자리마다 단위가 바뀐다: 만(10⁴) 억(10⁸) 조(10¹²) 경(10¹⁶) 해(10²⁰) …
const 단위 = [[0, ''], [4, '만'], [8, '억'], [12, '조'], [16, '경'], [20, '해'], [24, '자'], [28, '양'], [32, '구'], [36, '간'], [40, '정'], [44, '재'], [48, '극']];

export function 큰수말(lg) {
  if (!Number.isFinite(lg) || lg < 0) return '1';
  if (lg < 4) return Math.round(10 ** lg).toLocaleString('ko-KR');
  if (lg >= 52) return `10의 ${Math.floor(lg)}제곱`;
  let u = 단위[0];
  for (const x of 단위) if (lg >= x[0]) u = x;
  let 앞수 = 10 ** (lg - u[0]);
  if (앞수 >= 9999.5) { 앞수 /= 1e4; u = 단위[단위.indexOf(u) + 1] || u; }
  let 글;
  if (앞수 >= 100) 글 = Math.round(앞수).toLocaleString('ko-KR');
  else if (앞수 >= 10) 글 = String(Math.round(앞수));
  else 글 = 앞수.toFixed(1).replace(/\.0$/, '');
  return 글 + u[1];
}

// 「몇 번」 — 한글 단위(만·억·조…)로 끝나면 띄어 쓴다: 50번 · 1억 번 · 384조 번
export function 횟수말(lg) {
  const 수 = 큰수말(lg);
  return /[0-9]$/.test(수) ? `${수}번` : `${수} 번`;
}

const 분 = 60;
const 시간 = 3600;
const 하루 = 86400;
const 한달 = 2629800;
const 한해 = 31557600;

export function 시간말(lg초) {
  if (!Number.isFinite(lg초)) return '-';
  if (lg초 < 0) return '1초도 안 걸림';
  const 초 = 10 ** lg초;
  if (초 < 분) return `${Math.max(1, Math.floor(초))}초`;
  if (초 < 시간) return `${Math.floor(초 / 분)}분`;
  if (초 < 하루) return `${Math.floor(초 / 시간)}시간`;
  if (초 < 한달) return `${Math.floor(초 / 하루)}일`;
  if (초 < 한해) return `${Math.floor(초 / 한달)}개월`;
  const lg해 = lg초 - Math.log10(한해);
  if (lg해 >= Math.log10(1.38e10)) return '우주의 나이(138억 년)보다 오래';
  const 수 = 큰수말(lg해);
  return /[0-9]$/.test(수) ? `${수}년` : `${수} 년`;
}

// 10의 몇 제곱인지를 위첨자로 (10¹² 처럼)
const 위숫자 = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export function 제곱말(지수) {
  return '10' + String(Math.round(지수)).split('').map((d) => 위숫자[d] ?? d).join('');
}
