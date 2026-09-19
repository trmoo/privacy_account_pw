/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  활동지와 기록소 시험 — 학생 글이 안전하게 들어가고, 비밀번호·학번·이름이 기록소에 남지 않는지.
 */
import { 묶음, 확인, 참 } from './harness.mjs';
import { 활동지만들기, 파일이름, 이스케이프 } from '../src/lib/report.js';
import { 저장소바꾸기, 불러오기, 답적기, 자료적기, 지금기록, 모두지우기, 검사, 앱이름 } from '../src/lib/store.js';
import { 활동들 } from '../src/data/activities.js';
import { 점검표 } from '../src/data/content.js';

// 가짜 저장소
const 칸 = new Map();
const 가짜 = { getItem: (k) => (칸.has(k) ? 칸.get(k) : null), setItem: (k, v) => 칸.set(k, String(v)), removeItem: (k) => 칸.delete(k) };
저장소바꾸기(가짜);
불러오기();

묶음('기록소');
답적기('a-why', 'q1', { a: 1, ok: true, n: 1, shown: false });
자료적기('checklist', { c1: true, c3: true });
자료적기('pledge', '이번 주에 <script>alert(1)</script> 메일 2단계 인증 켜기');
const 저장된 = JSON.parse([...칸.values()][0]);
확인('앱 이름이 붙는다', 저장된.app, 앱이름);
확인('문항 기록이 남는다', 저장된.acts['a-why'].q1.ok, true);
참('저장된 글에 학번·이름·비밀번호 칸이 없다', !/학번|이름|password|비밀번호/.test(Object.keys(저장된.data).join(',')));
확인('다른 앱 기록은 받지 않는다', 검사({ app: 'computer-spec', v: 1, acts: {}, data: {} }), null);
확인('모양이 틀린 기록은 받지 않는다', 검사({ app: 앱이름, acts: [], data: {} }), null);
확인('문항 기록의 알 수 없는 칸은 버린다', 검사({ app: 앱이름, acts: { x: { q: { a: 1, ok: true, n: 1, shown: false, 비번: 'qwer' } } }, data: {} }).acts.x.q, { a: 1, ok: true, n: 1, shown: false });

묶음('활동지');
const 글 = 활동지만들기(지금기록(), { 학번: '20315', 이름: '<b>홍길동</b>', 날짜: new Date(2026, 8, 20) });
참('학번이 들어간다', 글.includes('20315'));
참('이름은 이스케이프된다', 글.includes('&lt;b&gt;홍길동&lt;/b&gt;') && !글.includes('<b>홍길동</b>'));
참('다짐 속 <script> 는 글자로만', 글.includes('&lt;script&gt;') && !글.includes('<script>alert'));
참('점검표 여덟 줄', 점검표.every((c) => 글.includes(c.글)));
참('체크한 항목은 ☑', 글.includes(`☑ ${점검표[0].글}`) && 글.includes(`☐ ${점검표[1].글}`));
참('모든 활동 제목이 들어간다', 활동들.every((a) => 글.includes(이스케이프(a.제목))));
참('날짜', 글.includes('2026. 9. 20.'));
참('저작권 표시', 글.includes('© 2026 티쳐무'));
참('비밀번호가 들어 있지 않다는 안내', 글.includes('비밀번호가 들어 있지 않습니다'));
참('바깥 자원을 부르지 않는다', !/<script|<link|src=|https?:\/\//.test(글));

묶음('파일 이름');
확인('학번_이름', 파일이름('20315', '홍길동'), '계정지킴이_20315_홍길동.html');
확인('위험한 글자는 뺀다', 파일이름('../20315', 'a/b:c'), '계정지킴이_..20315_abc.html');
확인('비었으면 활동지', 파일이름('', ''), '계정지킴이_활동지.html');

묶음('모두 지우기');
모두지우기();
확인('저장소가 비었다', 칸.size, 0);
확인('기록도 비었다', Object.keys(지금기록().acts).length, 0);
