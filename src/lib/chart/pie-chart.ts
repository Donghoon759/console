import {
    SChart, SettingsInterface, tooltips,
} from '@/lib/chart/s-chart';
import { Chart } from 'chart.js';
import { black, white } from '@/styles/colors';
import _ from 'lodash';

interface SPieChartInterface {
    showTotalCount: boolean;
    showEmptyShape: boolean;
    setShowTotalCount: (...args) => SPieChartInterface;
    setShowEmptyShape: (...args) => SPieChartInterface;
}

const pieChartSettings: SettingsInterface = {
    metaDatasets: {
        borderWidth: 2,
        borderColor: white,
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 0,
                right: 10,
                top: 10,
                bottom: 0,
            },
        },
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
            }],
        },
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
        responsive: true,
        cutoutPercentage: 65,
        aspectRatio: 1,
        tooltips,
    },
    plugins: [{
        beforeDraw(chart: SPieChart): void {
            const ctx: CanvasRenderingContext2D = chart.ctx as CanvasRenderingContext2D;
            if (!ctx) return;

            if (chart.showTotalCount) {
                const totalCount: number = chart.isNoData ? 0 : _.sumBy(chart.data?.datasets, ds => _.sum(ds.data) || 0);
                const txt = `${totalCount}`;

                ctx.font = '2rem Roboto';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.fillStyle = black;

                ctx.fillText(txt, centerX, centerY);
            }
        },
    }],
};

export class SPieChart extends SChart implements SPieChartInterface {
    showTotalCount: boolean;

    showEmptyShape: boolean;

    isNoData: boolean | undefined;

    constructor(canvas: HTMLCanvasElement, config: Chart.ChartConfiguration = {}) {
        super(canvas, SPieChart.initConfig('pie', pieChartSettings, config));
        this.metaDatasets = { ...this.metaDatasets, ...pieChartSettings.metaDatasets };
        this.showTotalCount = true;
        this.showEmptyShape = true;
    }

    setShowTotalCount(show: boolean): this {
        this.showTotalCount = show;
        return this;
    }

    setShowEmptyShape(show: boolean): this {
        this.showEmptyShape = show;
        return this;
    }

    protected setEmptyDatasets(): void {
        if (this.isNoData) {
            // disable tooltips
            if (this.options.tooltips) this.options.tooltips.enabled = false;
            else this.options.tooltips = { enabled: false };

            // datasets update
            this.data?.datasets?.forEach((ds, i, origin) => {
                if (ds.data) origin[i].data = new Array(ds.data.length).fill(1);
            });
        }
    }

    apply(): this {
        this.data.datasets = this.data.datasets?.map((ds, i) => ({ ...ds, ...this.metaDatasets }));
        this.isNoData = this.data?.datasets?.every(ds => (ds.data ? ds.data.every(d => d === 0) : true));
        if (this.showEmptyShape) this.setEmptyDatasets();
        this.update();
        return this;
    }
}
