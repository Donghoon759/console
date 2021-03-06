import {
    toRefs, reactive, ref, computed,
} from '@vue/composition-api';
import { action } from '@storybook/addon-actions';
import {
    text, number, select, object, boolean,
} from '@storybook/addon-knobs/vue';
import PTopProjects from './TopProjects.vue';

export default {
    title: 'views/widgets/TopProjects',
    component: PTopProjects,
    parameters: {
        info: {
            summary: '',
            components: { PTopProjects },
        },
        knobs: { escapeHTML: false },
    },
};

/**
 * propName: {
 *      default: object('propName', {}),
 * }
 */
const getProps = () => ({});

const getState = (props, context) => {
    const state = reactive({});

    return state;
};

export const defaultCase = () => ({
    components: { PTopProjects },
    props: getProps(),
    template: `
    <div style="width: 80vw;">
        <PTopProjects v-bind="$props"></PTopProjects>
    </div>`,
    setup(props, context) {
        const state = getState(props, context);

        return {
            ...toRefs(state),
        };
    },
});
