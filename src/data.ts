// 데모용 예시 데이터. 기관·업체 이름과 숫자는 모두 예시다.
// 실제 서비스에서는 나라장터 입찰공고·낙찰정보 API와 첨부파일 AI 요약으로 채운다.

export type Verdict = '충족' | '확인 필요' | '미충족';

export type Check = {item: string; verdict: Verdict; why: string};
export type SummaryRow = {k: string; v: string; src: string};
export type Attach = {kind: string; name: string};
export type Change = {at: string; item: string; before: string; after: string};

export type Notice = {
  id: string;
  title: string;
  agency: string;
  method: string; // 계약방법
  posted: string;
  base: number; // 기초금액(원)
  qty: string; // 과업량
  perTon: number | null; // 톤당 단가(원)
  perTonLevel: '높음' | '보통' | '낮음' | null; // 비슷한 공고 대비 (2차)
  deadline: string;
  dday: number;
  opening: string;
  verdict: Verdict;
  oneLine: string;
  isNew?: boolean;
  checks: Check[];
  summary: SummaryRow[];
  specials: string[];
  papers: string[];
  attachments: Attach[];
  changes: Change[];
  agencyNote: {past: number; avgBidders: string; topWinner: string; rebid: string};
  history?: string; // 작년에 누가 땄나 · 직전 수행사
  preDeadlines?: {k: string; v: string}[]; // 투찰보다 먼저인 마감
};

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '2027년 해양쓰레기 정화사업 ○○읍 폐기물처리 용역',
    agency: '전남 해솔군',
    method: '소액수의견적 · 지역제한(해솔군)',
    posted: '12.01 (화) 14:33',
    base: 48_320_000,
    qty: '폐합성수지 110톤 · 발포수지 200㎥',
    perTon: 439_273,
    perTonLevel: '보통',
    deadline: '12.04 (금) 12:00',
    dday: 3,
    opening: '12.04 (금) 13:00',
    verdict: '확인 필요',
    oneLine: '○○읍 항포구 해양쓰레기 상차·운반·처리, 30일. 섬 지역이라 해상 운송 여부 확인 필요.',
    isNew: true,
    checks: [
      {item: '소재지(해솔군)', verdict: '충족', why: '본점 소재지 일치'},
      {item: '처리업 허가', verdict: '충족', why: '중간재활용업(지정 외) — 허용 업종 3개 중 1개'},
      {item: '수집·운반업 허가', verdict: '충족', why: '사업장 비배출계 보유'},
      {item: '처리 품목', verdict: '확인 필요', why: '폐어망·폐목재 혼합 — 허가증 처리 품목 확인'},
      {item: '장비·처리능력', verdict: '충족', why: '공고 조건 없음 · 110톤은 약 4일분'},
    ],
    summary: [
      {k: '금액', v: '기초금액 4,832만 원(부가세 포함) · 하한율 88%', src: '공고서'},
      {k: '톤당 단가', v: '약 43.9만 원 = 4,832만 ÷ 110톤 (발포 200㎥ 포함 금액이라 실제 단가는 더 낮음)', src: '공고서·과업지시서'},
      {k: '계량', v: '관내 공인계량소, 감독관 확인 후 계측. 계량 비용 업체 부담', src: '과업지시서'},
      {k: '과업 기간', v: '착수일부터 30일 (수거·운반 25일, 처리 30일)', src: '과업지시서'},
      {k: '위치', v: '○○읍 일원 항포구·바닷가 (섬 지역 — 해상 운송 확인)', src: '과업지시서'},
      {k: '설계 단가', v: '설계내역서가 빈 파일 — 문서에 없음', src: '설계서'},
    ],
    specials: [
      '현장대리인 과업기간 내내 상주',
      '입찰 전 성상 확인 필수 — 계약 후 이의 불가',
      '반입장소 변경으로 운반거리가 늘어도 정산 없음',
      '하도급 금지 · 대금 청구 시 지역개발공채 2.5%',
    ],
    papers: ['계약 7일 이내 착수계·예정공정표·현장대리인 선임계', '안전보건관리 준수 서약서(대표자 서명)', '대금 청구 시 사진·인계서·계량증명서'],
    attachments: [
      {kind: '공고서', name: '(수의견적) 해양쓰레기 정화사업 ○○읍 폐기물처리 용역.pdf'},
      {kind: '과업지시서', name: '해양쓰레기 정화사업 과업지시서(○○읍).hwpx'},
      {kind: '설계서', name: '폐기물처리 설계내역서(○○읍).xlsx'},
    ],
    changes: [],
    agencyNote: {past: 41, avgBidders: '3.4곳', topWinner: 'A업체 (14회)', rebid: '1순위 업체 다음 공고 재참여 92%'},
    history: '작년 같은 사업(4차): 우리 회사 1순위 · 직전 3회 수행사 A업체→우리→우리 · 단독응찰·유찰 없음',
    preDeadlines: [
      {k: '입찰참가자격 등록', v: '12.02 (수) 18:00'},
      {k: '공동수급협정서 제출', v: '12.02 (수) 18:00'},
      {k: '투찰 개시', v: '12.02 (수) 12:00'},
    ],
  },
  {
    id: 'n2',
    title: '해안가 폐어구 집중수거 처리 용역',
    agency: '전남 바람시',
    method: '일반경쟁 · 지역제한(전남)',
    posted: '11.30 (월) 10:12',
    base: 126_500_000,
    qty: '폐어구·폐스티로폼 230톤',
    perTon: 550_000,
    perTonLevel: '높음',
    deadline: '12.08 (화) 10:00',
    dday: 7,
    opening: '12.08 (화) 11:00',
    verdict: '충족',
    oneLine: '바람시 해안가 5개 구역 폐어구 수거·처리, 60일. 단가가 비슷한 공고보다 높은 편.',
    isNew: true,
    checks: [
      {item: '지역(전남)', verdict: '충족', why: '전남 소재'},
      {item: '처리업 허가', verdict: '충족', why: '중간재활용업(지정 외)'},
      {item: '수집·운반업 허가', verdict: '충족', why: '사업장 비배출계 보유'},
      {item: '장비', verdict: '충족', why: '집게차 2대 이상 — 보유 5대'},
      {item: '허용보관량', verdict: '충족', why: '200톤 이상 — 보유 500톤'},
    ],
    summary: [
      {k: '금액', v: '기초금액 1억 2,650만 원(부가세 포함) · 하한율 87.745%', src: '공고서'},
      {k: '톤당 단가', v: '설계 단가 55만 원/톤 (수거 18만 + 운반 12만 + 처리 25만)', src: '설계서'},
      {k: '계량', v: '업체 사업장 계량대 사용 가능, 감독관 입회', src: '과업지시서'},
      {k: '과업 기간', v: '착수일부터 60일', src: '공고서'},
      {k: '위치', v: '바람시 해안 5개 구역 (육지)', src: '과업지시서'},
    ],
    specials: ['집게차 2대 이상 현장 투입', '허용보관량 200톤 이상', '주 1회 작업일지 제출'],
    papers: ['실적증명서(최근 3년 해양쓰레기 처리)', '장비 보유 확인서'],
    attachments: [
      {kind: '공고서', name: '입찰공고문.hwpx'},
      {kind: '과업지시서', name: '폐어구 집중수거 과업지시서.hwpx'},
      {kind: '설계서', name: '설계내역서.xlsx'},
    ],
    changes: [{at: '12.01 09:40', item: '개찰일시', before: '12.07 11:00', after: '12.08 11:00'}],
    agencyNote: {past: 18, avgBidders: '11.2곳', topWinner: 'B업체 (4회)', rebid: '1순위 업체 다음 공고 재참여 71%'},
  },
  {
    id: 'n3',
    title: '○○항 침적쓰레기 수거 처리 용역',
    agency: '전남 남빛군',
    method: '소액수의견적 · 지역제한(남빛군·해솔군)',
    posted: '11.29 (일) 16:05',
    base: 31_900_000,
    qty: '침적쓰레기 85톤',
    perTon: 375_294,
    perTonLevel: '낮음',
    deadline: '12.03 (목) 10:00',
    dday: 2,
    opening: '12.03 (목) 11:00',
    verdict: '충족',
    oneLine: '항내 침적쓰레기 인양·처리, 45일. 톤당 단가가 비슷한 공고보다 낮음 — 수익성 확인.',
    checks: [
      {item: '지역', verdict: '충족', why: '해솔군 포함'},
      {item: '처리업 허가', verdict: '충족', why: '중간재활용업(지정 외)'},
      {item: '수집·운반업 허가', verdict: '충족', why: '보유'},
      {item: '장비', verdict: '충족', why: '조건 없음 (인양 선박은 발주처 제공)'},
    ],
    summary: [
      {k: '금액', v: '기초금액 3,190만 원(부가세 포함)', src: '공고서'},
      {k: '톤당 단가', v: '약 37.5만 원 = 3,190만 ÷ 85톤', src: '공고서·과업지시서'},
      {k: '계량', v: '발주처 지정 공인계량소(○○읍, 편도 약 40km)', src: '과업지시서'},
      {k: '과업 기간', v: '착수일부터 45일', src: '공고서'},
      {k: '위치', v: '○○항 항내 (육지 접안)', src: '과업지시서'},
    ],
    specials: ['인양은 발주처 선박, 업체는 육상 운반·처리', '계량소 지정 — 운반 거리 고려'],
    papers: ['착수계·현장대리인 선임계'],
    attachments: [
      {kind: '공고서', name: '공고문.pdf'},
      {kind: '과업지시서', name: '과업지시서.hwpx'},
    ],
    changes: [],
    agencyNote: {past: 9, avgBidders: '2.8곳', topWinner: 'C업체 (3회)', rebid: '표본 부족'},
  },
  {
    id: 'n4',
    title: '○○도서관 리모델링 건설폐기물 처리 용역',
    agency: '전남 청솔군',
    method: '소액수의견적 · 지역제한(청솔군)',
    posted: '11.29 (일) 11:20',
    base: 33_502_000,
    qty: '건설폐기물 300.457톤',
    perTon: 111_503,
    perTonLevel: null,
    deadline: '12.05 (토) 10:00',
    dday: 4,
    opening: '12.05 (토) 11:00',
    verdict: '미충족',
    oneLine: '건설폐기물 운반·처리. 청솔군 소재 + 건설폐기물 처리업 허가 필요 — 참가 불가.',
    checks: [
      {item: '소재지(청솔군)', verdict: '미충족', why: '본점 소재지 다름'},
      {item: '건설폐기물 중간처리업', verdict: '미충족', why: '해당 허가 없음'},
    ],
    summary: [
      {k: '금액', v: '기초금액 3,350만 원(부가세 포함)', src: '공고서'},
      {k: '톤당 단가', v: '약 11.2만 원 = 3,350만 ÷ 300.457톤 (운반 포함)', src: '공고서·내역서'},
    ],
    specials: [],
    papers: [],
    attachments: [{kind: '공고서', name: '공고문.hwpx'}],
    changes: [],
    agencyNote: {past: 6, avgBidders: '4.0곳', topWinner: '-', rebid: '표본 부족'},
  },
];

export type Alert = {
  id: string;
  channel: '#새공고' | '#개찰결과' | '#리포트';
  at: string;
  kind: '새 공고' | '정정' | '취소' | '개찰 결과' | '기초금액 발표' | '아침 요약' | '경쟁 업체 낙찰' | '마감 겹침';
  phase2?: boolean;
  title: string;
  lines: string[];
  noticeId?: string;
};

export const ALERTS: Alert[] = [
  {
    id: 'a0',
    channel: '#새공고',
    at: '오늘 08:00',
    kind: '아침 요약',
    title: '오늘 맞춤 공고 6건',
    lines: ['✅ 바로 가능 2건 — 폐어구 집중수거(바람시, D-7) · 침적쓰레기(남빛군, D-2)', '⚠️ 확인 필요 1건 — ○○읍 해양쓰레기(해솔군): 처리 품목 확인', '⛔ 제외 3건 — 소재지 제한 2건(청솔군·○○시), 건설폐기물 허가 필요 1건', '📅 오늘 마감 없음 · 내일 참가등록 마감 1건'],
  },
  {
    id: 'a5',
    channel: '#새공고',
    at: '오늘 11:20',
    kind: '기초금액 발표',
    title: '○○항 침적쓰레기 수거 처리 용역',
    lines: ['기초금액 3,190만 원 발표 · 예가 범위 ±3% · 하한율 88%', '투찰 마감 12/03 10:00 (D-2)', '→ 계산기 바로 열기'],
    noticeId: 'n3',
  },
  {
    id: 'a1',
    channel: '#새공고',
    at: '오늘 14:34',
    kind: '새 공고',
    title: '2027년 해양쓰레기 정화사업 ○○읍 폐기물처리 용역',
    lines: [
      '해솔군 · 기초금액 4,832만 원 · 마감 D-3 (12/04 12:00)',
      '톤당 단가 약 43.9만 원 · 계량: 관내 공인계량소, 업체 부담',
      '기간 30일 · 위치 ○○읍 항포구 (섬 지역 — 해상 운송 확인)',
      '자격 ✅ 지역 · ✅ 허가 · ⚠️ 처리 품목(폐어망·폐목재 혼합) 확인',
    ],
    noticeId: 'n1',
  },
  {
    id: 'a2',
    channel: '#새공고',
    at: '오늘 09:41',
    kind: '정정',
    title: '해안가 폐어구 집중수거 처리 용역',
    lines: ['개찰일시 12/07 11:00 → 12/08 11:00', '나머지 조건 변경 없음'],
    noticeId: 'n2',
  },
  {
    id: 'a3',
    channel: '#개찰결과',
    at: '어제 11:02',
    kind: '개찰 결과',
    title: '○○리 해안 정화 폐기물처리 용역',
    lines: ['내 순위 2위 / 참가 4곳', '1순위와 차이 0.12% (약 5.1만 원)', '하한 미달 아님 · 1순위: A업체'],
  },
  {
    id: 'a4',
    channel: '#새공고',
    at: '어제 16:20',
    kind: '취소',
    title: '○○천 하구 부유쓰레기 처리 용역',
    lines: ['발주처 사정으로 공고 취소'],
  },
  {
    id: 'a6',
    channel: '#새공고',
    at: '어제 17:05',
    kind: '마감 겹침',
    title: '12/03 (목) 마감 2건 겹침',
    lines: ['10:00 침적쓰레기(남빛군) · 12:00 연안 정화(모래군)', '서류 준비 일정 확인'],
    phase2: true,
  },
  {
    id: 'a7',
    channel: '#개찰결과',
    at: '그저께 11:10',
    kind: '경쟁 업체 낙찰',
    title: '관심 업체 B업체가 해솔군 공고 1순위',
    lines: ['연안 부유쓰레기 처리 용역 · 참가 5곳 · B업체 해솔군 첫 1순위', '해솔군 판 변화로 월간 리포트에 반영'],
    phase2: true,
  },
];

export type MyBid = {
  id: string;
  date: string;
  title: string;
  agency: string;
  bidders: number;
  rank: string;
  gap: string;
  result: '1순위' | '탈락' | '하한 미달';
  memo: string;
};

export const MY_BIDS: MyBid[] = [
  {id: 'b1', date: '11.30', title: '○○리 해안 정화 폐기물처리 용역', agency: '해솔군', bidders: 4, rank: '2위', gap: '+0.12%', result: '탈락', memo: '참여 — 단가 괜찮음'},
  {id: 'b2', date: '11.24', title: '○○읍 해양쓰레기 처리 용역(4차)', agency: '해솔군', bidders: 3, rank: '1위', gap: '-', result: '1순위', memo: ''},
  {id: 'b3', date: '11.19', title: '연안 폐어구 수거 처리 용역', agency: '남빛군', bidders: 5, rank: '-', gap: '-0.31%', result: '하한 미달', memo: '예정가격이 높게 나옴'},
  {id: 'b4', date: '11.12', title: '○○도 부유쓰레기 처리 용역', agency: '해솔군', bidders: 4, rank: '3위', gap: '+0.40%', result: '탈락', memo: ''},
  {id: 'b5', date: '11.05', title: '해안 정화사업 폐기물 처리 용역', agency: '바람시', bidders: 14, rank: '6위', gap: '+0.88%', result: '탈락', memo: '경쟁 많음'},
  {id: 'b6', date: '10.28', title: '○○항 정화 폐기물처리 용역', agency: '해솔군', bidders: 3, rank: '1위', gap: '-', result: '1순위', memo: ''},
];

export const AGENCIES = [
  {id: 'g1', name: '해솔군', notices: 41, bidders: '3.4곳', top: 'A업체 14 · 우리 11 · C업체 7', rebid: '92%', mine: '1순위 11회'},
  {id: 'g2', name: '바람시', notices: 18, bidders: '11.2곳', top: 'B업체 4 · D업체 3', rebid: '71%', mine: '1순위 1회'},
  {id: 'g3', name: '남빛군', notices: 9, bidders: '2.8곳', top: 'C업체 3 · 우리 2', rebid: '표본 부족', mine: '1순위 2회'},
  {id: 'g4', name: '모래군', notices: 12, bidders: '8.5곳', top: 'E업체 3', rebid: '83%', mine: '참여 없음'},
];

export const RIVALS = [
  {id: 'r1', name: 'A업체', met: 38, regions: '해솔군·남빛군', wins: 16, trend: '2024년부터 관내 참여 늘어남'},
  {id: 'r2', name: 'C업체', met: 22, regions: '남빛군·해솔군', wins: 10, trend: '변화 없음'},
  {id: 'r3', name: 'B업체', met: 9, regions: '바람시·모래군', wins: 4, trend: '올해 처음 해솔군 참여'},
];

// 비슷한 공고 톤당 단가(만 원) — 2차 기능 예시
export const PER_TON = [
  {name: '해솔 9월', v: 41.2},
  {name: '해솔 10월', v: 44.0},
  {name: '남빛 10월', v: 36.8},
  {name: '바람 11월', v: 55.0},
  {name: '해솔 11월', v: 43.9},
  {name: '남빛 11월', v: 37.5},
];

export const won = (n: number) =>
  n >= 100_000_000
    ? `${Math.floor(n / 100_000_000)}억 ${Math.round((n % 100_000_000) / 10_000).toLocaleString()}만 원`
    : `${Math.round(n / 10_000).toLocaleString()}만 원`;

// ---- 기능 매트릭스 반영(PRD v1.1) 추가 예시 데이터 ----

export type SearchRow = {id: string; title: string; agency: string; method: string; base: number; deadline: string; verdict: Verdict | '-'};
export const SEARCH_ROWS: SearchRow[] = [
  {id: 's1', title: '2027년 해양쓰레기 정화사업 ○○읍 폐기물처리 용역', agency: '해솔군', method: '소액수의견적', base: 48_320_000, deadline: '12.04', verdict: '확인 필요'},
  {id: 's2', title: '해안가 폐어구 집중수거 처리 용역', agency: '바람시', method: '일반경쟁', base: 126_500_000, deadline: '12.08', verdict: '충족'},
  {id: 's3', title: '○○항 침적쓰레기 수거 처리 용역', agency: '남빛군', method: '소액수의견적', base: 31_900_000, deadline: '12.03', verdict: '충족'},
  {id: 's4', title: '공원 임목폐기물 처리 용역', agency: '모래군', method: '일반경쟁', base: 22_000_000, deadline: '12.07', verdict: '충족'},
  {id: 's5', title: '석면해체 지정폐기물 처리 용역', agency: '○○교육지원청', method: '수의계약', base: 18_400_000, deadline: '12.06', verdict: '미충족'},
];

export type PreSpec = {id: string; stage: '발주계획' | '사전규격' | '본공고'; title: string; agency: string; when: string; note: string};
export const PRESPECS: PreSpec[] = [
  {id: 'p1', stage: '사전규격', title: '2027년 연안 해양쓰레기 수거 처리 용역', agency: '해솔군', when: '의견마감 12.05', note: '본공고 예상 12월 중순 · 작년 1순위 A업체'},
  {id: 'p2', stage: '발주계획', title: '2027년 폐어구 회수 처리 용역', agency: '바람시', when: '발주 예정 2027.02', note: '예산 1억 8천만 원 · 관심 발주처'},
  {id: 'p3', stage: '본공고', title: '○○항 침적쓰레기 수거 처리 용역', agency: '남빛군', when: '12.03 마감', note: '사전규격(11.20) → 본공고(11.29) 연결됨'},
];

export type Sched = {id: string; date: string; kind: '참가등록 마감' | '공동수급협정 마감' | '현장설명' | '투찰 마감' | '개찰'; title: string};
export const SCHEDULE: Sched[] = [
  {id: 'c1', date: '12.02 (수) 18:00', kind: '참가등록 마감', title: '○○읍 해양쓰레기 폐기물처리 용역'},
  {id: 'c2', date: '12.03 (목) 10:00', kind: '투찰 마감', title: '○○항 침적쓰레기 수거 처리 용역'},
  {id: 'c3', date: '12.03 (목) 11:00', kind: '개찰', title: '○○항 침적쓰레기 수거 처리 용역'},
  {id: 'c4', date: '12.04 (금) 12:00', kind: '투찰 마감', title: '○○읍 해양쓰레기 폐기물처리 용역'},
  {id: 'c5', date: '12.07 (월) 14:00', kind: '현장설명', title: '해안가 폐어구 집중수거 처리 용역'},
  {id: 'c6', date: '12.08 (화) 10:00', kind: '투찰 마감', title: '해안가 폐어구 집중수거 처리 용역'},
];

export const BOARD: {col: string; items: string[]}[] = [
  {col: '검토 중', items: ['해안가 폐어구 집중수거 처리 용역', '공원 임목폐기물 처리 용역']},
  {col: '참가 신청', items: ['○○읍 해양쓰레기 폐기물처리 용역']},
  {col: '투찰 완료', items: ['○○항 침적쓰레기 수거 처리 용역']},
  {col: '결과', items: ['○○리 해안 정화 폐기물처리 용역 · 2위', '○○읍 해양쓰레기 처리 용역(4차) · 1순위']},
];

export type Award = {id: string; date: string; title: string; agency: string; bidders: number; winner: string; rate: string; amount: number};
export const AWARDS: Award[] = [
  {id: 'w1', date: '12.01', title: '○○리 해안 정화 폐기물처리 용역', agency: '해솔군', bidders: 4, winner: 'A업체', rate: '87.912%', amount: 41_830_000},
  {id: 'w2', date: '11.30', title: '연안 부유쓰레기 처리 용역', agency: '바람시', bidders: 13, winner: 'B업체', rate: '87.806%', amount: 92_100_000},
  {id: 'w3', date: '11.28', title: '어항 정화 폐기물처리 용역', agency: '남빛군', bidders: 3, winner: 'C업체', rate: '88.104%', amount: 27_450_000},
  {id: 'w4', date: '11.27', title: '해양쓰레기 운반 처리 용역(3차)', agency: '해솔군', bidders: 4, winner: '우리 회사', rate: '87.955%', amount: 38_200_000},
];

export const MONTHLY_TOP = [
  {id: 't1', rank: 1, name: 'A업체', wins: 6, region: '해솔군·남빛군'},
  {id: 't2', rank: 2, name: '우리 회사', wins: 4, region: '해솔군'},
  {id: 't3', rank: 3, name: 'B업체', wins: 3, region: '바람시'},
  {id: 't4', rank: 4, name: 'C업체', wins: 3, region: '남빛군'},
];

// 발주처 사정률 분포(보여주기만 — 추천 아님)
export const SAJEONG = [
  {bin: '98.5', n: 2},
  {bin: '99.0', n: 6},
  {bin: '99.5', n: 11},
  {bin: '100.0', n: 13},
  {bin: '100.5', n: 7},
  {bin: '101.0', n: 2},
];

export const DOCS = [
  {id: 'd1', name: '폐기물 중간재활용업 허가증', until: '2027.03.31', left: '124일'},
  {id: 'd2', name: '신용평가 등급확인서', until: '2026.12.20', left: '19일'},
  {id: 'd3', name: '영업배상 책임보험', until: '2027.06.30', left: '211일'},
  {id: 'd4', name: '공동인증서(사업자용)', until: '2026.12.10', left: '9일'},
];

export const LOWER_RATES = [
  {id: 'l1', org: '지자체 용역(일반)', range: '추정가격 2억 원 미만', rate: '88%'},
  {id: 'l2', org: '지자체 용역(일반)', range: '2억 원 이상 ~ 고시금액 미만', rate: '87.745%'},
  {id: 'l3', org: '조달청 일반용역', range: '고시금액 미만', rate: '87.745%'},
  {id: 'l4', org: '소액수의견적', range: '2인 이상 견적', rate: '88%'},
];
