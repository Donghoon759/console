import HorizontalLayout from '@/components/organisms/layouts/horizontal-layout/HorizontalLayout';
import { action } from '@storybook/addon-actions';
import { autoProps } from '@sb/storybook-util';

export default {
    title: 'Organisms/layouts/Horizontal-layout',
    component: HorizontalLayout,
};

export const defaultCase = () => ({
    components: { HorizontalLayout },
    props: {
        ...autoProps(HorizontalLayout),
    },
    template: `<div style="border: 1px solid red;">
                   <p-vertical-layout :height="height" 
                                      :line="line" 
                                      :left-width="leftWidth"
                                      :min-left-width="minLeftWidth"
                                      :max-left-width="maxLeftWidth"
                                      :total-width="totalWidth"
                                      :hide-f-n-b="hideFNB"
                                      @start="start" 
                                      @move="move" 
                                      @stop="stop" />
                </div>`,
    methods: {
        start: action('start'),
        move: action('move'),
        stop: action('stop'),
    },
});
