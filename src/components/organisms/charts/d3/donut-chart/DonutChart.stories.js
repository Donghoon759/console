// eslint-disable-next-line import/no-extraneous-dependencies,import/extensions
import countries from 'countries-and-timezones';
import PDonutChart from '@/components/organisms/charts/d3/donut-chart/DonutChart.vue';
import { autoProps } from '@sb/storybook-util';
import { sampleDataGenerator } from '@/components/organisms/charts/d3/donut-chart/DonutChart.map';

export default {
    title: 'organisms/charts/d3/donut-chart',
    component: PDonutChart,
    parameters: {
        centered: { disable: true },
    },
};

export const defaultCase = () => ({
    components: { PDonutChart },
    props: {
        ...autoProps(PDonutChart),
    },
    template: `<div style="display: inline-block; position: relative;
                           height: 600px; width: 600px;"
               >
                    <button style="position: absolute; 
                                    top: 100px; left: 50px;"
                            @click="refresh"
                    >refresh</button>
                    <div style="position: absolute; 
                                top: 150px; left: 50px;
                                border: 1px solid lightgray;"
                    >
                        <p-donut-chart v-bind="$props" :data="chartData" :loading="loadingChartData"/>
                    </div>
               </div>`,
    data() {
        return {
            chartData: [],
            loadingChartData: true,
        };
    },
    methods: {
        refresh() {
            this.loadingChartData = true;
            setTimeout(() => {
                this.chartData = sampleDataGenerator();
                this.loadingChartData = false;
            }, 1000);
        },
    },
});
