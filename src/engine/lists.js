/*! 내 계정 지킴이 — © 2026 티쳐무 · 모든 권리 보유
 *  해커가 맨 먼저 넣어 보는 낱말 목록들.
 *
 *  ⚠ 이 목록은 남의 목록을 베낀 것이 아니다. 공개 보고서
 *    (영국 NCSC 「가장 많이 털린 비밀번호」 2019, NordPass 「흔한 비밀번호」 2025)에 나온 경향과
 *    널리 알려진 자판·숫자 패턴을 바탕으로 수업용으로 직접 추렸다. 앞에 있을수록 흔하다고 본다.
 *    진짜 해커의 목록은 수억 개짜리다 — 여기 없다고 안전하다는 뜻이 아니다.
 */

// 흔한 비밀번호 — 대소문자를 가리지 않고 맞춘다.
export const 흔한비밀번호 = [
  '123456', '123456789', '12345678', '1234qwer', 'qwer1234', '1q2w3e4r', '12345', '111111', '1111111', 'password',
  'qwerty', '1234567', '1234567890', 'admin', '123123', '000000', '1q2w3e4r5t', 'asdf1234', 'abc123', '1234',
  '11111111', '1qaz2wsx', 'zxcv1234', 'qwe123', 'a123456', 'aa123456', 'qwerty123', 'iloveyou', '654321', '123321',
  '1q2w3e', 'a1234567', 'a12345678', 'abcd1234', 'q1w2e3r4', 'zaq12wsx', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'asdfasdf',
  'qwerqwer', '1qazxsw2', '12qwaszx', 'qazwsx', 'qweasd', 'qweasdzxc', '123qwe', '123asd', '123abc', 'abc1234',
  'password1', 'password123', 'passw0rd', 'p@ssw0rd', 'pass1234', 'admin123', 'admin1234', 'root', 'guest', 'test',
  'test1234', 'user', 'login', 'welcome', 'letmein', 'master', 'secret', 'hello', 'hello123', 'love',
  'loveyou', 'iloveyou1', 'love1234', 'sunshine', 'princess', 'dragon', 'monkey', 'shadow', 'superman', 'batman',
  'football', 'baseball', 'soccer', 'pokemon', 'naruto', 'charlie', 'michael', 'ashley', 'jessica', 'daniel',
  'liverpool', 'chelsea', 'blink182', 'starwars', 'whatever', 'freedom', 'trustno1', 'computer', 'internet', 'samsung',
  '666666', '777777', '888888', '999999', '555555', '222222', '333333', '444444', '112233', '121212',
  '159753', '147258', '147258369', '159357', '987654321', '987654', '0987654321', '12341234', '11112222', '123654',
  '12344321', '0000', '1111', '2222', '1212', '7777', '0000000', '00000000', '1234512345', '123456a',
  '123456q', '1234abcd', 'a1b2c3d4', 'a1b2c3', 'aaa111', 'aaaa1111', 'asdf', 'qwer', 'zxcv', 'asdfgh',
  'qwerasdf', 'asdfqwer', 'qwerasdfzxcv', '1q2w3e4r!', '1q2w3e4r!@', 'qwer1234!', 'qwer1234!@', 'asdf1234!', 'p@ssw0rd!', 'password!',
  '1q2w3e!@#', '!@#$%^', '!@#$', '!@#$%^&*', '1234!@#$', 'qwer!@#$', '1234qwer!', 'q1w2e3', 'z1x2c3', 'qaz123',
  'korea', 'korea123', 'seoul', 'hi', 'hihi', 'hihello', 'good', 'goodluck', 'happy', 'happy123',
  'lucky', 'lucky7', 'star', 'angel', 'baby', 'babygirl', 'cutie', 'kitty', 'puppy', 'cookie',
  'chocolate', 'banana', 'apple', 'orange', 'summer', 'winter', 'spring', 'flower', 'music', 'game',
  'gamer', 'player', 'killer', 'hunter', 'ninja', 'tiger', 'lion', 'panda', 'bear', 'rabbit',
  'minecraft', 'roblox', 'fortnite', 'google', 'naver', 'daum', 'kakao', 'youtube', 'instagram', 'facebook',
  'qwerty1', 'qwerty12', 'qwer12', 'qwer123', 'asdf123', 'zxcv123', 'abcd', 'abcde', 'abcdef', 'abcdefg',
];

// 비밀번호에 자주 쓰는 한국어 낱말 — 영문 상태로 치면 tkfkdgo(사랑해) 같은 「한영 전환」이 된다.
// 두 글자 이상만 담는다(한 글자는 무작위 글자와 구별이 안 된다).
export const 한국어비번낱말 = [
  '사랑해', '사랑', '안녕', '안녕하세요', '비밀번호', '비번', '가나다라', '가나다', '행복', '사랑해요',
  '우리', '우리집', '가족', '엄마', '아빠', '친구', '하늘', '바다', '대한민국', '한국',
  '서울', '부산', '학교', '공부', '게임', '축구', '야구', '농구', '음악', '노래',
  '강아지', '고양이', '토끼', '햄스터', '초코', '뽀삐', '콩이', '두부', '보리', '해피',
  '나비', '구름', '공주', '왕자', '천사', '비밀', '암호', '컴퓨터', '핸드폰', '휴대폰',
  '아이디', '로그인', '관리자', '선생님', '학생', '생일', '생일축하', '축하', '크리스마스', '새해',
  '여름', '가을', '겨울', '바람', '햇살', '달빛', '별빛', '무지개', '딸기', '사과',
  '바나나', '포도', '수박', '피자', '치킨', '떡볶이', '라면', '김치', '우유', '커피',
  '초콜릿', '사탕', '과자', '하하', '호호', '헤헤', '히히', '크크', '화이팅', '파이팅',
  '힘내', '최고', '대박', '소원', '희망', '행운', '기적', '영원히', '영원', '약속',
  '첫사랑', '자기야', '여보', '오빠', '언니', '누나', '동생', '할머니', '할아버지', '태양',
  '지구', '우주', '은하수', '보고싶어', '고마워', '미안해', '좋아해', '반가워', '잘자', '굿모닝',
  '인천', '대구', '광주', '대전', '제주', '민준', '서준', '도윤', '예준', '시우',
  '하준', '지호', '주원', '지후', '준우', '서연', '서윤', '지우', '서현', '하은',
  '하윤', '민서', '지유', '윤서', '채원', '수아', '지민', '지원', '수빈', '예은',
  '다은', '은서', '민지', '유진', '현우', '동현', '승민', '민수', '영희', '철수',
];

// 로마자로 쓴 흔한 이름·성 — 대소문자를 가리지 않고 맞춘다.
export const 로마자이름 = [
  'minjun', 'seojun', 'doyun', 'yejun', 'siwoo', 'hajun', 'jiho', 'juwon', 'jihoo', 'junwoo',
  'seoyeon', 'seoyun', 'jiwoo', 'seohyun', 'haeun', 'hayun', 'minseo', 'jiyu', 'yunseo', 'chaewon',
  'sua', 'jimin', 'jiwon', 'subin', 'yeeun', 'daeun', 'eunseo', 'minji', 'yujin', 'hyunwoo',
  'donghyun', 'seungmin', 'minsu', 'jisoo', 'haneul', 'sora', 'yuna', 'jihye', 'sujin', 'eunji',
  'kim', 'lee', 'park', 'choi', 'jung', 'jeong', 'kang', 'cho', 'yoon', 'jang',
  'lim', 'han', 'shin', 'seo', 'kwon', 'hwang', 'ahn', 'song', 'ryu', 'jeon',
];
