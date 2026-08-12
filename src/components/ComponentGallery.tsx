import { useState, type ChangeEvent } from "react";
import {
  AddressInput,
  AmountDisplay,
  AmountInput,
  Avatar,
  AvatarButton,
  Banner,
  Button,
  Card,
  CardButton,
  CardContent,
  CardContentDescription,
  CardContentTitle,
  CardFooter,
  CardFooterActions,
  CardHeader,
  CardLeading,
  CardTrailing,
  Checkbox,
  ContentBanner,
  ContentBannerContent,
  ContentBannerDescription,
  ContentBannerTitle,
  DataTable,
  DataTableGlobalSearchInput,
  DataTableRoot,
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Divider,
  DotCount,
  DotIcon,
  DotIndicator,
  DotSymbol,
  IconButton,
  InteractiveIcon,
  Link,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemTitle,
  ListItemTrailing,
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
  MediaButton,
  MediaCard,
  MediaCardTitle,
  MediaImage,
  MediaTag,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarTitle,
  NavBarTrailing,
  PageIndicator,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SearchInput,
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
  SegmentedControl,
  SegmentedControlButton,
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectTrigger,
  Skeleton,
  Spinner,
  Spot,
  Stepper,
  Subheader,
  SubheaderCount,
  SubheaderDescription,
  SubheaderInfo,
  SubheaderRow,
  SubheaderShowMore,
  SubheaderTitle,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableCellContent,
  TableCellContentTitle,
  TableCellItem,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRoot,
  TableRow,
  Tag,
  TextInput,
  Tile,
  TileButton,
  TileContent,
  TileDescription,
  TileSecondaryAction,
  TileTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Trend,
  useLumenDataTable,
} from "@ledgerhq/lumen-ui-react";
import {
  ArrowRight,
  Check,
  ChevronBigRight,
  Information,
  MoreVertical,
  Plus,
  Settings,
} from "@ledgerhq/lumen-ui-react/symbols";
import {
  DonutChart,
  DonutChartCenter,
  DonutChartDescription,
  DonutChartTitle,
  LineChart,
  Point,
  ReferenceLine,
  Scrubber,
} from "@ledgerhq/lumen-ui-react-visualization";
import { CryptoIcon } from "@ledgerhq/crypto-icons";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-16 w-full">
      <h3 className="heading-5-semi-bold text-base">{title}</h3>
      <div className="flex flex-col gap-16 w-full">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-12">{children}</div>;
}

const SELECT_ITEMS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
];

const TABLE_DATA = [
  { name: "Bitcoin", ticker: "BTC", price: "$65,997" },
  { name: "Ethereum", ticker: "ETH", price: "$1,911" },
  { name: "Solana", ticker: "SOL", price: "$80.38" },
];

const LINE_SERIES = [
  {
    id: "price",
    label: "Price",
    data: [40, 48, 45, 62, 58, 70, 66, 80, 74, 90],
    stroke: "var(--border-active)",
  },
];

const DONUT_SERIES = [
  { id: "btc", label: "Bitcoin", value: 42, color: "var(--color-crypto-bitcoin, #F7931A)" },
  { id: "eth", label: "Ethereum", value: 28, color: "var(--color-crypto-ethereum, #627EEA)" },
  { id: "sol", label: "Solana", value: 18, color: "var(--color-crypto-solana, #9945FF)" },
  { id: "other", label: "Other", value: 12 },
];

function usdFormatter(value: number) {
  const [integerPart, decimalPart] = value.toFixed(2).split(".");
  return {
    integerPart,
    decimalPart,
    currencyText: "$",
    decimalSeparator: "." as const,
    currencyPosition: "start" as const,
  };
}

export function ComponentGallery() {
  const [amount, setAmount] = useState("1234.56");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(true);
  const [segment, setSegment] = useState("one");
  const [page, setPage] = useState(2);
  const [selectValue, setSelectValue] = useState<string | null>("btc");

  const dataTable = useLumenDataTable({
    data: TABLE_DATA,
    columns: [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "ticker", header: "Ticker" },
      { accessorKey: "price", header: "Price", meta: { align: "end" } },
    ],
  });

  return (
    <div className="flex flex-col gap-40 w-full">
      <Divider />
      <div className="flex flex-col gap-8">
        <h2 className="heading-4-semi-bold text-base">Component gallery</h2>
        <p className="body-2 text-muted">
          Every public Lumen UI + visualization component instantiated once.
        </p>
      </div>

      <Section title="Inputs">
        <AddressInput
          value={address}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
          placeholder="Paste address"
          onQrCodeClick={() => undefined}
        />
        <AmountInput
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          currencyText="USD"
        />
        <SearchInput
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search…"
        />
        <TextInput
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          label="Label"
          placeholder="Type something"
        />
        <Row>
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} aria-label="Checkbox" />
          <Switch selected={switched} onChange={setSwitched} aria-label="Switch" />
        </Row>
      </Section>

      <Section title="Display">
        <AmountDisplay value={2258.93} formatter={usdFormatter} />
        <Row>
          <Avatar fallbackText="SB" size="md" />
          <AvatarButton fallbackText="SB" size="md" aria-label="Avatar button" />
          <Tag label="Accent" appearance="accent" icon={Check} />
          <MediaTag label="Bitcoin" leadingContent={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="16px" />} />
          <Trend value={7.87} />
          <Spinner size={24} />
          <Skeleton className="h-24 w-160 rounded-md" />
        </Row>
        <Row>
          <Spot appearance="icon" icon={Settings} size={48} />
          <Spot appearance="check" size={48} />
          <Spot appearance="number" number={3} size={48} />
          <DotCount value={3}>
            <IconButton icon={Settings} appearance="transparent" size="md" aria-label="Settings with count" />
          </DotCount>
          <DotIndicator>
            <IconButton icon={Settings} appearance="transparent" size="md" aria-label="Settings with indicator" />
          </DotIndicator>
          <DotIcon appearance="success" icon={Check} size={20}>
            <MediaImage fallback="B" size={40} />
          </DotIcon>
          <DotSymbol src="https://cdn.jsdelivr.net/gh/LedgerHQ/crypto-icons/assets/btc.svg" alt="BTC" size={20}>
            <MediaImage fallback="E" size={40} />
          </DotSymbol>
        </Row>
        <MediaImage fallback="ETH" size={56} />
      </Section>

      <Section title="Actions">
        <Row>
          <Button appearance="base" size="md" icon={Plus}>
            Button
          </Button>
          <IconButton icon={Settings} appearance="transparent" size="md" aria-label="Settings" />
          <InteractiveIcon icon={Settings} iconType="stroked" appearance="muted" aria-label="Interactive" />
          <Link href="#" appearance="accent" icon={ArrowRight}>
            Link
          </Link>
          <TileButton icon={Plus}>Tile button</TileButton>
          <CardButton title="Card button" description="Optional description" icon={Plus} />
          <MediaButton leadingContent={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="20px" />} leadingContentShape="rounded">
            Media button
          </MediaButton>
        </Row>
      </Section>

      <Section title="Feedback">
        <Banner appearance="info" title="Info banner" description="Banner description" />
        <ContentBanner onClose={() => undefined} closeAriaLabel="Close">
          <Spot appearance="info" size={48} />
          <ContentBannerContent>
            <ContentBannerTitle>Content banner</ContentBannerTitle>
            <ContentBannerDescription>Rich content banner description</ContentBannerDescription>
          </ContentBannerContent>
        </ContentBanner>
        <MediaBanner
          imageUrl="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
          onClose={() => undefined}
          closeAriaLabel="Close media banner"
        >
          <MediaBannerTitle>Media banner</MediaBannerTitle>
          <MediaBannerDescription>Promotional media banner description</MediaBannerDescription>
        </MediaBanner>
      </Section>

      <Section title="Navigation & layout">
        <NavBar>
          <NavBarBackButton onClick={() => undefined} />
          <NavBarTitle>Nav bar</NavBarTitle>
          <NavBarTrailing>
            <IconButton icon={MoreVertical} appearance="transparent" size="sm" aria-label="More" />
          </NavBarTrailing>
        </NavBar>
        <NavBar>
          <NavBarCoinCapsule
            ticker="BTC"
            leadingContent={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="24px" />}
          />
        </NavBar>
        <SectionHeader appearance="plain">
          <SectionHeaderLeading>
            <Spot appearance="icon" icon={Information} size={32} />
          </SectionHeaderLeading>
          <SectionHeaderTitle>Section header</SectionHeaderTitle>
        </SectionHeader>
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>Subheader</SubheaderTitle>
            <SubheaderCount value={12} />
            <SubheaderInfo />
            <SubheaderShowMore />
          </SubheaderRow>
          <SubheaderDescription>Optional subheader description</SubheaderDescription>
        </Subheader>
        <SegmentedControl selectedValue={segment} onSelectedChange={(v) => setSegment(String(v))} tabLayout="fit">
          <SegmentedControlButton value="one">One</SegmentedControlButton>
          <SegmentedControlButton value="two">Two</SegmentedControlButton>
          <SegmentedControlButton value="three">Three</SegmentedControlButton>
        </SegmentedControl>
        <Row>
          <PageIndicator currentPage={2} totalPages={5} />
          <Pagination page={page} totalPages={8} onPageChange={setPage} />
          <Stepper currentStep={2} totalSteps={4} />
        </Row>
        <Divider />
      </Section>

      <Section title="Overlays">
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button appearance="transparent" size="md">
                Open dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader density="compact" title="Dialog" description="Dialog description" />
              <DialogBody>
                <p className="body-2 text-base">Dialog body content</p>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Menu>
            <MenuTrigger render={<IconButton icon={MoreVertical} appearance="transparent" size="md" aria-label="Open menu" />} />
            <MenuContent>
              <MenuItem>First item</MenuItem>
              <MenuItem>Second item</MenuItem>
              <MenuSeparator />
              <MenuItem appearance="red">Delete</MenuItem>
            </MenuContent>
          </Menu>

          <Popover>
            <PopoverTrigger render={<Button appearance="transparent" size="md">Open popover</Button>} />
            <PopoverContent sideOffset={4} align="start">
              <p className="body-2 text-base p-12">Popover content</p>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button appearance="transparent" size="md">
                  Hover tooltip
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Row>

        <Select
          value={selectValue}
          onValueChange={setSelectValue}
          items={SELECT_ITEMS}
        >
          <SelectTrigger
            render={({ selectedContent }) => (
              <Button appearance="transparent" size="md">
                {selectedContent ?? "Select asset"}
              </Button>
            )}
          />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </Section>

      <Section title="Lists & cards">
        <ListItem>
          <ListItemLeading>
            <Spot appearance="icon" icon={Settings} size={48} />
            <ListItemContent>
              <ListItemTitle>List item</ListItemTitle>
              <ListItemDescription>With description</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
          <ListItemTrailing>
            <ChevronBigRight size={16} />
          </ListItemTrailing>
        </ListItem>

        <Card type="info">
          <CardHeader>
            <CardLeading>
              <Spot appearance="icon" icon={Settings} size={40} />
              <CardContent>
                <CardContentTitle>Card title</CardContentTitle>
                <CardContentDescription>Card description</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <ChevronBigRight size={16} />
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardFooterActions>
              <Button appearance="transparent" size="sm">
                Action
              </Button>
            </CardFooterActions>
          </CardFooter>
        </Card>

        <Tile appearance="card" onClick={() => undefined} secondaryAction={<TileSecondaryAction icon={ChevronBigRight} aria-label="Open" />}>
          <TileContent>
            <TileTitle>Tile title</TileTitle>
            <TileDescription>Tile description</TileDescription>
          </TileContent>
        </Tile>

        <MediaCard
          imageUrl="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&q=80"
          onClose={() => undefined}
          closeAriaLabel="Close media card"
        >
          <MediaCardTitle>Media card</MediaCardTitle>
        </MediaCard>

        <DescriptionItem size="md">
          <DescriptionItemLeading>
            <DescriptionItemLabel>Network fees</DescriptionItemLabel>
          </DescriptionItemLeading>
          <DescriptionItemTrailing>
            <DescriptionItemValue>0.001 BTC</DescriptionItemValue>
          </DescriptionItemTrailing>
        </DescriptionItem>
      </Section>

      <Section title="Tables">
        <TableRoot appearance="plain">
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Ticker</TableHeaderCell>
                <TableHeaderCell align="end">Price</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {TABLE_DATA.map((row) => (
                <TableRow key={row.ticker}>
                  <TableCell>
                    <TableCellItem>
                      <TableCellContent>
                        <TableCellContentTitle>{row.name}</TableCellContentTitle>
                      </TableCellContent>
                    </TableCellItem>
                  </TableCell>
                  <TableCell>{row.ticker}</TableCell>
                  <TableCell align="end">{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>

        <DataTableRoot table={dataTable} appearance="plain">
          <DataTableGlobalSearchInput placeholder="Filter table…" />
          <DataTable />
        </DataTableRoot>
      </Section>

      <Section title="Visualization">
        <div className="bg-surface rounded-lg p-16 w-full overflow-hidden">
          <LineChart
            series={LINE_SERIES}
            width={640}
            height={200}
            showArea
            showXAxis
            showYAxis
            enableScrubbing
          >
            <ReferenceLine dataY={60} label="Avg" />
            <Point dataX={9} dataY={90} />
            <Scrubber
              showBeacons
              tooltip={(i) => ({
                title: `Index ${i}`,
                items: [{ label: "Price", value: String(LINE_SERIES[0].data[i] ?? "—") }],
                minWidth: 140,
              })}
            />
          </LineChart>
        </div>

        <DonutChart
          series={DONUT_SERIES}
          size="md"
          ariaLabel="Portfolio allocation"
          renderCenter={() => (
            <DonutChartCenter>
              <DonutChartTitle>100%</DonutChartTitle>
              <DonutChartDescription>Portfolio</DonutChartDescription>
            </DonutChartCenter>
          )}
        />
      </Section>
    </div>
  );
}
