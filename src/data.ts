// 데모용 예시 데이터. 실제 서비스에서는 나라장터 개찰 결과로 계산한다.

export type Notice = {
  id: string;
  title: string;
  agency: string;
  kind: '용역' | '공사' | '물품';
  region: string;
  base: number; // 기초금액(원)
  deadline: string;
  opening: string;
  expected: string; // 예상 참여 업체 수
  lowerRate: number; // 낙찰하한율(%)
  bestRate: number; // 추천 투찰률(%)
  bestProb: number; // 1순위 확률(%)
  status: '추천 준비됨' | '데이터 부족' | '마감 임박';
};

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '2027년 해양쓰레기 정화사업(수거·운반) 용역',
    agency: '경상남도 통영시',
    kind: '용역',
    region: '경남',
    base: 412_500_000,
    deadline: '11.27 (금) 10:00',
    opening: '11.27 (금) 11:00',
    expected: '6~9곳',
    lowerRate: 87.745,
    bestRate: 87.912,
    bestProb: 14.8,
    status: '추천 준비됨',
  },
  {
    id: 'n2',
    title: '해안가 폐어구 집중수거 용역',
    agency: '경상남도 남해군',
    kind: '용역',
    region: '경남',
    base: 54_800_000,
    deadline: '11.25 (수) 10:00',
    opening: '11.25 (수) 11:00',
    expected: '2~4곳',
    lowerRate: 87.745,
    bestRate: 88.106,
    bestProb: 31.2,
    status: '마감 임박',
  },
  {
    id: 'n3',
    title: '하천·하구 쓰레기 차단막 유지관리 용역',
    agency: '경상남도 거제시',
    kind: '용역',
    region: '경남',
    base: 87_300_000,
    deadline: '11.30 (월) 10:00',
    opening: '11.30 (월) 11:00',
    expected: '3~5곳',
    lowerRate: 87.745,
    bestRate: 87.861,
    bestProb: 22.6,
    status: '추천 준비됨',
  },
  {
    id: 'n4',
    title: '연안 침적쓰레기 수거사업',
    agency: '해양환경공단',
    kind: '용역',
    region: '전국',
    base: 268_000_000,
    deadline: '12.02 (수) 14:00',
    opening: '12.02 (수) 15:00',
    expected: '10~15곳',
    lowerRate: 87.745,
    bestRate: 88.274,
    bestProb: 8.9,
    status: '추천 준비됨',
  },
  {
    id: 'n5',
    title: '어촌어항 해양환경 개선 용역',
    agency: '경상남도 고성군',
    kind: '용역',
    region: '경남',
    base: 156_000_000,
    deadline: '12.04 (금) 10:00',
    opening: '12.04 (금) 11:00',
    expected: '4~7곳',
    lowerRate: 87.745,
    bestRate: 87.958,
    bestProb: 17.3,
    status: '추천 준비됨',
  },
  {
    id: 'n6',
    title: '항만 부유쓰레기 수거선 운영 위탁',
    agency: '부산항만공사',
    kind: '용역',
    region: '부산',
    base: 1_240_000_000,
    deadline: '12.08 (화) 10:00',
    opening: '12.08 (화) 11:00',
    expected: '15곳 이상',
    lowerRate: 87.745,
    bestRate: 0,
    bestProb: 0,
    status: '데이터 부족',
  },
];

// 투찰률 격자(기초금액 대비 %)
const gauss = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));

// 경쟁 업체가 몰리는 지점(습관 포인트)
const CLUSTERS: [number, number, number][] = [
  [87.8, 0.03, 1.0],
  [88.0, 0.025, 1.4],
  [88.05, 0.04, 0.8],
  [88.45, 0.05, 0.6],
  [87.76, 0.015, 0.7],
];

export type CurvePoint = {rate: number; label: string; prob: number; crowd: number};
export type Candidate = {rate: number; prob: number};

export function curveFor(n: Notice): CurvePoint[] {
  const shift = n.bestRate ? n.bestRate - 87.912 : 0;
  const raw = [];
  for (let i = 0; i <= 80; i++) {
    const r = 87.7 + i * 0.01;
    const crowd = Math.min(1, CLUSTERS.reduce((a, [m, s, w]) => a + w * gauss(r, m + shift, s), 0));
    // 하한선 아래는 탈락, 높을수록 더 낮게 쓴 업체에 밀림 → 완만히 감소, 경쟁 밀집 구간은 깎인다
    const base = r < n.lowerRate ? 0 : gauss(r, 87.93 + shift, 0.22);
    raw.push({r, crowd, v: base * (1 - 0.85 * crowd)});
  }
  const peak = Math.max(...raw.map(x => x.v)) || 1;
  const scale = (n.bestProb || 10) / peak;
  return raw.map(x => ({
    rate: +x.r.toFixed(3),
    label: x.r.toFixed(2),
    prob: +(x.v * scale).toFixed(2),
    crowd: +(x.crowd * (n.bestProb || 10) * 0.6).toFixed(2),
  }));
}

/** 곡선의 봉우리들 중 확률 높은 순 3개 */
export function candidatesFor(n: Notice): Candidate[] {
  const c = curveFor(n);
  const peaks: Candidate[] = [];
  for (let i = 1; i < c.length - 1; i++) {
    if (c[i].prob > 0 && c[i].rate >= n.lowerRate + 0.05 && c[i].prob >= c[i - 1].prob && c[i].prob >= c[i + 1].prob) {
      peaks.push({rate: c[i].rate, prob: c[i].prob});
    }
  }
  peaks.sort((a, b) => b.prob - a.prob);
  const out = peaks.slice(0, 3);
  // 봉우리가 부족하면 최고점 주변으로 채운다
  while (out.length < 3 && out.length > 0) {
    const near = c.filter(p => p.rate >= n.lowerRate + 0.05 && out.every(o => Math.abs(p.rate - o.rate) >= 0.03)).sort((a, b) => b.prob - a.prob)[0];
    out.push({rate: near.rate, prob: near.prob});
  }
  return out;
}

export function probAt(n: Notice, rate: number): number {
  const c = curveFor(n);
  return c.reduce((best, p) => (Math.abs(p.rate - rate) < Math.abs(best.rate - rate) ? p : best), c[0]).prob;
}

// 이 발주처 사정률(예정가격/기초금액) 분포
export const SAJEONG = [
  {bin: '98.0', n: 2},
  {bin: '98.5', n: 5},
  {bin: '99.0', n: 11},
  {bin: '99.5', n: 19},
  {bin: '100.0', n: 24},
  {bin: '100.5', n: 18},
  {bin: '101.0', n: 10},
  {bin: '101.5', n: 4},
  {bin: '102.0', n: 1},
];

export type Competitor = {id: string; name: string; seen: number; habit: string; spread: string; note: string};

export const COMPETITORS: Competitor[] = [
  {id: 'c1', name: '(주)남해○○환경', seen: 23, habit: '88.000%', spread: '±0.004', note: '거의 항상 같은 값'},
  {id: 'c2', name: '○○해양개발', seen: 17, habit: '87.800%', spread: '±0.020', note: '하한선 바로 위'},
  {id: 'c3', name: '△△마린', seen: 14, habit: '88.050%', spread: '±0.031', note: '최근 3회 상승'},
  {id: 'c4', name: '□□환경산업', seen: 9, habit: '88.450%', spread: '±0.060', note: '소규모 공고만 참여'},
];

export type Past = {id: string; title: string; date: string; n: number; sajeong: string; winRate: string; winner: string};

export const SIMILAR: Past[] = [
  {id: 'p1', title: '2026년 해양쓰레기 정화사업', date: '2026.03.12', n: 8, sajeong: '100.21%', winRate: '87.931%', winner: '(주)○○바다'},
  {id: 'p2', title: '해안 쓰레기 수거·처리 용역(상반기)', date: '2026.02.04', n: 7, sajeong: '99.64%', winRate: '87.889%', winner: '△△마린'},
  {id: 'p3', title: '2025년 해양쓰레기 정화사업', date: '2025.03.18', n: 9, sajeong: '100.87%', winRate: '87.962%', winner: '◇◇환경'},
  {id: 'p4', title: '도서지역 해양쓰레기 운반 용역', date: '2025.08.27', n: 5, sajeong: '99.12%', winRate: '88.117%', winner: '(주)남해○○환경'},
  {id: 'p5', title: '연안 정화활동 위탁 용역', date: '2025.11.05', n: 6, sajeong: '100.45%', winRate: '87.903%', winner: '○○해양개발'},
];

export type MyBid = {id: string; date: string; title: string; mine: string; rec: string; result: string; ifRec: string};

export const MY_BIDS: MyBid[] = [
  {id: 'm1', date: '11.18', title: '해양쓰레기 운반·처리 용역', mine: '88.000%', rec: '87.934%', result: '4위', ifRec: '1순위'},
  {id: 'm2', date: '11.12', title: '연안 정화 기간제 용역', mine: '88.000%', rec: '88.211%', result: '7위', ifRec: '3위'},
  {id: 'm3', date: '11.05', title: '폐어구 수거 지원사업', mine: '87.950%', rec: '87.902%', result: '1순위 (낙찰)', ifRec: '1순위'},
  {id: 'm4', date: '10.29', title: '해안가 쓰레기 집하장 운영', mine: '88.000%', rec: '88.106%', result: '5위', ifRec: '2위'},
  {id: 'm5', date: '10.21', title: '하구 차단막 설치·관리', mine: '88.050%', rec: '87.877%', result: '6위', ifRec: '1순위'},
  {id: 'm6', date: '10.14', title: '해양환경 정화선 위탁', mine: '88.000%', rec: '88.164%', result: '유찰', ifRec: '-'},
];

export const won = (v: number) => `${Math.round(v).toLocaleString('ko-KR')}원`;
