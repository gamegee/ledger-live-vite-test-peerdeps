import "./App.css";
import { useState } from "react";
import { ThemeProvider, Button, IconButton, SearchInput, Divider } from "@ledgerhq/lumen-ui-react";
import {
  SideBar,
  SideBarLeading,
  SideBarTrailing,
  SideBarItem,
  SideBarCollapseToggle,
} from "@ledgerhq/lumen-ui-react";
import {
  Subheader,
  SubheaderTitle,
  SubheaderRow,
  SubheaderCount,
  SubheaderShowMore,
} from "@ledgerhq/lumen-ui-react";
import {
  Home,
  HomeFill,
  Exchange,
  ExchangeFill,
  Chart5,
  Chart5Fill,
  ArrowDown,
  ArrowUp,
  Plus,
  Minus,
  Refresh,
  Eye,
  ChevronBigRight,
} from "@ledgerhq/lumen-ui-react/symbols";
import { CryptoIcon } from "@ledgerhq/crypto-icons";

const CRYPTOS = [
  { name: "Ethereum", ticker: "ETH", ledgerId: "ethereum", price: "$1,911", balance: "0.0394339 ETH", value: "$393.32", trend: "+1.32%", positive: true },
  { name: "Bitcoin", ticker: "BTC", ledgerId: "bitcoin", price: "$65,997", balance: "0.0094339Z BTC", value: "$320.32", trend: "+13.32%", positive: true },
  { name: "XRP", ticker: "XRP", ledgerId: "ripple", price: "$1.39", balance: "12.324023 XRP", value: "$302.32", trend: "+7.87%", positive: true },
  { name: "Solana", ticker: "SOL", ledgerId: "solana", price: "$80.38", balance: "12.3294034 SOL", value: "$293.31", trend: "+1.32%", positive: true },
  { name: "BNB", ticker: "BNB", ledgerId: "bsc", price: "$597.14", balance: "12.43930 BNB", value: "$103.32", trend: "+0.12%", positive: true },
  { name: "Dodge Coin", ticker: "DOGE", ledgerId: "dogecoin", price: "0.096329", balance: "324.3242 DOGE", value: "$12.32", trend: "+1.22%", positive: true },
];

const STABLECOINS = [
  { name: "USD Coin", ticker: "USDC", ledgerId: "ethereum/erc20/usd__coin_(usdc)", price: "$0.999634", balance: "100.324234 USDC", value: "$100.32", trend: "+0.01%", positive: true },
  { name: "Tether USD", ticker: "USDT", ledgerId: "ethereum/erc20/usd_tether__erc20_", price: "$0.999903", balance: "1.324234 USDT", value: "$1.32", trend: "+0.01%", positive: false },
];

const MARKET_TILES = [
  { name: "Shiba inu", ledgerId: "ethereum/erc20/shiba_inu", ticker: "SHIB", change: "+23.12%", positive: true },
  { name: "ETH", ledgerId: "ethereum", ticker: "ETH", change: "+12.32%", positive: true },
  { name: "TRX", ledgerId: "tron", ticker: "TRX", change: "+11.32%", positive: true },
  { name: "Near", ledgerId: "near", ticker: "NEAR", change: "+8.32%", positive: true },
  { name: "SOL", ledgerId: "solana", ticker: "SOL", change: "+2.32%", positive: true },
  { name: "ADA", ledgerId: "cardano", ticker: "ADA", change: "+1.24%", positive: true },
  { name: "Magic", ledgerId: "ethereum/erc20/magic", ticker: "MAGIC", change: "+0.32%", positive: true },
  { name: "BTC", ledgerId: "bitcoin", ticker: "BTC", change: "-0.32%", positive: false },
  { name: "Flow", ledgerId: "flow", ticker: "FLOW", change: "-0.52%", positive: false },
  { name: "Aave", ledgerId: "ethereum/erc20/aave", ticker: "AAVE", change: "-0.47%", positive: false },
];

function CreditCard({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 6.25H17.5M5 12.5H8.33M3.33 4.17H16.67C17.13 4.17 17.5 4.54 17.5 5V15C17.5 15.46 17.13 15.83 16.67 15.83H3.33C2.87 15.83 2.5 15.46 2.5 15V5C2.5 4.54 2.87 4.17 3.33 4.17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Clock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 5V10L13 12M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wallet({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.67 8.33V5.83C16.67 5.37 16.3 5 15.83 5H4.17C3.25 5 2.5 4.25 2.5 3.33M2.5 3.33C2.5 2.41 3.25 1.67 4.17 1.67H14.17M2.5 3.33V15C2.5 16.38 3.62 17.5 5 17.5H15.83C16.3 17.5 16.67 17.13 16.67 16.67V11.67M17.5 8.33H13.33C12.41 8.33 11.67 9.08 11.67 10C11.67 10.92 12.41 11.67 13.33 11.67H17.5V8.33Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssetTable({ assets, title, count }: { assets: typeof CRYPTOS; title: string; count?: number }) {
  return (
    <div className="flex flex-col gap-12 items-start w-full">
      {count !== undefined ? (
        <Subheader>
          <SubheaderRow>
            <SubheaderTitle>{title}</SubheaderTitle>
            <SubheaderCount value={count} />
            <SubheaderShowMore />
          </SubheaderRow>
        </Subheader>
      ) : (
        <h2 className="heading-4-semi-bold text-base">{title}</h2>
      )}

      <div className="bg-surface rounded-lg overflow-hidden w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-12 body-3 text-base">Name</th>
              <th className="text-right p-12 body-3 text-base">Price</th>
              <th className="text-right p-12 body-3 text-base">Balance</th>
              <th className="text-right p-12 body-3 text-base">Value</th>
              <th className="text-right p-12 body-3 text-base">
                <span className="flex items-center justify-end gap-4">
                  <span className="size-16 flex items-center justify-center text-muted">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 4V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
                    </svg>
                  </span>
                  1D Trend
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.ticker} className="h-64">
                <td className="p-12">
                  <div className="flex items-center gap-12">
                    <CryptoIcon ledgerId={asset.ledgerId} ticker={asset.ticker} size="40px" />
                    <div className="flex flex-col gap-4">
                      <span className="body-2 text-base">{asset.name}</span>
                      <span className="body-3 text-muted">{asset.ticker}</span>
                    </div>
                  </div>
                </td>
                <td className="p-12 text-right body-2 text-base">{asset.price}</td>
                <td className="p-12 text-right body-2 text-base">{asset.balance}</td>
                <td className="p-12 text-right body-2 text-base">{asset.value}</td>
                <td className={`p-12 text-right body-2 ${asset.positive ? "text-success" : "text-error"}`}>
                  {asset.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <ThemeProvider colorScheme="dark">
      <div className="bg-canvas min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between pl-[86px] pr-32 pt-32 pb-24 relative z-10">
          <div className="flex items-center gap-[86px]">
            <svg width="100" height="34" viewBox="0 0 100 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0.5H5.5V27.76H19.07V33.13H0V0.5ZM22.37 0.5H42.11V5.87H27.87V14.06H40.37V19.43H27.87V27.76H42.24V33.13H22.37V0.5ZM45.81 16.87C45.81 7.5 52.87 0 62.12 0C67.87 0 72.12 2.62 74.75 6.62L70 9.37C68.25 6.5 65.37 4.87 62.12 4.87C55.87 4.87 51.37 9.87 51.37 16.75C51.37 23.62 55.87 28.75 62.12 28.75C65.37 28.75 68.25 27.12 70 24.25L74.75 26.87C72 31 67.87 33.63 62.12 33.63C52.87 33.63 45.81 26.25 45.81 16.87ZM76.56 16.87C76.56 7.5 83.56 0 92.93 0C97.43 0 100 1.37 100 1.37V6.75C100 6.75 97.37 5 93.18 5C86.93 5 82.18 10 82.18 16.87C82.18 23.75 86.93 28.75 93.18 28.75C97.37 28.75 100 27 100 27V32.25C100 32.25 97.43 33.63 92.93 33.63C83.56 33.63 76.56 26.25 76.56 16.87Z" fill="currentColor" className="text-base" />
            </svg>
            <SearchInput placeholder="Search asset, Dapps" className="w-[454px]" />
          </div>
          <div className="flex items-center gap-12">
            <IconButton icon={Refresh} appearance="transparent" size="md" aria-label="Refresh" />
            <IconButton icon={Eye} appearance="transparent" size="md" aria-label="Toggle visibility" />
            <Button appearance="transparent" size="md" icon={Clock}>
              History
            </Button>
            <div className="bg-muted-transparent size-40 rounded-full overflow-hidden flex items-center justify-center">
              <div className="size-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" />
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex gap-32 px-32 flex-1">
          {/* Sidebar */}
          <SideBar active={activeNav} onActiveChange={setActiveNav}>
            <SideBarLeading>
              <SideBarItem value="home" icon={Home} activeIcon={HomeFill} label="Home" />
              <SideBarItem value="swap" icon={Exchange} activeIcon={ExchangeFill} label="Swap" />
              <SideBarItem value="earn" icon={Chart5} activeIcon={Chart5Fill} label="Earn" />
              <SideBarItem value="card" icon={CreditCard} activeIcon={CreditCard} label="Card" />
            </SideBarLeading>
            <SideBarTrailing>
              <SideBarCollapseToggle />
            </SideBarTrailing>
          </SideBar>

          {/* Content area */}
          <main className="flex flex-col gap-40 flex-1 pb-40">
            {/* Header Section */}
            <div className="flex flex-col gap-24">
              <h1 className="heading-4-semi-bold text-base">Home</h1>

              {/* Balance */}
              <div className="flex gap-12 items-end">
                <div className="flex items-center gap-4">
                  <span className="heading-1-semi-bold text-base">$</span>
                  <span className="heading-1-semi-bold text-base">2 258</span>
                  <span className="heading-2-semi-bold text-muted pb-2">.93</span>
                </div>
                <div className="flex items-center gap-2 py-4">
                  <span className="body-2 text-success">+7.87%</span>
                  <span className="body-2 text-base">· Today</span>
                  <ChevronBigRight size={16} className="text-base" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-12">
                <Button appearance="base" size="md" icon={ArrowDown}>
                  Receive
                </Button>
                <Button appearance="transparent" size="md" icon={Plus}>
                  Buy
                </Button>
                <Button appearance="transparent" size="md" icon={Minus}>
                  Sell
                </Button>
                <Button appearance="transparent" size="md" icon={ArrowUp}>
                  Send
                </Button>
              </div>
            </div>

            <Divider />

            {/* Explore Market */}
            <div className="flex flex-col gap-12 overflow-hidden">
              <Subheader>
                <SubheaderRow>
                  <SubheaderTitle>Explore market</SubheaderTitle>
                  <SubheaderShowMore />
                </SubheaderRow>
              </Subheader>

              <div className="flex gap-8 overflow-x-auto">
                {MARKET_TILES.map((tile) => (
                  <div
                    key={tile.name}
                    className="bg-surface flex flex-col gap-8 items-center justify-center px-8 py-12 rounded-lg shrink-0 w-[98px]"
                  >
                    <CryptoIcon ledgerId={tile.ledgerId} ticker={tile.ticker} size="40px" />
                    <div className="flex flex-col gap-2 items-center w-full text-center">
                      <span className="body-2-semi-bold text-base truncate w-full">{tile.name}</span>
                      <span className={`body-3 ${tile.positive ? "text-success" : "text-error"}`}>
                        {tile.change}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center self-stretch">
                  <div className="bg-surface flex flex-col gap-8 items-center justify-center px-8 py-12 rounded-lg shrink-0 w-[98px] h-full">
                    <div className="bg-muted-transparent size-40 rounded-full flex items-center justify-center">
                      <ChevronBigRight size={16} className="text-base" />
                    </div>
                    <span className="body-2-semi-bold text-base text-center">View all</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptos Table */}
            <AssetTable assets={CRYPTOS} title="Cryptos" count={30} />

            {/* Stablecoins Table */}
            <AssetTable assets={STABLECOINS} title="Stablecoins" />

            {/* Crypto Addresses Card */}
            <div className="bg-surface rounded-lg overflow-hidden w-full">
              <div className="flex items-center gap-12 px-12 h-64">
                <div className="bg-muted-transparent size-48 rounded-full flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="body-2-semi-bold text-base">Crypto addresses</span>
                  <span className="body-3 text-muted">8 addresses</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
