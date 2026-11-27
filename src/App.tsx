import {useState} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav} from '@astryxdesign/core/TopNav';
import {SideNav, SideNavHeading, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Stepper, Step} from '@astryxdesign/core/Stepper';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Avatar} from '@astryxdesign/core/Avatar';
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
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  TrophyIcon,
  CalculatorIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import {
  AGENCIES,
  ALERTS,
  AWARDS,
  BOARD,
  DOCS,
  LOWER_RATES,
  MONTHLY_TOP,
  PRESPECS,
  SAJEONG,
  SCHEDULE,
  SEARCH_ROWS,
  MY_BIDS,
  NOTICES,
  PER_TON,
  RIVALS,
  won,
  type Alert,
  type Award,
  type PreSpec,
  type Sched,
  type SearchRow,
  type MyBid,
  type Notice,
  type Verdict,
} from './data';

type Page = 'home' | 'notices' | 'search' | 'detail' | 'schedule' | 'alerts' | 'history' | 'awards' | 'analysis' | 'tools' | 'settings';

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
// ---------------------------------------------------------------------------
// 홈 (오늘)
// ---------------------------------------------------------------------------

const WEEK = [
  {d: '월', n: 5},
  {d: '화', n: 8},
  {d: '수', n: 6},
  {d: '목', n: 9},
  {d: '금', n: 7},
  {d: '토', n: 1},
  {d: '오늘', n: 6},
];

function StatTile({label, value, hint, tone}: {label: string; value: string; hint: string; tone: 'blue' | 'green' | 'orange' | 'purple'}) {
  return (
    <Card variant={tone} padding={5}>
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
        <Text type="display-2" weight="semibold">
          {value}
        </Text>
        <Text type="supporting" color="secondary">
          {hint}
        </Text>
      </VStack>
    </Card>
  );
}

function HomePage({open, go}: {open: (id: string) => void; go: (p: Page) => void}) {
  const fresh = NOTICES.filter(n => n.verdict !== '미충족').slice(0, 3);
  return (
    <VStack gap={8}>
      <VStack gap={1}>
        <Text type="supporting" color="secondary">
          12월 1일 화요일 · 마지막 수집 14:40
        </Text>
        <Heading level={1}>대표님, 오늘 볼 공고는 3건이에요</Heading>
        <Text type="body" color="secondary">
          새 공고 2건은 첨부 요약과 자격 확인까지 끝났어요. 내일 참가등록 마감 1건을 먼저 챙기세요.
        </Text>
      </VStack>

      <Grid columns={{minWidth: 140, max: 4, repeat: "fit"}} gap={4}>
        <StatTile tone="blue" label="오늘 새 맞춤 공고" value="6건" hint="바로 가능 2 · 확인 1 · 제외 3" />
        <StatTile tone="green" label="자격 충족 · 진행 중" value="3건" hint="이번 주 마감 3건" />
        <StatTile tone="orange" label="가장 빠른 마감" value="D-1" hint="참가등록 12/02 18:00" />
        <StatTile tone="purple" label="이번 달 1순위" value="2건" hint="참가 9건 · 관내 2/5" />
      </Grid>

      <HStack gap={6} vAlign="start" wrap="wrap">
        <StackItem size="fill">
          <VStack gap={4}>
            <HStack hAlign="between" vAlign="center">
              <Heading level={3}>먼저 볼 공고</Heading>
              <Button label="맞춤 공고 전체" variant="ghost" size="sm" onClick={() => go('notices')} />
            </HStack>
            {fresh.map(n => (
              <NoticeCard key={n.id} n={n} open={open} />
            ))}
          </VStack>
        </StackItem>
        <VStack gap={4} width={340}>
          <Card padding={5}>
            <VStack gap={3}>
              <Heading level={4}>다가오는 일정</Heading>
              <List density="compact">
                {SCHEDULE.slice(0, 4).map(s => (
                  <ListItem
                    key={s.id}
                    label={s.title}
                    description={s.date}
                    startContent={<StatusDot variant={s.kind === '투찰 마감' ? 'error' : s.kind === '개찰' ? 'success' : 'warning'} label={s.kind} />}
                    endContent={<Badge variant={kindVariant(s.kind)} label={s.kind} />}
                  />
                ))}
              </List>
              <Button label="일정 전체" variant="secondary" size="sm" onClick={() => go('schedule')} />
            </VStack>
          </Card>
          <Card padding={5}>
            <VStack gap={3}>
              <HStack hAlign="between" vAlign="center">
                <Heading level={4}>이번 주 맞춤 공고</Heading>
                <Text type="supporting" color="secondary">
                  42건
                </Text>
              </HStack>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={WEEK} margin={{top: 4, right: 4, left: -24, bottom: 0}}>
                  <XAxis dataKey="d" tick={tick} axisLine={false} tickLine={false} />
                  <YAxis tick={tick} axisLine={false} tickLine={false} />
                  <Bar isAnimationActive={false} dataKey="n" fill={C.blue} radius={[6, 6, 0, 0]} name="공고" />
                </BarChart>
              </ResponsiveContainer>
            </VStack>
          </Card>
          <Card padding={5}>
            <VStack gap={3}>
              <Heading level={4}>최근 개찰</Heading>
              <List density="compact">
                {MY_BIDS.slice(0, 3).map(b => (
                  <ListItem key={b.id} label={b.title} description={`${b.date} · 참가 ${b.bidders}곳 · ${b.rank === '-' ? b.result : b.rank}`} endContent={resultBadge(b.result)} />
                ))}
              </List>
            </VStack>
          </Card>
        </VStack>
      </HStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 맞춤 공고
// ---------------------------------------------------------------------------

function ddayBadge(d: number) {
  return <Badge variant={d <= 2 ? 'error' : d <= 4 ? 'warning' : 'neutral'} label={`D-${d}`} />;
}

function NoticeCard({n, open}: {n: Notice; open: (id: string) => void}) {
  return (
    <ClickableCard label={n.title} onClick={() => open(n.id)} padding={5} elevation="low">
      <VStack gap={3}>
        <HStack gap={2} vAlign="center" wrap="wrap">
          {verdictBadge(n.verdict)}
          {ddayBadge(n.dday)}
          {n.isNew && <Badge variant="blue" label="새 공고" />}
          {levelBadge(n.perTonLevel)}
          {n.changes.length > 0 && <Badge variant="cyan" label="정정" />}
        </HStack>
        <VStack gap={1}>
          <Text type="body" weight="semibold">
            {n.title}
          </Text>
          <Text type="supporting" color="secondary">
            {n.agency} · {n.method}
          </Text>
        </VStack>
        <Text type="body" color="secondary">
          {n.oneLine}
        </Text>
        <MetadataList columns={4} orientation="horizontal">
          <MetadataListItem label="기초금액">{won(n.base)}</MetadataListItem>
          <MetadataListItem label="톤당 단가">{n.perTon ? `${(n.perTon / 10_000).toFixed(1)}만 원` : '-'}</MetadataListItem>
          <MetadataListItem label="과업량">{n.qty}</MetadataListItem>
          <MetadataListItem label="투찰 마감">{n.deadline}</MetadataListItem>
        </MetadataList>
      </VStack>
    </ClickableCard>
  );
}

function NoticesPage({open}: {open: (id: string) => void}) {
  const [filter, setFilter] = useState<'all' | Verdict>('all');
  const rows = NOTICES.filter(n => filter === 'all' || n.verdict === filter);
  const count = (v: Verdict) => NOTICES.filter(n => n.verdict === v).length;
  return (
    <VStack gap={6}>
      <PageTitle title="맞춤 공고" desc="등록한 조건에 맞는 진행 중 공고. 첨부파일 요약과 자격 판정이 끝난 상태로 보여줘요." />
      <TabList value={filter} onChange={v => setFilter(v as 'all' | Verdict)} hasDivider>
        <Tab value="all" label="전체" endContent={<Badge variant="neutral" label={String(NOTICES.length)} />} />
        <Tab value="충족" label="자격 충족" endContent={<Badge variant="success" label={String(count('충족'))} />} />
        <Tab value="확인 필요" label="확인 필요" endContent={<Badge variant="warning" label={String(count('확인 필요'))} />} />
        <Tab value="미충족" label="미충족" endContent={<Badge variant="error" label={String(count('미충족'))} />} />
      </TabList>
      <VStack gap={4}>
        {rows.map(n => (
          <NoticeCard key={n.id} n={n} open={open} />
        ))}
      </VStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 공고 상세
// ---------------------------------------------------------------------------

function DetailPage({notice, back}: {notice: Notice; back: () => void}) {
  const showToast = useToast();
  const isMobile = useMediaQuery('(max-width: 900px)', true);
  const [decision, setDecision] = useState('검토 중');
  const [memo, setMemo] = useState('');

  const ok = notice.checks.filter(c => c.verdict === '충족').length;

  const main = (
    <VStack gap={5}>
      {notice.changes.length > 0 && (
        <Banner status="info" title="정정 공고가 있어요" description={notice.changes.map(c => `${c.at} ${c.item}: ${c.before} → ${c.after}`).join(' / ')} />
      )}

      <Card padding={5}>
        <VStack gap={4}>
          <HStack hAlign="between" vAlign="center" wrap="wrap">
            <Heading level={4}>자격 자동 대조</Heading>
            {verdictBadge(notice.verdict)}
          </HStack>
          <ProgressBar label={`조건 ${notice.checks.length}개 중 ${ok}개 충족`} value={ok} max={notice.checks.length} hasValueLabel formatValueLabel={(v, m) => `${v}/${m}`} variant={notice.verdict === '미충족' ? 'error' : notice.verdict === '충족' ? 'success' : 'warning'} />
          <List density="compact">
            {notice.checks.map(c => (
              <ListItem
                key={c.item}
                label={c.item}
                description={c.why}
                startContent={<StatusDot variant={c.verdict === '충족' ? 'success' : c.verdict === '미충족' ? 'error' : 'warning'} label={c.verdict} />}
                endContent={checkBadge(c.verdict)}
              />
            ))}
          </List>
        </VStack>
      </Card>

      <Card padding={5}>
        <VStack gap={4}>
          <VStack gap={1}>
            <HStack gap={2} vAlign="center">
              <Heading level={4}>첨부파일 AI 요약</Heading>
              <Badge variant="purple" label="Claude Sonnet" />
            </HStack>
            <Text type="supporting" color="secondary">
              공고서·과업지시서·설계서에서 뽑았어요. 문서에 없는 건 &quot;문서에 없음&quot;으로 표시해요.
            </Text>
          </VStack>
          <MetadataList label={{position: 'start', width: 96}}>
            {notice.summary.map(r => (
              <MetadataListItem key={r.k} label={r.k}>
                <VStack gap={1}>
                  <Text type="body">{r.v}</Text>
                  <HStack gap={1}>
                    <Token label={r.src} color="gray" />
                  </HStack>
                </VStack>
              </MetadataListItem>
            ))}
          </MetadataList>
        </VStack>
      </Card>

      <Grid columns={{minWidth: 280, max: 2, repeat: 'fit'}} gap={4}>
        <Card padding={5}>
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
          </VStack>
        </Card>
        <Card padding={5}>
          <VStack gap={3}>
            <Heading level={4}>놓치기 쉬운 서류</Heading>
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
      </Grid>

      {notice.history && (
        <Card variant="muted" padding={5}>
          <VStack gap={2}>
            <Heading level={4}>작년에 누가 땄나</Heading>
            <Text type="body">{notice.history}</Text>
          </VStack>
        </Card>
      )}
    </VStack>
  );

  const rail = (
    <VStack gap={4} width={isMobile ? undefined : 320}>
      <Card padding={5}>
        <VStack gap={3}>
          <Heading level={4}>핵심 정보</Heading>
          <MetadataList label={{position: 'start', width: 84}}>
            <MetadataListItem label="기초금액">{won(notice.base)}</MetadataListItem>
            <MetadataListItem label="톤당 단가">{notice.perTon ? `${(notice.perTon / 10_000).toFixed(1)}만 원` : '-'}</MetadataListItem>
            <MetadataListItem label="과업량">{notice.qty}</MetadataListItem>
            <MetadataListItem label="투찰 마감">
              <HStack gap={2} vAlign="center">
                <Text type="body">{notice.deadline}</Text>
                {ddayBadge(notice.dday)}
              </HStack>
            </MetadataListItem>
            <MetadataListItem label="개찰">{notice.opening}</MetadataListItem>
          </MetadataList>
          <Button label="나라장터 원문 열기" onClick={() => showToast({body: '데모: 나라장터 공고 페이지로 이동해요', uniqueID: 'g2b'})} />
        </VStack>
      </Card>
      {notice.preDeadlines && (
        <Card padding={5}>
          <VStack gap={3}>
            <Heading level={4}>투찰보다 먼저인 마감</Heading>
            <List density="compact">
              {notice.preDeadlines.map(d => (
                <ListItem key={d.k} label={d.k} description={d.v} startContent={<StatusDot variant="warning" label="마감" />} />
              ))}
            </List>
          </VStack>
        </Card>
      )}
      <Card padding={5}>
        <VStack gap={3}>
          <Heading level={4}>첨부파일 {notice.attachments.length}개</Heading>
          <List density="compact">
            {notice.attachments.map(a => (
              <ListItem key={a.name} label={a.kind} description={a.name} startContent={<Icon icon={PaperClipIcon} size="sm" />} onClick={() => showToast({body: '데모: 원문 파일을 열어요', uniqueID: 'attach'})} />
            ))}
          </List>
        </VStack>
      </Card>
      <Card padding={5}>
        <VStack gap={3}>
          <HStack gap={2} vAlign="center">
            <Heading level={4}>이 발주처</Heading>
            <Badge variant="purple" label="2차" />
          </HStack>
          <MetadataList label={{position: 'start', width: 84}}>
            <MetadataListItem label="최근 3년">{`공고 ${notice.agencyNote.past}건`}</MetadataListItem>
            <MetadataListItem label="평균 참여">{notice.agencyNote.avgBidders}</MetadataListItem>
            <MetadataListItem label="1순위 최다">{notice.agencyNote.topWinner}</MetadataListItem>
            <MetadataListItem label="재참여">{notice.agencyNote.rebid}</MetadataListItem>
          </MetadataList>
        </VStack>
      </Card>
      <Card padding={5}>
        <VStack gap={3}>
          <Heading level={4}>내 메모</Heading>
          <SegmentedControl label="결정" value={decision} onChange={v => setDecision(String(v))} layout="fill">
            <SegmentedControlItem value="검토 중" label="검토" />
            <SegmentedControlItem value="참여" label="참여" />
            <SegmentedControlItem value="보류" label="보류" />
            <SegmentedControlItem value="포기" label="포기" />
          </SegmentedControl>
          <TextArea label="이유" value={memo} onChange={v => setMemo(v)} description="나중에 '왜 안 들어갔지?'를 찾을 수 있게." />
        </VStack>
      </Card>
    </VStack>
  );

  return (
    <VStack gap={6}>
      <HStack gap={2} vAlign="center">
        <Button label="맞춤 공고" variant="ghost" size="sm" icon={<Icon icon={ArrowLeftIcon} />} onClick={back} />
      </HStack>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center" wrap="wrap">
          {verdictBadge(notice.verdict)}
          {ddayBadge(notice.dday)}
          {levelBadge(notice.perTonLevel)}
          <Text type="supporting" color="secondary">
            {notice.agency} · {notice.method} · 게시 {notice.posted}
          </Text>
        </HStack>
        <Heading level={1}>{notice.title}</Heading>
        <Text type="body" color="secondary">
          {notice.oneLine}
        </Text>
      </VStack>
      {isMobile ? (
        <VStack gap={5}>
          {main}
          {rail}
        </VStack>
      ) : (
        <HStack gap={6} vAlign="start">
          <StackItem size="fill">{main}</StackItem>
          {rail}
        </HStack>
      )}
      <Text type="supporting" color="secondary">
        가격(사정률)은 추천하지 않아요. 투찰은 나라장터에서 직접 해주세요.
      </Text>
    </VStack>
  );
}

// 디스코드 알림 미리보기
// ---------------------------------------------------------------------------

function kindBadge(k: Alert['kind']) {
  if (k === '새 공고') return <Badge variant="blue" label="🆕 새 공고" />;
  if (k === '정정') return <Badge variant="warning" label="✏️ 정정" />;
  if (k === '취소') return <Badge variant="error" label="취소" />;
  if (k === '기초금액 발표') return <Badge variant="cyan" label="💰 기초금액 발표" />;
  if (k === '아침 요약') return <Badge variant="purple" label="☀️ 아침 요약" />;
  if (k === '마감 겹침') return <Badge variant="orange" label="⏰ 마감 겹침" />;
  if (k === '경쟁 업체 낙찰') return <Badge variant="pink" label="👀 경쟁 업체 낙찰" />;
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
                {a.phase2 && <Badge variant="neutral" label="2차" />}
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
      <Card>
        <VStack gap={3}>
          <Heading level={4}>1순위는 이렇게 정해졌어요 — ○○리 해안 정화 폐기물처리 용역 (11.30)</Heading>
          <Stepper activeStep={3} orientation="vertical" label="1순위 결정 과정">
            <Step step={0} label="예정가격 4,754만 원 (사정률 99.82%)" description="복수예비가격 15개 중 업체들이 가장 많이 뽑은 4개(3·7·9·12번) 평균" status="success" />
            <Step step={1} label="낙찰하한가 4,183만 원" description="예정가격 × 88%" status="success" />
            <Step step={2} label="1순위 A업체 4,183.4만 원" description="하한가 이상 중 가장 낮은 금액. 우리는 4,188.5만 원으로 2위(차이 0.12%)" status="success" />
            <Step step={3} label="근소 미달 1곳 · 단독응찰·유찰 아님" description="하한가 0.1% 이내로 아깝게 떨어진 업체 수" />
          </Stepper>
          <Text type="supporting" color="secondary">
            결과를 설명할 뿐 다음 가격을 추천하지는 않아요.
          </Text>
        </VStack>
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
      <TabList value={tab} onChange={v => setTab(v)} hasDivider>
        <Tab value="agency" label="발주처" />
        <Tab value="rival" label="경쟁 업체" />
        <Tab value="price" label="톤당 단가" />
        <Tab value="sajeong" label="사정률 분포" />
        <Tab value="me" label="우리 회사 진단" />
      </TabList>
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
      {tab === 'sajeong' && (
        <Card>
          <VStack gap={3}>
            <VStack gap={1}>
              <Heading level={4}>해솔군 사정률 분포 (최근 2년 41건)</Heading>
              <Text type="supporting" color="secondary">
                예정가격이 어디쯤 나왔는지 보여주는 자료예요. 추첨으로 정해져서 다음 값을 맞히는 데 쓰면 안 돼요(10년 기록 검증 결과).
              </Text>
            </VStack>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SAJEONG} margin={{top: 8, right: 12, left: 0, bottom: 4}}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="bin" tick={tick} axisLine={false} tickLine={false} unit="%" />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={28} />
                <Tooltip />
                <Bar isAnimationActive={false} dataKey="n" fill={C.blue} radius={[4, 4, 0, 0]} name="건수" />
              </BarChart>
            </ResponsiveContainer>
          </VStack>
        </Card>
      )}
      {tab === 'me' && (
        <VStack gap={4}>
          <Grid columns={{minWidth: 150, max: 4, repeat: 'fit'}} gap={4}>
            <Metric label="최근 1년 1순위율" value="25.0%" hint="관내 32.6% · 지역입찰 9.1%" />
            <Metric label="0.1% 이내 근소 탈락" value="9건" hint="아깝게 2위" />
            <Metric label="하한 미달" value="31건" hint="예정가격이 높게 나온 경우" />
            <Metric label="놓친 공고(자격 충족)" value="4건" hint="알림 시작 후 0건 목표" />
          </Grid>
          <Text type="supporting" color="secondary">
            진단만 보여줘요. &quot;다음엔 얼마로 쓰라&quot;는 추천은 하지 않아요.
          </Text>
        </VStack>
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
// 공고 검색 (전체 + 사전규격·발주계획)
// ---------------------------------------------------------------------------

function SearchPage({open}: {open: (id: string) => void}) {
  const showToast = useToast();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('폐기물');
  const [paste, setPaste] = useState('');
  const verdictCell = (v: Verdict | '-') => (v === '-' ? <Text type="body">-</Text> : verdictBadge(v));
  return (
    <VStack gap={6}>
      <PageTitle title="공고 검색" desc="맞춤 조건 밖의 공고까지 직접 찾아요. 검색 결과에도 자격 판정이 붙어요." />
      <TabList value={tab} onChange={v => setTab(v)} hasDivider>
        <Tab value="all" label="입찰 공고" />
        <Tab value="pre" label="사전규격·발주계획" endContent={<Badge variant="purple" label="2차" />} />
      </TabList>
      {tab === 'all' ? (
        <>
          <Card>
            <VStack gap={4}>
              <Grid columns={{minWidth: 200, max: 3, repeat: 'fit'}} gap={4}>
                <TextInput label="공고명·키워드" value={q} onChange={v => setQ(v)} />
                <TextInput label="발주처" value="" onChange={() => {}} placeholder="예: 해솔군" />
                <TextInput label="제외어" value="석면, 건설폐기물" onChange={() => {}} />
              </Grid>
              <HStack gap={2} wrap="wrap">
                <Token label="용역" color="blue" />
                <Token label="전남 · 제주" color="teal" />
                <Token label="게시일 최근 30일" color="gray" />
                <Token label="계약방법 전체" color="gray" />
                <Button label="검색" size="sm" onClick={() => showToast({body: `데모: "${q}" 검색`, uniqueID: 'search'})} />
              </HStack>
              <Divider />
              <HStack gap={2} vAlign="end" wrap="wrap">
                <StackItem size="fill">
                  <TextInput label="공고번호나 나라장터 주소 붙여넣기" value={paste} onChange={v => setPaste(v)} placeholder="R26BK01839317 또는 https://www.g2b.go.kr/..." />
                </StackItem>
                <Button label="바로 불러오기" variant="secondary" onClick={() => open('n1')} />
              </HStack>
            </VStack>
          </Card>
          <Card>
            <Table<SearchRow>
              data={SEARCH_ROWS}
              idKey="id"
              density="balanced"
              hasHover
              verticalAlign="middle"
              columns={[
                {key: 'title', header: '공고', width: {type: 'proportional', value: 3, minWidth: 260}},
                {key: 'agency', header: '발주처'},
                {key: 'method', header: '계약방법'},
                {key: 'base', header: '기초금액', renderCell: r => <Text type="body">{won(r.base)}</Text>},
                {key: 'deadline', header: '마감'},
                {key: 'verdict', header: '자격', renderCell: r => verdictCell(r.verdict)},
              ]}
            />
          </Card>
        </>
      ) : (
        <Card>
          <VStack gap={3}>
            <Text type="supporting" color="secondary">
              관심 키워드·발주처의 발주계획과 사전규격을 모아 보고, 본공고가 나오면 같은 사업끼리 이어 보여줘요(공고 전후 이야기).
            </Text>
            <Table<PreSpec>
              data={PRESPECS}
              idKey="id"
              density="balanced"
              columns={[
                {
                  key: 'stage',
                  header: '단계',
                  renderCell: r => <Badge variant={r.stage === '본공고' ? 'success' : r.stage === '사전규격' ? 'info' : 'neutral'} label={r.stage} />,
                },
                {key: 'title', header: '사업'},
                {key: 'agency', header: '발주처'},
                {key: 'when', header: '일정'},
                {key: 'note', header: '메모'},
              ]}
            />
          </VStack>
        </Card>
      )}
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 일정 (캘린더 + 진행 보드)
// ---------------------------------------------------------------------------

function kindVariant(k: Sched['kind']) {
  if (k === '투찰 마감') return 'error' as const;
  if (k === '개찰') return 'success' as const;
  if (k === '현장설명') return 'info' as const;
  return 'warning' as const;
}

function SchedulePage() {
  const showToast = useToast();
  return (
    <VStack gap={6}>
      <PageTitle title="일정" desc="관심 공고에 담으면 참가등록·공동수급협정·현장설명·투찰 마감·개찰이 자동으로 일정에 들어가요." />
      <HStack gap={2} wrap="wrap">
        <Button label="휴대폰 캘린더에 구독(ICS)" variant="secondary" size="sm" onClick={() => showToast({body: '데모: 구독 주소를 복사했어요. 휴대폰 캘린더에 추가하면 자동 표시돼요.', uniqueID: 'ics'})} />
        <Badge variant="warning" label="12/03 마감 2건 겹침 (2차: 경고)" />
      </HStack>
      <Card>
        <VStack gap={3}>
          <Heading level={4}>다가오는 일정</Heading>
          <List density="compact">
            {SCHEDULE.map(s => (
              <ListItem key={s.id} label={s.title} description={s.date} endContent={<Badge variant={kindVariant(s.kind)} label={s.kind} />} />
            ))}
          </List>
        </VStack>
      </Card>
      <VStack gap={2}>
        <Heading level={4}>진행 보드</Heading>
        <Grid columns={{minWidth: 200, max: 4, repeat: 'fit'}} gap={4}>
          {BOARD.map(c => (
            <Card key={c.col}>
              <VStack gap={2}>
                <HStack hAlign="between" vAlign="center">
                  <Text type="body" weight="semibold">
                    {c.col}
                  </Text>
                  <Badge variant="neutral" label={String(c.items.length)} />
                </HStack>
                {c.items.map(i => (
                  <Card key={i} padding={3}>
                    <Text type="supporting">{i}</Text>
                  </Card>
                ))}
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 낙찰 정보
// ---------------------------------------------------------------------------

function AwardsPage() {
  return (
    <VStack gap={6}>
      <PageTitle title="낙찰 정보" desc="관심 지역·업종의 최근 개찰 결과를 발주처·업체로 찾아봐요." />
      <Card>
        <Table<Award>
          data={AWARDS}
          idKey="id"
          density="balanced"
          hasHover
          columns={[
            {key: 'date', header: '개찰'},
            {key: 'title', header: '공고', width: {type: 'proportional', value: 3, minWidth: 240}},
            {key: 'agency', header: '발주처'},
            {key: 'bidders', header: '참가', renderCell: a => <Text type="body">{a.bidders}곳</Text>},
            {key: 'winner', header: '1순위', renderCell: a => (a.winner === '우리 회사' ? <Badge variant="success" label="우리 회사" /> : <Text type="body">{a.winner}</Text>)},
            {key: 'rate', header: '투찰률'},
            {key: 'amount', header: '1순위 금액', renderCell: a => <Text type="body">{won(a.amount)}</Text>},
          ]}
        />
      </Card>
      <Card>
        <VStack gap={3}>
          <HStack gap={2} vAlign="center">
            <Heading level={4}>이번 달 1순위 업체 순위 (관심 지역)</Heading>
            <Badge variant="purple" label="2차" />
          </HStack>
          <Table
            data={MONTHLY_TOP}
            idKey="id"
            density="compact"
            columns={[
              {key: 'rank', header: '순위'},
              {key: 'name', header: '업체'},
              {key: 'wins', header: '1순위'},
              {key: 'region', header: '주 발주처'},
            ]}
          />
        </VStack>
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 계산기·자료
// ---------------------------------------------------------------------------

function ToolsPage() {
  const [base, setBase] = useState('31900000');
  const [sj, setSj] = useState('100.000');
  const [lr, setLr] = useState('88');
  const b = Number(base.replace(/,/g, '')) || 0;
  const plan = (b * (Number(sj) || 0)) / 100;
  const amt = Math.ceil((plan * (Number(lr) || 0)) / 100);
  return (
    <VStack gap={6}>
      <PageTitle title="계산기·자료" desc="공고를 고르면 기초금액·하한율이 자동으로 채워져요. 사정률은 대표님이 직접 넣어요(추천하지 않아요)." />
      <Grid columns={{minWidth: 300, max: 2, repeat: 'fit'}} gap={4}>
        <Card>
          <VStack gap={4}>
            <Heading level={4}>투찰금액 계산기</Heading>
            <Text type="supporting" color="secondary">
              불러온 공고: ○○항 침적쓰레기 수거 처리 용역
            </Text>
            <TextInput label="기초금액(원)" value={base} onChange={v => setBase(v)} />
            <TextInput label="사정률(%) — 직접 입력" value={sj} onChange={v => setSj(v)} />
            <TextInput label="낙찰하한율(%)" value={lr} onChange={v => setLr(v)} />
            <Divider />
            <VStack gap={1}>
              <Text type="supporting" color="secondary">
                예정가격(가정) {Math.round(plan).toLocaleString()}원 × 하한율 {lr}%
              </Text>
              <Text type="display-3" weight="semibold">
                투찰금액 {amt.toLocaleString()}원
              </Text>
              <Text type="supporting" color="secondary">
                원 단위 절상 · A값 적용 공고는 A값을 빼고 계산해요
              </Text>
            </VStack>
          </VStack>
        </Card>
        <Card>
          <VStack gap={3}>
            <Heading level={4}>낙찰하한율표</Heading>
            <Table
              data={LOWER_RATES}
              idKey="id"
              density="compact"
              columns={[
                {key: 'org', header: '구분'},
                {key: 'range', header: '금액'},
                {key: 'rate', header: '하한율'},
              ]}
            />
            <Text type="supporting" color="secondary">
              예시 값 · 실제 표는 기준 개정 이력과 함께 보여줘요. 적격심사 점수 계산기는 3차(선택).
            </Text>
          </VStack>
        </Card>
      </Grid>
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
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              제외어 · 제외 발주처
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="석면" color="red" />
              <Token label="음식물" color="red" />
              <Token label="건설폐기물" color="red" />
            </HStack>
          </VStack>
          <HStack gap={2} wrap="wrap">
            <Button label="조건 추가" variant="secondary" size="sm" />
            <Button label="투찰 이력으로 조건 추천받기" variant="secondary" size="sm" />
          </HStack>
        </VStack>
      </Card>
      <Card>
        <VStack gap={4}>
          <Heading level={4}>디스코드 알림</Heading>
          <Switch label="새 공고" description="올라오는 즉시 · #새공고" value={alerts.notice} onChange={v => setAlerts({...alerts, notice: v})} />
          <Switch label="정정 · 취소" description="바뀐 항목만 · #새공고" value={alerts.change} onChange={v => setAlerts({...alerts, change: v})} />
          <Switch label="개찰 결과" description="내 순위·1순위와 차이 · #개찰결과" value={alerts.result} onChange={v => setAlerts({...alerts, result: v})} />
          <Switch label="마감 임박" description="마감 전날 저녁 (기본 꺼짐)" value={alerts.deadline} onChange={v => setAlerts({...alerts, deadline: v})} />
          <Switch label="아침 요약" description="매일 08:00 · 바로 가능 / 확인 필요 / 제외" value={true} onChange={() => {}} />
          <Switch label="기초금액 발표" description="관심 공고 · #새공고" value={true} onChange={() => {}} />
          <Text type="supporting" color="secondary">
            함께 받는 사람: 대표님 · 직원 1명 (디스코드 서버 멤버). 자격 미충족 공고는 알림에서 빼고 웹에서만 보여줘요(논의 중).
          </Text>
        </VStack>
      </Card>
      <Card>
        <VStack gap={3}>
          <HStack gap={2} vAlign="center">
            <Heading level={4}>회사 서류 만료일</Heading>
            <Badge variant="purple" label="2차" />
          </HStack>
          <Table
            data={DOCS}
            idKey="id"
            density="compact"
            columns={[
              {key: 'name', header: '서류'},
              {key: 'until', header: '만료일'},
              {key: 'left', header: '남은 기간'},
            ]}
          />
          <Text type="supporting" color="secondary">
            만료 30일·7일 전에 디스코드로 알려줘요.
          </Text>
        </VStack>
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 앱 셸
// ---------------------------------------------------------------------------

type NavKey = Exclude<Page, 'detail'>;
const NAV_GROUPS: {title: string; items: {key: NavKey; label: string; icon: typeof ChartBarIcon; count?: string}[]}[] = [
  {
    title: '공고',
    items: [
      {key: 'home', label: '오늘', icon: HomeIcon},
      {key: 'notices', label: '맞춤 공고', icon: DocumentMagnifyingGlassIcon, count: '4'},
      {key: 'search', label: '공고 검색', icon: MagnifyingGlassIcon},
      {key: 'alerts', label: '디스코드 알림', icon: BellAlertIcon, count: '2'},
    ],
  },
  {
    title: '업무',
    items: [
      {key: 'schedule', label: '일정', icon: CalendarDaysIcon},
      {key: 'history', label: '나의 투찰 기록', icon: ClipboardDocumentListIcon},
      {key: 'tools', label: '계산기', icon: CalculatorIcon},
    ],
  },
  {
    title: '데이터',
    items: [
      {key: 'awards', label: '낙찰 정보', icon: TrophyIcon},
      {key: 'analysis', label: '분석', icon: ChartBarIcon},
    ],
  },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [noticeId, setNoticeId] = useState('n1');
  const notice = NOTICES.find(n => n.id === noticeId) ?? NOTICES[0];
  const navKey: NavKey = page === 'detail' ? 'notices' : page;

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({top: 0});
  };
  const open = (id: string) => {
    setNoticeId(id);
    go('detail');
  };

  return (
    <AppShell
      height="auto"
      variant="wash"
      contentPadding={8}
      banner={<Banner status="warning" title="완성 화면 예시(데모)" description="기관·업체 이름과 숫자는 모두 예시예요. PRD v1.1 기준." />}
      topNav={
        <TopNav
          heading={
            <HStack gap={2} vAlign="center">
              <Icon icon={DocumentMagnifyingGlassIcon} size="md" />
              <Text type="body" weight="bold">
                입찰 도우미
              </Text>
            </HStack>
          }
          endContent={
            <HStack gap={3} vAlign="center">
              <HStack gap={1} vAlign="center">
                <StatusDot variant="success" label="수집 정상" isPulsing />
                <Text type="supporting" color="secondary">
                  14:40 수집
                </Text>
              </HStack>
              <Button label="알림" variant="ghost" size="sm" icon={<Icon icon={BellAlertIcon} />} onClick={() => go('alerts')} />
              <Avatar name="대표" size="sm" />
            </HStack>
          }
        />
      }
      sideNav={
        <SideNav
          header={<SideNavHeading heading="(유)○○환경" subheading="전남 해솔군 · 폐기물 처리" />}
          footer={
            <SideNavItem label="설정" icon={<Icon icon={Cog6ToothIcon} />} isSelected={navKey === 'settings'} onClick={() => go('settings')} />
          }
        >
          {NAV_GROUPS.map(g => (
            <SideNavSection key={g.title} title={g.title}>
              {g.items.map(i => (
                <SideNavItem
                  key={i.key}
                  label={i.label}
                  icon={<Icon icon={i.icon} />}
                  isSelected={navKey === i.key}
                  onClick={() => go(i.key)}
                  endContent={i.count ? <Badge variant="blue" label={i.count} /> : undefined}
                />
              ))}
            </SideNavSection>
          ))}
        </SideNav>
      }
    >
      <VStack gap={6} maxWidth={1180}>
        {page === 'home' && <HomePage open={open} go={go} />}
        {page === 'notices' && <NoticesPage open={open} />}
        {page === 'detail' && <DetailPage notice={notice} back={() => go('notices')} />}
        {page === 'alerts' && <AlertsPage open={open} />}
        {page === 'history' && <HistoryPage />}
        {page === 'analysis' && <AnalysisPage />}
        {page === 'search' && <SearchPage open={open} />}
        {page === 'schedule' && <SchedulePage />}
        {page === 'awards' && <AwardsPage />}
        {page === 'tools' && <ToolsPage />}
        {page === 'settings' && <SettingsPage />}
      </VStack>
    </AppShell>
  );
}
