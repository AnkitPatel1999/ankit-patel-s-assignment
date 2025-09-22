import { useEffect, useState } from "react";
import DoughnutChart from "../doughnut-chart/DoughnutChart"
import "./hero.css"
import { useSelector } from "react-redux";
import type { coinsForDoughnutChart } from "../../dto/coingecko-types"


export default function Hero() {

  const [portfolioTotal, setPortfolioTotal] = useState<string>("$000");
  let coinsWatchlist = useSelector((state: any) => state.watchlist);

  // colors for the chart
  const chartColors = [
    "#10B981", "#A78BFA", "#60A5FA", "#18C9DD", "#FB923C", "#FB7185",
    "#B9FF66", "#FFD700", "#FFB6C1", "#00CED1", "#FF7F50", "#7FFF00",
    "#FF69B4", "#6495ED", "#FF4500", "#40E0D0", "#DA70D6", "#32CD32",
    "#FFDAB9", "#BA55D3", "#87CEEB", "#FF6347", "#3CB371", "#FF1493",
    "#1E90FF", "#ADFF2F", "#FF8C00", "#20B2AA", "#9370DB", "#98FB98"
  ];


  const computedCoins = (coinsWatchlist || []).map((coin: any, idx: number): coinsForDoughnutChart => {
    const price = Number(coin.price?.replace(/[$,]/g, "")) || 0;
    const holding = Number(coin.holding ?? 0);
    const value = price * holding;
    return {
      name: coin.name,
      short_form: coin.symbol,
      value,
      color: chartColors[idx % chartColors.length],
      holding,
      price,
    };
  }).filter((token: coinsForDoughnutChart) => token.value > 0);

  const totalOfPortfolio = computedCoins.reduce((acc: number, token: coinsForDoughnutChart) => acc + token.value, 0);

  useEffect(() => {
    setPortfolioTotal("$" + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalOfPortfolio));
  }, [totalOfPortfolio]);

  return (
    <>
      <div className="ae-d-flex cu-hero-container">
        <div className="ae-d-flex ae-f-column ae-justify-space-between cu-hero-common-block cu-hero-total-block">
          <div className="">
            <div className="cu-hero-title">Portfolio Total</div>
            <div className="cu-hero-value" title={portfolioTotal}>{portfolioTotal}</div>
          </div>
          <span className="cu-hero-last-updated-time">Last updated: 3:42:12 PM</span>
        </div>
        <div className="cu-hero-common-block cu-hero-graph-block">
          <div className="cu-hero-title">Portfolio Distribution</div>
          <div className="ae-d-flex ae-mt-20 cu-hero-graph-container">
            <div className="cu-doughnut-chart-container ">
              <DoughnutChart token_names={computedCoins} />
            </div>
            <div className="ae-d-flex ae-f-column cu-token-name-container">
              {computedCoins.map((token: coinsForDoughnutChart, index: number) => (
                <div key={index} className="ae-d-flex ae-justify-space-between ae-align-center cu-hero-token-row">
                  <div className="ae-d-flex ae-align-center ae-gap-10">
                    <div className="cu-hero-token-name" style={{ color: token.color }}>{token.name} ({token.short_form})</div>
                  </div>
                  <div className="cu-hero-token-percentage">
                    {totalOfPortfolio > 0
                      ? ((token.value / totalOfPortfolio) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"
                      : "0.00%"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
