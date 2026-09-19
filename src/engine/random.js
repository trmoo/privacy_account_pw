/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  무작위 뽑기.
 *
 *  ① 암호용 무작위 — 비밀번호·단어 잇기를 만들 때 쓴다.
 *     Math.random() 은 다음 값을 짐작할 수 있어 비밀번호에 쓰면 안 된다.
 *     브라우저의 crypto.getRandomValues() 는 운영체제가 모은 예측 불가능한 값을 준다.
 *  ② 씨앗 있는 무작위 — 「사이트 운영자」 모형에서 쓴다.
 *     같은 씨앗이면 언제나 같은 결과가 나와서, 규칙만 바꿨을 때의 차이를 공정하게 비교할 수 있다.
 */

// 0 이상 n 미만의 정수를 고르게 하나 뽑는다.
// 2³² 을 n 으로 나눈 나머지만큼의 값은 버린다 — 그러지 않으면 작은 수가 조금 더 자주 나온다(치우침).
export function 암호정수(n) {
  if (!(n > 0 && n <= 2 ** 32)) throw new Error('범위를 벗어난 수');
  const 한계 = 2 ** 32 - (2 ** 32 % n);
  const 칸 = new Uint32Array(1);
  for (;;) {
    globalThis.crypto.getRandomValues(칸);
    if (칸[0] < 한계) return 칸[0] % n;
  }
}

export function 암호뽑기(목록) {
  return 목록[암호정수(목록.length)];
}

// 씨앗 있는 무작위 (mulberry32). 0 이상 1 미만의 수를 차례로 낸다.
export function 씨앗무작위(씨앗) {
  let a = 씨앗 >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
