/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  자판 배열 찾기 — qwer · asdf · 1q2w3e4r 처럼 「자판에서 붙어 있는 글쇠를 차례로 누른」 부분을 찾는다.
 *
 *  자판을 비스듬한 칸으로 본다. 칸 (줄, 칸번호) 의 이웃은 여섯 곳이다.
 *     왼쪽 (r, c-1) · 오른쪽 (r, c+1)
 *     위    (r-1, c) · (r-1, c+1)
 *     아래  (r+1, c-1) · (r+1, c)
 *  q 줄·a 줄·z 줄이 모두 칸번호 1 에서 시작하게 두면 실제 자판처럼 q 는 1·2 아래, a 는 q·w 아래가 된다.
 */

const 줄들 = ['`1234567890-=', 'qwertyuiop[]\\', "asdfghjkl;'", 'zxcvbnm,./'];
const 윗줄들 = ['~!@#$%^&*()_+', 'QWERTYUIOP{}|', 'ASDFGHJKL:"', 'ZXCVBNM<>?'];
const 시작칸 = [0, 1, 1, 1];

// 글자 → { r, c, 윗: Shift 글자인가 }
const 자리 = new Map();
줄들.forEach((줄, r) => {
  [...줄].forEach((ch, i) => 자리.set(ch, { r, c: 시작칸[r] + i, 윗: false }));
  [...윗줄들[r]].forEach((ch, i) => 자리.set(ch, { r, c: 시작칸[r] + i, 윗: true }));
});

const 칸글자 = new Map(); // "r,c" → 아래 글자
줄들.forEach((줄, r) => [...줄].forEach((ch, i) => 칸글자.set(`${r},${시작칸[r] + i}`, ch)));

const 방향들 = [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, -1], [1, 0]];

// 두 글자가 자판에서 이웃이면 방향 번호(0~5), 아니면 -1
export function 이웃방향(가, 나) {
  const a = 자리.get(가);
  const b = 자리.get(나);
  if (!a || !b) return -1;
  for (let d = 0; d < 방향들.length; d++) {
    if (a.r + 방향들[d][0] === b.r && a.c + 방향들[d][1] === b.c) return d;
  }
  return -1;
}

// 시작할 수 있는 글쇠 수와 한 글쇠의 평균 이웃 수 — 추측 횟수 계산에 쓴다.
export const 시작수 = 자리.size;
export const 평균이웃 = (() => {
  let 합 = 0;
  for (const 칸 of 칸글자.keys()) {
    const [r, c] = 칸.split(',').map(Number);
    for (const [dr, dc] of 방향들) if (칸글자.has(`${r + dr},${c + dc}`)) 합++;
  }
  return 합 / 칸글자.size;
})();

export function 윗글자인가(ch) {
  return !!자리.get(ch)?.윗;
}

// 이항계수 C(n, k)
export function 조합(n, k) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// 자판 배열 조각 하나의 추측 횟수.
//   길이 L, 꺾인 횟수 t 인 길을 모두 헤아린다:  Σ(길이 i) Σ(꺾임 j) C(i-1, j-1) × 시작수 × 평균이웃^j
//   Shift 글자가 섞였으면 어느 글자에 Shift 를 눌렀는지도 맞혀야 하므로 경우가 더 늘어난다.
export function 자판추측(길이, 꺾임, 윗글자수) {
  let 추측 = 0;
  for (let i = 2; i <= 길이; i++) {
    for (let j = 1; j <= Math.min(꺾임, i - 1); j++) {
      추측 += 조합(i - 1, j - 1) * 시작수 * 평균이웃 ** j;
    }
  }
  if (윗글자수 > 0) {
    const 아래 = 길이 - 윗글자수;
    if (아래 === 0) 추측 *= 2;
    else {
      let 경우 = 0;
      for (let i = 1; i <= Math.min(윗글자수, 아래); i++) 경우 += 조합(윗글자수 + 아래, i);
      추측 *= 경우;
    }
  }
  return 추측;
}

// 비밀번호에서 자판 배열 조각을 모두 찾는다 (3글자 이상).
export function 자판배열찾기(pw) {
  const 결과 = [];
  const 글 = [...pw];
  let i = 0;
  while (i < 글.length - 2) {
    let j = i;
    let 앞방향 = null;
    let 꺾임 = 0;
    let 윗 = 윗글자인가(글[i]) ? 1 : 0;
    while (j + 1 < 글.length) {
      const d = 이웃방향(글[j], 글[j + 1]);
      if (d < 0) break;
      if (d !== 앞방향) { 꺾임++; 앞방향 = d; }
      j++;
      if (윗글자인가(글[j])) 윗++;
    }
    if (j - i + 1 >= 3) {
      const 토막 = 글.slice(i, j + 1).join('');
      결과.push({ i, j, 토막, 꺾임, 윗, 추측: 자판추측(j - i + 1, 꺾임, 윗) });
      i = j;
    } else {
      i++;
    }
  }
  return 결과;
}
