import DoughnutChart from "../doughnut-chart/DoughnutChart"
import "./hero.css" 

export default function Hero() {

const token_names = [
  { name: "Bitcoin", short_form: "BTC", value: 21.0 , color: "#10B981" },
  { name: "Ethereum", short_form: "ETH", value: 18.0 , color: "#A78BFA" },
  { name: "Solana", short_form: "SOL", value: 15.0 , color: "#60A5FA" },
  { name: "Dogecoin", short_form: "DOGE", value: 10.0 , color: "#18C9DD" },
  { name: "Cardano", short_form: "ADA", value: 8.0 , color: "#FB923C" },
  { name: "Ripple", short_form: "XRP", value: 7.0 , color: "#FB7185" }
];

  return (
    <>

      <div className="ae-d-flex cu-hero-container">
        <div className="ae-d-flex ae-f-column ae-justify-space-between cu-hero-common-block cu-hero-total-block">
            <div className="">
                <div className="cu-hero-title">Portfolio Total</div>
                <div className="cu-hero-value">$10,275.08</div>
            </div>
            <span className="cu-hero-last-updated-time">Last updated: 3:42:12 PM</span>
        </div>
        <div className="cu-hero-common-block cu-hero-graph-block">
            <div className="cu-hero-title">Portfolio Total</div>
            <div className="ae-d-flex ae-mt-20">
              <div className="cu-doughnut-chart-container ">
                  <DoughnutChart token_names={token_names} />
              </div>
              <div className="ae-d-flex ae-f-column cu-token-name-container">
                {token_names.map((token, index) => (
                  <div key={index} className="ae-d-flex ae-justify-space-between ae-align-center cu-hero-token-row">
                    <div className="ae-d-flex ae-align-center ae-gap-10">
                      <div className="cu-hero-token-name" style={{ color: token.color }}>{token.name} ({token.short_form})</div>
                    </div>
                    <div className="cu-hero-token-percentage">{token.value}%</div>
                  </div>
                ))}

              </div>
            </div>
        </div>
      </div>


    </>
  )
}
