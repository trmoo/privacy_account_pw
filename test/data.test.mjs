/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  자료 시험 — 문항·화면·연습용 포털 자료가 서로 어긋나지 않는지 지킨다.
 */
import { 묶음, 확인, 참 } from './harness.mjs';
import { 탭들, 활동들, 진행률, 전체점수, 활동끝났나 } from '../src/data/activities.js';
import { 검색결과, 포털메뉴, 조회기간, 인증수단, 조회결과, 불가종류, 연표, 점검표, 참고한글, 사실출처, 공식주소, 바로잡은곳, 주기변경예 } from '../src/data/content.js';
import { 인물조각, 표적선택 } from '../src/data/persona.js';
import * as 사이트탭 from '../src/tabs/accounts.js';
import * as 검사탭 from '../src/tabs/check.js';
import * as 만들기탭 from '../src/tabs/make.js';
import * as 마무리탭 from '../src/tabs/finish.js';

const 탭모듈 = { accounts: 사이트탭, check: 검사탭, make: 만들기탭, finish: 마무리탭 };

묶음('탭과 화면');
확인('탭 네 개', 탭들.map((t) => t.id), ['accounts', 'check', 'make', 'finish']);
for (const t of 탭들) {
  const 하위 = 탭모듈[t.id].하위들;
  참(`${t.id}: 화면이 하나 이상`, 하위.length > 0);
  확인(`${t.id}: 화면 id 가 겹치지 않는다`, new Set(하위.map((x) => x.id)).size, 하위.length);
}
확인('화면 수는 모두 16', 탭들.reduce((s, t) => s + 탭모듈[t.id].하위들.length, 0), 16);

묶음('활동과 문항');
확인('활동 열쇠가 겹치지 않는다', new Set(활동들.map((a) => a.key)).size, 활동들.length);
for (const a of 활동들) {
  참(`${a.key}: 탭이 있다`, 탭들.some((t) => t.id === a.탭));
  참(`${a.key}: 화면(${a.화면})이 그 탭에 있다`, 탭모듈[a.탭].하위들.some((x) => x.id === a.화면));
  확인(`${a.key}: 문항 id 가 겹치지 않는다`, new Set(a.문항.map((q) => q.id)).size, a.문항.length);
  for (const q of a.문항) {
    참(`${a.key}/${q.id}: 보기가 둘 이상`, Array.isArray(q.보기) && q.보기.length >= 2);
    참(`${a.key}/${q.id}: 정답 번호가 보기 안에 있다`, Number.isInteger(q.답) && q.답 >= 0 && q.답 < q.보기.length);
    참(`${a.key}/${q.id}: 힌트와 해설이 있다`, !!q.힌트 && !!q.해설);
    확인(`${a.key}/${q.id}: 보기가 겹치지 않는다`, new Set(q.보기).size, q.보기.length);
  }
  if (a.체험) 참(`${a.key}: 체험 열쇠와 설명`, !!a.체험.열쇠 && !!a.체험.설명);
}
const 전체문항 = 활동들.reduce((s, a) => s + a.문항.length, 0);
확인('문항은 모두 63개', 전체문항, 63);
참('정답 번호가 한쪽으로 쏠리지 않는다(4지선다에서 0번이 70% 이하)', (() => {
  const 넷 = 활동들.flatMap((a) => a.문항).filter((q) => q.보기.length === 4);
  return 넷.filter((q) => q.답 === 0).length / 넷.length <= 0.7;
})());

묶음('진행률 계산');
const 빈 = { acts: {}, data: {} };
확인('빈 기록은 0', 진행률(빈).끝, 0);
확인('빈 기록 점수', 전체점수(빈), { 맞음: 0, 전체: 전체문항 });
const 가득 = { acts: {}, data: { 'portal-done': true, 'operator-nist': true, 'pledge-done': true } };
for (const a of 활동들) { 가득.acts[a.key] = {}; for (const q of a.문항) 가득.acts[a.key][q.id] = { a: q.답, ok: true, n: 1, shown: false }; }
확인('다 풀고 체험도 하면 모든 활동이 끝난다', 진행률(가득).끝, 활동들.length);
const 체험빠짐 = { ...가득, data: {} };
참('체험을 안 하면 체험 활동은 끝나지 않는다', !활동끝났나(체험빠짐, 활동들.find((a) => a.key === 'a-portal')));

묶음('정리 결정 게임 ↔ 연습용 포털 결과');
const 게임 = 활동들.find((a) => a.key === 'a-sort').문항;
확인('사이트 열두 곳', 게임.length, 12);
참('주소는 모두 .example (예시용 주소)', 게임.every((q) => q.사이트.주소.endsWith('.example')));
참('포털 결과 주소도 모두 .example', [...조회결과.가능, ...조회결과.불가].every((x) => x.주소.endsWith('.example')));
참('가짜 검색 결과도 공식 말고는 .example', 검색결과.filter((r) => !r.공식).every((r) => r.주소.endsWith('.example')));
for (const x of 조회결과.불가) {
  const q = 게임.find((g) => g.사이트.주소 === x.주소);
  참(`「불가」 ${x.이름} 는 게임에서 「직접 정리」가 정답`, !!q && q.답 === 1);
}
for (const x of 조회결과.가능) {
  const q = 게임.find((g) => g.사이트.주소 === x.주소);
  if (q) 확인(`「가능」 ${x.이름} 는 게임에서 「포털 신청」이 정답`, q.답, 0);
}
확인('정답 나눔: 포털 4 · 직접 5 · 계속 3', [0, 1, 2].map((n) => 게임.filter((q) => q.답 === n).length), [4, 5, 3]);

묶음('연습용 포털');
확인('공식 검색 결과는 하나', 검색결과.filter((r) => r.공식).length, 1);
확인('공식 결과의 주소', 검색결과.find((r) => r.공식).주소, 'www.privacy.go.kr');
확인('맞는 메뉴는 「웹사이트 회원탈퇴」 하나', 포털메뉴.filter((m) => m.맞음).map((m) => m.이름), ['웹사이트 회원탈퇴']);
확인('조회 기간 세 줄', 조회기간.map((x) => x.기간), ['최근 1년', '최근 2년', '최근 5년']);
확인('인증 수단 셋', 인증수단.length, 3);
확인('신청 불가 네 갈래', 불가종류.length, 4);

묶음('글감');
확인('연표 다섯 줄', 연표.length, 5);
참('연표에 2004년 발표와 2025년 7월 최신판', 연표.some((x) => x.때.includes('2004')) && 연표.some((x) => x.때 === '2025년 7월'));
참('연표에 블로그의 틀린 해(2007)가 없다', !연표.some((x) => x.때.includes('2007')));
확인('점검표 여덟 가지, id 겹침 없음', new Set(점검표.map((c) => c.id)).size, 8);
확인('90일 예시 다섯 번', 주기변경예.length, 5);
참('90일 예시는 끝 숫자만 하나씩 오른다', 주기변경예.every((p, i) => i === 0 || Number(p.match(/\d+/)[0]) === Number(주기변경예[i - 1].match(/\d+/)[0]) + 1));
확인('바로잡은 곳 세 가지', 바로잡은곳.length, 3);

묶음('바깥 주소');
const 주소들 = [...참고한글.map((x) => x.주소), ...사실출처.map((x) => x.주소), ...Object.values(공식주소)];
참('모두 https', 주소들.every((u) => u.startsWith('https://')));
참('참고한 블로그 두 편', 참고한글.length === 2 && 참고한글.every((x) => x.주소.includes('blog.naver.com')));
참('공식 주소 — 개인정보 포털', 공식주소.포털 === 'https://www.privacy.go.kr');
참('공식 주소 — 털린 내 정보 찾기', 공식주소.털린정보 === 'https://kidc.eprivacy.go.kr');

묶음('가상 인물');
참('조각에 순위가 1부터 차례로', 인물조각.every((p, i) => p.순위 === i + 1));
참('이름·생일·반려견·학교·전화 끝자리가 모두 있다', ['이름', '생일', '반려견 이름', '학교 이름', '휴대폰 번호 끝자리'].every((뜻) => 인물조각.some((p) => p.뜻 === 뜻)));
참('한영 전환 조각 zhddl(콩이)', 인물조각.some((p) => p.글 === 'zhddl'));
참('표적 선택이 조각을 담는다', 표적선택.인물 === 인물조각);
