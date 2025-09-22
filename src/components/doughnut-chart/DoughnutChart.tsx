import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);


export default function DoughnutChart({token_names}: { token_names: { name: string; value: number; color: string; short_form: string }[] }) {

    const names = token_names.map((token: { name: string; value: number; color: string; short_form: string }) => {return token.name + " (" + token.short_form + ")"});
    const values = token_names.map((token: { name: string; value: number; color: string }) => token.value);
    const colors = token_names.map((token: { name: string; value: number; color: string }) => token.color);
    const data = {
        labels: names,
        datasets: [
            {
                label: "Votes",
                data: values,
                backgroundColor: colors,
                borderColor: [
                    "#ffffff"
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

  return (
    <>
      <Doughnut data={data} options={options} />
    </>
  )
}
