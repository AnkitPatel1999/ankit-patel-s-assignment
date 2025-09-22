import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface SparklineChartProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
}

export default function SparklineChart({ data, color = '#000000', width = 100, height = 30 }: SparklineChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !data || data.length === 0) return;

        // Destroy existing chart if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, index) => index.toString()),
                datasets: [
                    {
                        data: data,
                        borderColor: color,
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                elements: {
                    line: {
                        borderColor: color,
                        borderWidth: 1
                    },
                    point: {
                        radius: 0,
                        hoverRadius: 0
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, color]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width: `${width}px`, height: `${height}px` }}
        />
    );
}
