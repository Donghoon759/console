import {
    onUnmounted, ref, Ref, watch,
} from '@vue/composition-api';
import {
    HelperToolSet, initReactive, optionalType,
} from '@/lib/toolset';
import { SChart } from '@/lib/chart/s-chart';
import { ChartConfiguration } from 'chart.js';

interface ChartStateType<C> {
    chartRef: null | HTMLCanvasElement;
    chart: C | null;
}


@HelperToolSet()
export class SChartToolSet<C extends SChart, D=any> {
    state: optionalType<ChartStateType<C>, D>;

    ChartClass: new (...args) => C;

    draw: (chart: C) => C;

    // eslint-disable-next-line no-empty-function
    static initToolSet(): void {}

    constructor(
        ChartClass: new (...args) => C,
        draw: (chart: C) => C = (chart: C) => chart,
        initData: D = {} as D,
        config: ChartConfiguration = {},
    ) {
        this.state = initReactive<optionalType<ChartStateType<C>, D>>(false, {
            chartRef: null,
            chart: null,
        }, initData);

        this.ChartClass = ChartClass;
        this.draw = draw;

        onUnmounted(() => {
            if (this.state.chart) this.state.chart.destroy();
        });

        watch(() => this.state.chartRef, (val) => {
            if (val) {
                this.state.chart = new this.ChartClass(val, config);
                this.draw(this.state.chart);
            }
        }, {
            lazy: true,
        });
    }
}
