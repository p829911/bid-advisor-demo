import {useState} from 'react';
import {Layout, LayoutContent, LayoutPanel} from '@astryxdesign/core/Layout';
import {HStack, VStack, StackItem} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Grid} from '@astryxdesign/core/Grid';
import {List, ListItem} from '@astryxdesign/core/List';
import {Table} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';
import {Switch} from '@astryxdesign/core/Switch';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Token} from '@astryxdesign/core/Token';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {useToast} from '@astryxdesign/core/Toast';
import {Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {
  ArrowLeftIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import {
  AGENCIES,
  ALERTS,
  MY_BIDS,
  NOTICES,
  PER_TON,
  RIVALS,
  won,
  type Alert,
  type Check,
  type MyBid,
  type Notice,
  type SummaryRow,
  type Verdict,
} from './data';

type Page = 'notices' | 'detail' | 'alerts' | 'history' | 'analysis' | 'settings';

const C = {
  blue: 'var(--color-data-categorical-blue)',
  orange: 'var(--color-data-categorical-orange)',
  grid: 'var(--color-border)',
  tick: 'var(--color-text-secondary)',
};
const tick = {fontSize: 'var(--font-size-sm)', fill: C.tick};

// ---------------------------------------------------------------------------
// 공용
// ---------------------------------------------------------------------------

function verdictBadge(v: Verdict) {
  if (v === '충족') return <Badge variant="success" label="자격 충족" />;
  if (v === '미충족') return <Badge variant="error" label="자격 미충족" />;
  return <Badge variant="warning" label="확인 필요" />;
}

function checkBadge(v: Verdict) {
  if (v === '충족') return <Badge variant="success" label="충족" />;
  if (v === '미충족') return <Badge variant="error" label="미충족" />;
  return <Badge variant="warning" label="확인 필요" />;
}

function levelBadge(l: Notice['perTonLevel']) {
  if (!l) return null;
  const variant = l === '높음' ? 'success' : l === '낮음' ? 'warning' : 'neutral';
  return <Badge variant={variant} label={`단가 ${l}`} />;
}

function Metric({label, value, hint}: {label: string; value: string; hint?: string}) {
  return (
    <Card>
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
        <Text type="display-3" weight="semibold">
          {value}
        </Text>
        {hint && (
          <Text type="supporting" color="secondary">
            {hint}
          </Text>
        )}
      </VStack>
    </Card>
  );
}

function PageTitle({title, desc, tag}: {title: string; desc: string; tag?: string}) {
  return (
    <VStack gap={1}>
      <HStack gap={2} vAlign="center">
        <Heading level={2}>{title}</Heading>
        {tag && <Badge variant="purple" label={tag} />}
      </HStack>
      <Text type="body" color="secondary">
        {desc}
      </Text>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 맞춤 공고
// ---------------------------------------------------------------------------

function NoticesPage({open}: {open: (id: string) => void}) {
  const isMobile = useMediaQuery('(max-width: 768px)', true);
  const [filter, setFilter] = useState<'all' | Verdict>('all');
  const rows = NOTICES.filter(n => filter === 'all' || n.verdict === filter);

  const columns: TableColumn<Notice>[] = [
    {
      key: 'title',
      header: '공고',
      width: {type: 'proportional', value: 3, minWidth: 280},
      renderCell: n => (
        <VStack gap={1}>
          <Text type="body" weight="semibold">
            {n.title}
          </Text>
          <HStack gap={2} vAlign="center" wrap="wrap">
            {n.isNew && <Badge variant="blue" label="새 공고" />}
            <Text type="supporting" color="secondary">
              {n.agency} · {n.qty}
            </Text>
          </HStack>
        </VStack>
      ),
    },
    {key: 'base', header: '기초금액', renderCell: n => <Text type="body">{won(n.base)}</Text>},
    {
      key: 'perTon',
      header: '톤당 단가',
      renderCell: n => (
        <VStack gap={1}>
          <Text type="body">{n.perTon ? `${(n.perTon / 10_000).toFixed(1)}만 원` : '-'}</Text>
          {levelBadge(n.perTonLevel)}
        </VStack>
      ),
    },
    {
      key: 'deadline',
      header: '마감',
      renderCell: n => (
        <VStack gap={1}>
          <Text type="body" weight="semibold">
            D-{n.dday}
          </Text>
          <Text type="supporting" color="secondary">
            {n.deadline}
          </Text>
        </VStack>
      ),
    },
    {key: 'verdict', header: '자격', renderCell: n => verdictBadge(n.verdict)},
    {key: 'id', header: '', renderCell: n => <Button label="요약 보기" size="sm" variant="secondary" onClick={() => open(n.id)} />},
  ];

  return (
    <VStack gap={6}>
      <PageTitle title="맞춤 공고" desc="등록한 업종·지역 조건에 맞는 진행 중 공고. 첨부파일 요약과 자격 판정이 끝난 상태로 보여줘요." />
      <Grid columns={{minWidth: 150, max: 4, repeat: 'fit'}} gap={4}>
        <Metric label="진행 중 맞춤 공고" value={`${NOTICES.length}건`} hint="오늘 새로 2건" />
        <Metric label="자격 충족" value="2건" hint="확인 필요 1 · 미충족 1" />
        <Metric label="이번 주 마감" value="3건" hint="가장 빠른 마감 D-2" />
        <Metric label="첨부 요약 완료" value="4/4" hint="공고 올라온 뒤 평균 3분" />
      </Grid>
      <SegmentedControl label="자격 필터" value={filter} onChange={v => setFilter(v as 'all' | Verdict)}>
        <SegmentedControlItem value="all" label="전체" />
        <SegmentedControlItem value="충족" label="충족" />
        <SegmentedControlItem value="확인 필요" label="확인 필요" />
        <SegmentedControlItem value="미충족" label="미충족" />
      </SegmentedControl>
      {isMobile ? (
        <List>
          {rows.map(n => (
            <ListItem
              key={n.id}
              label={n.title}
              description={
                <Text type="supporting" color="secondary">
                  {n.agency} · {won(n.base)} · D-{n.dday}
                </Text>
              }
              endContent={verdictBadge(n.verdict)}
              onClick={() => open(n.id)}
            />
          ))}
        </List>
      ) : (
        <Card>
          <Table<Notice> data={rows} columns={columns} idKey="id" density="balanced" hasHover verticalAlign="middle" />
        </Card>
      )}
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 공고 상세
// ---------------------------------------------------------------------------

function DetailPage({notice, back}: {notice: Notice; back: () => void}) {
  const showToast = useToast();
  const [decision, setDecision] = useState('검토 중');
  const [memo, setMemo] = useState('');

  const checkCols: TableColumn<Check>[] = [
    {key: 'item', header: '항목'},
    {key: 'verdict', header: '판정', renderCell: c => checkBadge(c.verdict)},
    {key: 'why', header: '근거'},
  ];
  const sumCols: TableColumn<SummaryRow>[] = [
    {key: 'k', header: '항목', renderCell: r => <Text type="body" weight="semibold">{r.k}</Text>},
    {key: 'v', header: '내용'},
    {key: 'src', header: '근거', renderCell: r => <Token label={r.src} color="gray" />},
  ];

  return (
    <VStack gap={6}>
      <HStack gap={2} vAlign="center">
        <Button label="맞춤 공고" variant="ghost" size="sm" icon={<Icon icon={ArrowLeftIcon} />} onClick={back} />
      </HStack>
      <VStack gap={2}>
        <HStack gap={2} vAlign="center" wrap="wrap">
          {verdictBadge(notice.verdict)}
          {levelBadge(notice.perTonLevel)}
          <Text type="supporting" color="secondary">
            {notice.agency} · {notice.method} · 게시 {notice.posted}
          </Text>
        </HStack>
        <Heading level={2}>{notice.title}</Heading>
        <Text type="body" color="secondary">
          {notice.oneLine}
        </Text>
      </VStack>

      <Grid columns={{minWidth: 150, max: 4, repeat: 'fit'}} gap={4}>
        <Metric label="기초금액" value={won(notice.base)} />
        <Metric label="톤당 단가" value={notice.perTon ? `${(notice.perTon / 10_000).toFixed(1)}만 원` : '-'} hint={notice.qty} />
        <Metric label="투찰 마감" value={`D-${notice.dday}`} hint={notice.deadline} />
        <Metric label="개찰" value={notice.opening.split(' ')[0]} hint={notice.opening} />
      </Grid>

      {notice.changes.length > 0 && (
        <Banner
          status="info"
          title="정정 공고가 있어요"
          description={notice.changes.map(c => `${c.at} ${c.item}: ${c.before} → ${c.after}`).join(' / ')}
        />
      )}

      <Card>
        <VStack gap={3}>
          <VStack gap={1}>
            <Heading level={4}>자격 자동 대조</Heading>
            <Text type="supporting" color="secondary">
              공고의 참가가능지역·면허 제한과 첨부 조건을 우리 회사 정보(설정)와 비교했어요.
            </Text>
          </VStack>
          <Table<Check> data={notice.checks} columns={checkCols} idKey="item" density="compact" />
        </VStack>
      </Card>

      <Card>
        <VStack gap={3}>
          <VStack gap={1}>
            <HStack gap={2} vAlign="center">
              <Heading level={4}>첨부파일 AI 요약</Heading>
              <Badge variant="neutral" label="Claude Sonnet" />
            </HStack>
            <Text type="supporting" color="secondary">
              공고서·과업지시서·설계서에서 뽑았어요. 문서에 없는 건 &quot;문서에 없음&quot;으로 표시해요. 투찰 전 원문을 꼭 확인해 주세요.
            </Text>
          </VStack>
          <Table<SummaryRow> data={notice.summary} columns={sumCols} idKey="k" density="compact" verticalAlign="top" />
        </VStack>
      </Card>

      <Grid columns={{minWidth: 300, max: 2, repeat: 'fit'}} gap={4}>
        <Card>
          <VStack gap={3}>
            <Heading level={4}>특수사항</Heading>
            {notice.specials.length ? (
              <List density="compact" listStyle="disc">
                {notice.specials.map(s => (
                  <ListItem key={s} label={s} />
                ))}
              </List>
            ) : (
              <Text type="supporting" color="secondary">
                없음
              </Text>
            )}
            <Divider />
            <Heading level={4}>놓치기 쉬운 서류·마감</Heading>
            {notice.papers.length ? (
              <List density="compact" listStyle="disc">
                {notice.papers.map(s => (
                  <ListItem key={s} label={s} />
                ))}
              </List>
            ) : (
              <Text type="supporting" color="secondary">
                없음
              </Text>
            )}
          </VStack>
        </Card>
        <Card>
          <VStack gap={3}>
            <Heading level={4}>첨부파일</Heading>
            <List density="compact">
              {notice.attachments.map(a => (
                <ListItem
                  key={a.name}
                  label={a.name}
                  description={a.kind}
                  startContent={<Icon icon={PaperClipIcon} size="sm" />}
                  onClick={() => showToast({body: '데모: 나라장터 원문 파일을 열어요', uniqueID: 'attach'})}
                />
              ))}
            </List>
            <Button label="나라장터 원문 열기" variant="secondary" onClick={() => showToast({body: '데모: 나라장터 공고 페이지로 이동해요', uniqueID: 'g2b'})} />
          </VStack>
        </Card>
      </Grid>

      <Grid columns={{minWidth: 300, max: 2, repeat: 'fit'}} gap={4}>
        <Card>
          <VStack gap={3}>
            <HStack gap={2} vAlign="center">
              <Heading level={4}>이 발주처 한눈에</Heading>
              <Badge variant="purple" label="2차" />
            </HStack>
            <List density="compact" listStyle="disc">
              <ListItem label={`최근 3년 공고 ${notice.agencyNote.past}건 · 평균 참여 ${notice.agencyNote.avgBidders}`} />
              <ListItem label={`1순위 가장 많은 업체: ${notice.agencyNote.topWinner}`} />
              <ListItem label={notice.agencyNote.rebid} />
            </List>
          </VStack>
        </Card>
        <Card>
          <VStack gap={3}>
            <Heading level={4}>내 메모</Heading>
            <SegmentedControl label="결정" value={decision} onChange={v => setDecision(String(v))}>
              <SegmentedControlItem value="검토 중" label="검토 중" />
              <SegmentedControlItem value="참여" label="참여" />
              <SegmentedControlItem value="보류" label="보류" />
              <SegmentedControlItem value="포기" label="포기" />
            </SegmentedControl>
            <TextArea label="이유" value={memo} onChange={v => setMemo(v)} description="나중에 '왜 안 들어갔지?'를 찾을 수 있게 남겨요." />
          </VStack>
        </Card>
      </Grid>
      <Text type="supporting" color="secondary">
        가격(사정률)은 추천하지 않아요. 투찰은 나라장터에서 직접 해주세요.
      </Text>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 디스코드 알림 미리보기
// ---------------------------------------------------------------------------

function kindBadge(k: Alert['kind']) {
  if (k === '새 공고') return <Badge variant="blue" label="🆕 새 공고" />;
  if (k === '정정') return <Badge variant="warning" label="✏️ 정정" />;
  if (k === '취소') return <Badge variant="error" label="취소" />;
  return <Badge variant="success" label="📊 개찰 결과" />;
}

function AlertsPage({open}: {open: (id: string) => void}) {
  return (
    <VStack gap={6}>
      <PageTitle title="디스코드 알림" desc="전용 디스코드 서버로 바로 와요. 대표님·직원이 같이 받고, 채널별로 나눠져요. 아래는 실제로 오는 모양이에요." />
      <HStack gap={2} wrap="wrap">
        <Token label="#새공고 — 새 공고·정정·취소" color="blue" />
        <Token label="#개찰결과 — 내 순위·1순위와 차이" color="green" />
        <Token label="#리포트 — 월간 리포트" color="purple" />
      </HStack>
      <VStack gap={4}>
        {ALERTS.map(a => (
          <Card key={a.id}>
            <VStack gap={2}>
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Icon icon={ChatBubbleLeftRightIcon} size="sm" color="secondary" />
                <Text type="supporting" weight="semibold">
                  입찰 도우미
                </Text>
                <Badge variant="neutral" label="앱" />
                <Text type="supporting" color="secondary">
                  {a.channel} · {a.at}
                </Text>
              </HStack>
              <HStack gap={2} vAlign="center" wrap="wrap">
                {kindBadge(a.kind)}
                <Text type="body" weight="semibold">
                  {a.title}
                </Text>
              </HStack>
              <VStack gap={1}>
                {a.lines.map(l => (
                  <Text key={l} type="body" color="secondary">
                    {l}
                  </Text>
                ))}
              </VStack>
              {a.noticeId && (
                <HStack gap={2}>
                  <Button label="요약 전체 보기" size="sm" variant="secondary" onClick={() => open(a.noticeId!)} />
                </HStack>
              )}
            </VStack>
          </Card>
        ))}
      </VStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 나의 투찰 기록
// ---------------------------------------------------------------------------

function resultBadge(r: MyBid['result']) {
  if (r === '1순위') return <Badge variant="success" label="1순위" />;
  if (r === '하한 미달') return <Badge variant="warning" label="하한 미달" />;
  return <Badge variant="neutral" label="탈락" />;
}

function HistoryPage() {
  const showToast = useToast();
  const cols: TableColumn<MyBid>[] = [
    {key: 'date', header: '개찰'},
    {
      key: 'title',
      header: '공고',
      renderCell: b => (
        <VStack gap={1}>
          <Text type="body">{b.title}</Text>
          <Text type="supporting" color="secondary">
            {b.agency} · 참가 {b.bidders}곳
          </Text>
        </VStack>
      ),
    },
    {key: 'rank', header: '내 순위'},
    {key: 'gap', header: '1순위와 차이'},
    {key: 'result', header: '결과', renderCell: b => resultBadge(b.result)},
    {key: 'memo', header: '메모'},
  ];
  return (
    <VStack gap={6}>
      <PageTitle title="나의 투찰 기록" desc="사업자번호로 나라장터 개찰 결과를 자동으로 모아요. 10년 치 과거 기록도 처음에 한 번 채워 넣어요." />
      <Grid columns={{minWidth: 150, max: 4, repeat: 'fit'}} gap={4}>
        <Metric label="올해 투찰" value="112건" hint="작년 96건" />
        <Metric label="1순위" value="28건" hint="25.0%" />
        <Metric label="하한 미달" value="31건" hint="예정가격이 높게 나온 경우" />
        <Metric label="관내 1순위 비율" value="32.6%" hint="참가 업체끼리 똑같이 나눌 때 24.5%" />
      </Grid>
      <HStack gap={2}>
        <Button label="엑셀로 내보내기" variant="secondary" size="sm" onClick={() => showToast({body: '데모: 엑셀 파일을 내려받아요', uniqueID: 'xls'})} />
      </HStack>
      <Card>
        <Table<MyBid> data={MY_BIDS} columns={cols} idKey="id" density="balanced" hasHover verticalAlign="middle" />
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 분석 (2차)
// ---------------------------------------------------------------------------

function AnalysisPage() {
  const [tab, setTab] = useState('agency');
  return (
    <VStack gap={6}>
      <PageTitle title="분석" tag="2차" desc="쌓이는 공개 데이터로 발주처·경쟁 업체·단가를 봐요. 가격을 맞히는 게 아니라 '어디에, 누가, 얼마짜리 일로' 들어오는지 보는 화면이에요." />
      <SegmentedControl label="분석 종류" value={tab} onChange={v => setTab(String(v))}>
        <SegmentedControlItem value="agency" label="발주처" />
        <SegmentedControlItem value="rival" label="경쟁 업체" />
        <SegmentedControlItem value="price" label="톤당 단가" />
      </SegmentedControl>
      {tab === 'agency' && (
        <Card>
          <VStack gap={3}>
            <Text type="supporting" color="secondary">
              최근 3년 · 재참여율 = 1순위 업체가 그 발주처 다음 비슷한 공고에 다시 들어온 비율(높을수록 마진이 맞았다는 신호 — 검증 중)
            </Text>
            <Table
              data={AGENCIES}
              idKey="id"
              density="balanced"
              columns={[
                {key: 'name', header: '발주처'},
                {key: 'notices', header: '공고'},
                {key: 'bidders', header: '평균 참여'},
                {key: 'top', header: '1순위 많은 업체'},
                {key: 'rebid', header: '재참여율'},
                {key: 'mine', header: '우리'},
              ]}
            />
          </VStack>
        </Card>
      )}
      {tab === 'rival' && (
        <Card>
          <VStack gap={3}>
            <Text type="supporting" color="secondary">
              같은 공고에서 마주친 업체. 가격 예측이 아니라 활동 지역과 변화만 보여줘요.
            </Text>
            <Table
              data={RIVALS}
              idKey="id"
              density="balanced"
              columns={[
                {key: 'name', header: '업체'},
                {key: 'met', header: '마주친 공고'},
                {key: 'regions', header: '주 활동 발주처'},
                {key: 'wins', header: '1순위'},
                {key: 'trend', header: '최근 변화'},
              ]}
            />
          </VStack>
        </Card>
      )}
      {tab === 'price' && (
        <Card>
          <VStack gap={3}>
            <VStack gap={1}>
              <Heading level={4}>비슷한 공고 톤당 단가 (만 원)</Heading>
              <Text type="supporting" color="secondary">
                첨부 요약에서 모은 단가. 점선은 평균. 단가가 낮은 공고는 수익성을 먼저 확인하세요.
              </Text>
            </VStack>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={PER_TON} margin={{top: 8, right: 12, left: 0, bottom: 4}}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={36} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="v" fill={C.blue} radius={[4, 4, 0, 0]} name="톤당 단가(만 원)" />
                <ReferenceLine y={43.1} stroke={C.orange} strokeDasharray="4 4" label={{value: '평균 43.1', fill: C.tick, fontSize: 12}} />
              </BarChart>
            </ResponsiveContainer>
          </VStack>
        </Card>
      )}
      <Card>
        <VStack gap={2}>
          <Heading level={4}>월간 판 변화 리포트</Heading>
          <Text type="body" color="secondary">
            매달 1일 디스코드 #리포트에 자동으로 올라가요: 관내·지역 경쟁 강도, 새로 들어온 업체, 놓친 공고, 단가 흐름.
          </Text>
        </VStack>
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------

function SettingsPage() {
  const [biz, setBiz] = useState('000-00-00000');
  const [alerts, setAlerts] = useState({notice: true, change: true, result: true, deadline: false});
  return (
    <VStack gap={6}>
      <PageTitle title="설정" desc="처음 한 번 등록하면 맞는 공고·자격 판정·알림이 자동으로 와요." />
      <Card>
        <VStack gap={4}>
          <Heading level={4}>회사 정보 (자격 대조 기준)</Heading>
          <TextInput label="사업자번호" value={biz} onChange={v => setBiz(v)} description="내 투찰 기록을 개찰 결과에서 찾는 데 써요." />
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              허가 업종
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="폐기물 중간재활용업(지정 외)" color="blue" />
              <Token label="폐기물 수집·운반업(사업장 비배출계)" color="blue" />
            </HStack>
          </VStack>
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              소재지 · 장비 · 처리능력
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="본점: 전남 해솔군" color="teal" />
              <Token label="5톤 집게차 5대" color="gray" />
              <Token label="25톤 암롤 1대" color="gray" />
              <Token label="처리능력 30톤/일" color="gray" />
              <Token label="허용보관량 500톤" color="gray" />
            </HStack>
          </VStack>
        </VStack>
      </Card>
      <Card>
        <VStack gap={4}>
          <Heading level={4}>맞춤 조건</Heading>
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              조건 1 · 해양쓰레기
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="전남 · 제주" color="teal" />
              <Token label="해양쓰레기 · 폐어구 · 부유 · 침적" color="purple" />
              <Token label="용역" color="gray" />
            </HStack>
          </VStack>
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              조건 2 · 폐기물 처리
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="전남" color="teal" />
              <Token label="폐기물 · 재활용" color="purple" />
              <Token label="기초금액 1,000만 원 이상" color="gray" />
            </HStack>
          </VStack>
          <Button label="조건 추가" variant="secondary" size="sm" />
        </VStack>
      </Card>
      <Card>
        <VStack gap={4}>
          <Heading level={4}>디스코드 알림</Heading>
          <Switch label="새 공고" description="올라오는 즉시 · #새공고" value={alerts.notice} onChange={v => setAlerts({...alerts, notice: v})} />
          <Switch label="정정 · 취소" description="바뀐 항목만 · #새공고" value={alerts.change} onChange={v => setAlerts({...alerts, change: v})} />
          <Switch label="개찰 결과" description="내 순위·1순위와 차이 · #개찰결과" value={alerts.result} onChange={v => setAlerts({...alerts, result: v})} />
          <Switch label="마감 임박" description="마감 전날 저녁 (기본 꺼짐)" value={alerts.deadline} onChange={v => setAlerts({...alerts, deadline: v})} />
          <Text type="supporting" color="secondary">
            자격 미충족 공고는 알림에서 빼고 이 화면에서만 보여줘요(논의 중).
          </Text>
        </VStack>
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 앱 셸
// ---------------------------------------------------------------------------

const NAV: {key: Exclude<Page, 'detail'>; label: string; icon: typeof ChartBarIcon}[] = [
  {key: 'notices', label: '맞춤 공고', icon: DocumentMagnifyingGlassIcon},
  {key: 'alerts', label: '디스코드 알림', icon: BellAlertIcon},
  {key: 'history', label: '나의 투찰 기록', icon: ClipboardDocumentListIcon},
  {key: 'analysis', label: '분석', icon: ChartBarIcon},
  {key: 'settings', label: '설정', icon: Cog6ToothIcon},
];

export default function App() {
  const isMobile = useMediaQuery('(max-width: 768px)', true);
  const [page, setPage] = useState<Page>('notices');
  const [noticeId, setNoticeId] = useState('n1');
  const notice = NOTICES.find(n => n.id === noticeId) ?? NOTICES[0];
  const navKey = page === 'detail' ? 'notices' : page;

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({top: 0});
  };
  const open = (id: string) => {
    setNoticeId(id);
    go('detail');
  };

  const brand = (
    <HStack gap={2} vAlign="center">
      <Icon icon={DocumentMagnifyingGlassIcon} size="md" color="secondary" />
      <VStack gap={0}>
        <Text type="body" weight="bold">
          입찰 도우미
        </Text>
        <Text type="supporting" color="secondary">
          (유)○○환경
        </Text>
      </VStack>
    </HStack>
  );

  const body = (
    <VStack gap={6}>
      <Banner status="warning" title="완성 화면 예시(데모)예요" description="기관·업체 이름과 숫자는 모두 예시예요. 실제로는 나라장터 공고·개찰 결과와 첨부파일 요약으로 채워져요. PRD v1.0 기준." />
      {page === 'notices' && <NoticesPage open={open} />}
      {page === 'detail' && <DetailPage notice={notice} back={() => go('notices')} />}
      {page === 'alerts' && <AlertsPage open={open} />}
      {page === 'history' && <HistoryPage />}
      {page === 'analysis' && <AnalysisPage />}
      {page === 'settings' && <SettingsPage />}
    </VStack>
  );

  if (isMobile) {
    return (
      <Layout
        height="auto"
        content={
          <LayoutContent role="main" isScrollable={false} padding={4}>
            <VStack gap={4}>
              <HStack hAlign="between" vAlign="center">
                {brand}
                <Icon icon={BellAlertIcon} size="md" color="secondary" />
              </HStack>
              <SegmentedControl label="메뉴" value={navKey} onChange={v => go(v as Page)} layout="fill">
                {NAV.map(n => (
                  <SegmentedControlItem key={n.key} value={n.key} label={n.label.split(' ').pop() ?? n.label} />
                ))}
              </SegmentedControl>
              {body}
            </VStack>
          </LayoutContent>
        }
      />
    );
  }

  return (
    <Layout
      height="fill"
      start={
        <LayoutPanel hasDivider width={220} role="navigation">
          <VStack gap={6}>
            {brand}
            <Divider />
            <List>
              {NAV.map(n => (
                <ListItem
                  key={n.key}
                  label={n.label}
                  startContent={<Icon icon={n.icon} size="sm" />}
                  isSelected={navKey === n.key}
                  onClick={() => go(n.key)}
                />
              ))}
            </List>
            <StackItem size="fill">
              <VStack gap={1}>
                <Text type="supporting" color="secondary">
                  마지막 수집
                </Text>
                <Text type="supporting">나라장터 공고 · 12.01 14:40</Text>
              </VStack>
            </StackItem>
          </VStack>
        </LayoutPanel>
      }
      content={
        <LayoutContent role="main" padding={8}>
          {body}
        </LayoutContent>
      }
    />
  );
}
