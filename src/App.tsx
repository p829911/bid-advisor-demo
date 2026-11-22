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
import {Token} from '@astryxdesign/core/Token';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {useToast} from '@astryxdesign/core/Toast';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeftIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  COMPETITORS,
  MY_BIDS,
  NOTICES,
  SAJEONG,
  candidatesFor,
  probAt,
  SIMILAR,
  curveFor,
  won,
  type Competitor,
  type MyBid,
  type Notice,
  type Past,
} from './data';

type Page = 'notices' | 'detail' | 'history' | 'settings';

const C = {
  blue: 'var(--color-data-categorical-blue)',
  orange: 'var(--color-data-categorical-orange)',
  purple: 'var(--color-data-categorical-purple)',
  grid: 'var(--color-border)',
  tick: 'var(--color-text-secondary)',
};
const tick = {fontSize: 'var(--font-size-sm)', fill: C.tick};

// ---------------------------------------------------------------------------
// 공고 목록
// ---------------------------------------------------------------------------

function statusBadge(s: Notice['status']) {
  if (s === '마감 임박') return <Badge variant="warning" label={s} />;
  if (s === '데이터 부족') return <Badge variant="neutral" label={s} />;
  return <Badge variant="success" label={s} />;
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

const topRate = (n: Notice) => (n.bestRate ? candidatesFor(n)[0].rate : 0);

function NoticesPage({open}: {open: (id: string) => void}) {
  const isMobile = useMediaQuery('(max-width: 768px)', true);
  const columns: TableColumn<Notice>[] = [
    {
      key: 'title',
      header: '공고',
      renderCell: n => (
        <VStack gap={1}>
          <Text type="body" weight="semibold">
            {n.title}
          </Text>
          <Text type="supporting" color="secondary">
            {n.agency} · {n.kind} · {n.region}
          </Text>
        </VStack>
      ),
    },
    {key: 'base', header: '기초금액', renderCell: n => <Text type="body">{won(n.base)}</Text>},
    {key: 'deadline', header: '투찰 마감'},
    {key: 'expected', header: '예상 참여'},
    {
      key: 'bestRate',
      header: '추천 투찰률',
      renderCell: n =>
        n.bestRate ? (
          <VStack gap={1}>
            <Text type="body" weight="semibold">
              {topRate(n).toFixed(3)}%
            </Text>
            <Text type="supporting" color="secondary">
              1순위 확률 {n.bestProb}%
            </Text>
          </VStack>
        ) : (
          <Text type="supporting" color="secondary">
            -
          </Text>
        ),
    },
    {key: 'status', header: '상태', renderCell: n => statusBadge(n.status)},
    {
      key: 'id',
      header: '',
      renderCell: n => (
        <Button label="추천 보기" size="sm" variant="secondary" isDisabled={!n.bestRate} onClick={() => open(n.id)} />
      ),
    },
  ];

  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>오늘의 관심 공고</Heading>
        <Text type="body" color="secondary">
          등록한 업종·지역·발주처에 맞는 진행 중 공고 {NOTICES.length}건
        </Text>
      </VStack>
      <Grid columns={{minWidth: 150, max: 4, repeat: "fit"}} gap={4}>
        <Metric label="진행 중 관심 공고" value={`${NOTICES.length}건`} hint="이번 주 마감 4건" />
        <Metric label="추천 준비됨" value="5건" hint="1건은 과거 데이터 부족" />
        <Metric label="최근 6개월 내 투찰" value="52건" hint="1순위 3건" />
        <Metric label="추천대로였다면 (백테스트)" value="1순위 7건" hint="같은 52건 기준 · 예시" />
      </Grid>
      {isMobile ? (
        <List>
          {NOTICES.map(n => (
            <ListItem
              key={n.id}
              label={n.title}
              description={
                <Text type="supporting" color="secondary">
                  {n.agency} · 마감 {n.deadline} · {n.bestRate ? `추천 ${topRate(n).toFixed(3)}% (${n.bestProb}%)` : '데이터 부족'}
                </Text>
              }
              endContent={statusBadge(n.status)}
              onClick={n.bestRate ? () => open(n.id) : undefined}
            />
          ))}
        </List>
      ) : (
        <Card>
          <Table<Notice> data={NOTICES} columns={columns} idKey="id" density="balanced" hasHover verticalAlign="middle" />
        </Card>
      )}
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 공고 상세: 추천
// ---------------------------------------------------------------------------

function DetailPage({notice, back}: {notice: Notice; back: () => void}) {
  const showToast = useToast();
  const curve = curveFor(notice);
  const cands = candidatesFor(notice).map((c, i) => ({...c, prob: +c.prob.toFixed(1), tag: ['추천', '대안 1', '대안 2'][i]}));
  const best = cands[0].rate;
  const habitProb = +probAt(notice, 88.0).toFixed(1);

  const pastCols: TableColumn<Past>[] = [
    {key: 'title', header: '과거 공고'},
    {key: 'date', header: '개찰일'},
    {key: 'n', header: '참여', renderCell: p => <Text type="body">{p.n}곳</Text>},
    {key: 'sajeong', header: '사정률'},
    {key: 'winRate', header: '1순위 투찰률'},
    {key: 'winner', header: '1순위'},
  ];
  const compCols: TableColumn<Competitor>[] = [
    {key: 'name', header: '자주 만나는 업체'},
    {key: 'seen', header: '마주친 횟수', renderCell: c => <Text type="body">{c.seen}회</Text>},
    {key: 'habit', header: '주로 쓰는 투찰률'},
    {key: 'spread', header: '흔들림'},
    {key: 'note', header: '메모'},
  ];

  return (
    <VStack gap={6}>
      <HStack gap={2} vAlign="center">
        <Button label="공고 목록" variant="ghost" size="sm" icon={<Icon icon={ArrowLeftIcon} />} onClick={back} />
      </HStack>
      <VStack gap={2}>
        <HStack gap={2} vAlign="center" wrap="wrap">
          {statusBadge(notice.status)}
          <Text type="supporting" color="secondary">
            {notice.agency} · {notice.kind} · 참가제한 {notice.region} · 적격심사(하한율 {notice.lowerRate}%)
          </Text>
        </HStack>
        <Heading level={2}>{notice.title}</Heading>
        <Text type="body" color="secondary">
          기초금액 {won(notice.base)} · 투찰 마감 {notice.deadline} · 개찰 {notice.opening} · 예상 참여 {notice.expected}
        </Text>
      </VStack>

      {/* 추천 카드 */}
      <Grid columns={{minWidth: 220, max: 3, repeat: 'fit'}} gap={4}>
        {cands.map(c => (
          <Card key={c.tag}>
            <VStack gap={2}>
              <HStack hAlign="between" vAlign="center">
                <Text type="supporting" color="secondary">
                  {c.tag}
                </Text>
                {c.tag === '추천' && <Badge variant="info" label="확률 최고" />}
              </HStack>
              <Text type="display-2" weight="semibold">
                {c.rate.toFixed(3)}%
              </Text>
              <Text type="body">
                투찰금액 <Text as="span" type="body" weight="semibold">{won((notice.base * c.rate) / 100)}</Text>
              </Text>
              <Text type="supporting" color="secondary">
                1순위 확률 {c.prob.toFixed(1)}%
              </Text>
            </VStack>
          </Card>
        ))}
      </Grid>
      <Banner
        status="info"
        title={`늘 쓰시던 88.000%로 쓰면 1순위 확률은 ${habitProb}%예요.`}
        description="이 공고에 자주 들어오는 업체 2곳이 88.000%와 88.050% 근처에 몰려 있어서, 같은 운이 와도 순위가 밀리기 쉬워요."
        endContent={
          <Button
            label="추천값 복사"
            size="sm"
            variant="secondary"
            onClick={() => showToast({body: `데모: ${best.toFixed(3)}% / ${won((notice.base * best) / 100)} 를 복사했어요`, uniqueID: 'copy'})}
          />
        }
      />

      {/* 확률 곡선 */}
      <Card>
        <VStack gap={4}>
          <VStack gap={1}>
            <Heading level={4}>투찰률별 1순위 확률</Heading>
            <Text type="supporting" color="secondary">
              예정가격 추첨 × 경쟁 업체 투찰 습관을 5,000번 시뮬레이션한 결과. 파란 선이 1순위 확률, 주황 점선은 경쟁 업체가 몰리는 정도(상대값)예요.
            </Text>
          </VStack>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={curve} margin={{top: 8, right: 12, left: 0, bottom: 4}}>
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} interval={9} />
              <YAxis tick={tick} axisLine={false} tickLine={false} width={36} unit="%" />
              <Tooltip
                content={({active, payload}) =>
                  active && payload?.length ? (
                    <Card padding={3}>
                      <VStack gap={1}>
                        <Text type="supporting" weight="semibold">
                          투찰률 {(payload[0].payload as {rate: number}).rate.toFixed(3)}%
                        </Text>
                        <Text type="supporting">1순위 확률 {(payload[0].payload as {prob: number}).prob}%</Text>
                        <Text type="supporting" color="secondary">
                          경쟁 밀집도 {(payload[0].payload as {crowd: number}).crowd}
                        </Text>
                      </VStack>
                    </Card>
                  ) : null
                }
              />
              <Area isAnimationActive={false} type="monotone" dataKey="crowd" stroke={C.orange} fill={C.orange} fillOpacity={0.12} strokeDasharray="3 3" name="경쟁 밀집(상대값)" />
              <Area isAnimationActive={false} type="monotone" dataKey="prob" stroke={C.blue} fill={C.blue} fillOpacity={0.25} strokeWidth={2} name="1순위 확률" />
              <ReferenceLine x={notice.lowerRate.toFixed(2)} stroke={C.tick} strokeDasharray="4 4" label={{value: '하한선', fill: C.tick, fontSize: 12}} />
              <ReferenceLine x={best.toFixed(2)} stroke={C.purple} label={{value: '추천', fill: C.purple, fontSize: 12}} />
            </AreaChart>
          </ResponsiveContainer>
        </VStack>
      </Card>

      <Grid columns={{minWidth: 320, max: 2, repeat: 'fit'}} gap={4}>
        <Card>
          <VStack gap={3}>
            <VStack gap={1}>
              <Heading level={4}>이 발주처 사정률 분포</Heading>
              <Text type="supporting" color="secondary">
                최근 3년 94건. 예정가격은 추첨이라 맞힐 수 없고, 이 범위 어디든 떨어질 수 있다고 보고 계산해요.
              </Text>
            </VStack>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SAJEONG} margin={{top: 4, right: 8, left: 0, bottom: 4}}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="bin" tick={tick} axisLine={false} tickLine={false} unit="%" />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={28} />
                <Bar isAnimationActive={false} dataKey="n" fill={C.blue} radius={[4, 4, 0, 0]} name="건수" />
              </BarChart>
            </ResponsiveContainer>
          </VStack>
        </Card>
        <Card>
          <VStack gap={3}>
            <VStack gap={1}>
              <Heading level={4}>왜 {best.toFixed(3)}%인가요?</Heading>
            </VStack>
            <List density="compact" listStyle="disc">
              <ListItem label={<>하한선({notice.lowerRate}%)보다 충분히 위라 예정가격이 높게 나와도 탈락 위험이 낮아요.</>} />
              <ListItem label={<>87.80%와 88.00% 사이가 비어 있어요. 단골 업체들은 양쪽 끝에 몰려 있어요.</>} />
              <ListItem label={<>비슷한 과거 공고 5건 중 3건의 1순위가 87.89~87.96% 구간이었어요.</>} />
              <ListItem label={<>참여 업체가 6~9곳이라 빈 구간 효과가 큰 편이에요.</>} />
            </List>
          </VStack>
        </Card>
      </Grid>

      <Card>
        <VStack gap={3}>
          <Heading level={4}>자주 만나는 경쟁 업체</Heading>
          <Table<Competitor> data={COMPETITORS} columns={compCols} idKey="id" density="compact" />
        </VStack>
      </Card>
      <Card>
        <VStack gap={3}>
          <Heading level={4}>비슷한 과거 공고</Heading>
          <Table<Past> data={SIMILAR} columns={pastCols} idKey="id" density="compact" />
        </VStack>
      </Card>
      <Text type="supporting" color="secondary">
        추천은 확률을 높이는 참고값이며 낙찰을 보장하지 않아요. 투찰은 나라장터에서 직접 해주세요.
      </Text>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 내 기록
// ---------------------------------------------------------------------------

function HistoryPage() {
  const cols: TableColumn<MyBid>[] = [
    {key: 'date', header: '개찰'},
    {key: 'title', header: '공고'},
    {key: 'mine', header: '내 투찰률'},
    {key: 'rec', header: '추천 투찰률'},
    {
      key: 'result',
      header: '실제 결과',
      renderCell: b =>
        b.result.includes('낙찰') ? <Badge variant="success" label={b.result} /> : <Text type="body">{b.result}</Text>,
    },
    {
      key: 'ifRec',
      header: '추천대로였다면',
      renderCell: b =>
        b.ifRec === '1순위' ? <Badge variant="info" label="1순위" /> : <Text type="body">{b.ifRec}</Text>,
    },
  ];
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>내 투찰 기록</Heading>
        <Text type="body" color="secondary">
          개찰 결과가 나오면 자동으로 쌓여요. 추천값으로 썼다면 몇 위였을지 같이 계산해요.
        </Text>
      </VStack>
      <Grid columns={{minWidth: 150, max: 4, repeat: "fit"}} gap={4}>
        <Metric label="최근 6개월 투찰" value="52건" />
        <Metric label="실제 1순위" value="3건" hint="5.8%" />
        <Metric label="추천대로였다면" value="7건" hint="13.5% · 백테스트 예시" />
        <Metric label="가장 많이 쓴 값" value="88.000%" hint="52건 중 31건" />
      </Grid>
      <Card>
        <Table<MyBid> data={MY_BIDS} columns={cols} idKey="id" density="balanced" hasHover />
      </Card>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------

function SettingsPage() {
  const [biz, setBiz] = useState('000-00-00000');
  const [alerts, setAlerts] = useState({notice: true, deadline: true, result: true});
  return (
    <VStack gap={6}>
      <VStack gap={1}>
        <Heading level={2}>설정</Heading>
        <Text type="body" color="secondary">
          처음 한 번만 등록하면 맞는 공고와 추천이 자동으로 와요.
        </Text>
      </VStack>
      <Card>
        <VStack gap={4}>
          <Heading level={4}>회사 정보</Heading>
          <TextInput label="사업자번호" value={biz} onChange={v => setBiz(v)} description="내 투찰 기록을 개찰 결과에서 찾는 데만 써요." />
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              입찰 참가 업종
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="폐기물 수집·운반업" color="blue" />
              <Token label="해양환경정화업" color="blue" />
              <Token label="일반용역" color="blue" />
            </HStack>
          </VStack>
          <VStack gap={2}>
            <Text type="body" weight="semibold">
              관심 지역 · 발주처
            </Text>
            <HStack gap={2} wrap="wrap">
              <Token label="경남 전체" color="teal" />
              <Token label="부산" color="teal" />
              <Token label="해양환경공단" color="purple" />
              <Token label="통영시" color="purple" />
              <Token label="거제시" color="purple" />
            </HStack>
          </VStack>
        </VStack>
      </Card>
      <Card>
        <VStack gap={4}>
          <Heading level={4}>알림</Heading>
          <Switch label="새 관심 공고" description="매일 아침 8시 묶어서" value={alerts.notice} onChange={v => setAlerts({...alerts, notice: v})} />
          <Switch label="투찰 마감 2시간 전" description="추천값과 함께" value={alerts.deadline} onChange={v => setAlerts({...alerts, deadline: v})} />
          <Switch label="개찰 결과" description="내 순위와 추천대로였다면" value={alerts.result} onChange={v => setAlerts({...alerts, result: v})} />
          <Text type="supporting" color="secondary">
            받는 곳: 카카오톡 · 이메일 (데모)
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
  {key: 'notices', label: '관심 공고', icon: DocumentMagnifyingGlassIcon},
  {key: 'history', label: '내 기록', icon: ClipboardDocumentListIcon},
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
      <Icon icon={ChartBarIcon} size="md" color="secondary" />
      <VStack gap={0}>
        <Text type="body" weight="bold">
          입찰가 어드바이저
        </Text>
        <Text type="supporting" color="secondary">
          (주)○○해양환경
        </Text>
      </VStack>
    </HStack>
  );

  const body = (
    <VStack gap={6}>
      <Banner
        status="warning"
        title="데모 화면이에요"
        description="숫자와 업체명은 모두 예시예요. 실제 서비스에서는 나라장터 개찰 결과로 계산해요."
      />
      {page === 'notices' && <NoticesPage open={open} />}
      {page === 'detail' && <DetailPage notice={notice} back={() => go('notices')} />}
      {page === 'history' && <HistoryPage />}
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
                  <SegmentedControlItem key={n.key} value={n.key} label={n.label} />
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
                  데이터 기준
                </Text>
                <Text type="supporting">나라장터 개찰 결과 · 11.22 06:00</Text>
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
