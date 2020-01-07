<template>
    <div class="p-dict-input-group row ">
        <div v-for="(pair, index) in destructDict"
             :key="index"
             :class="{'dict-input-form': true, 'mr-0': true, 'col-6': !useFullCol, 'col-12': useFullCol}"
        >
            <p-icon-button v-if="editMode" class="delete-btn" name="ic_delete"
                           @click="deletePair(index)"
            />
            <span class="data" @mouseleave="mouseInOut(index, false)">
                <p-dict-input :name="pair.name"
                              :value="pair.value"
                              :disabled="!editMode"
                              @mouseenter="mouseInOut(index, true)"
                              @update:name="updatePair(index, 'name', $event)"
                              @update:value="updatePair(index, 'value', $event)"
                />
                <p-copy-button v-if="getActiveState(index) && !editMode" class="copy-btn" :value="pair.value" />
            </span>
        </div>

        <div v-if="editMode" :class="{'dict-input-form': true, 'mr-0': true, 'col-6': !useFullCol, 'col-12': useFullCol}">
            <!--<p-icon-button
                class="delete-btn"
                name="ic_delete"
                @click="reset"
            />-->
            <!--<div v-show="validateTag" style="display:block" class="invalid-feedback">
                 * {{ $t('ORGANISMS.TAG_EMPTY') }}
            </div>-->
            <!-- <p-dict-input :name.sync="newPair.name" :value.sync="newPair.value" />-->
            <p-icon-button
                class="add-btn"
                button-style="dark"
                name="ic_plus"
                color="transparent white"
                @click="addPair"
            />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import {
    toRefs, reactive, ref, watch, computed,
} from '@vue/composition-api';
import PDictInput from '@/components/molecules/forms/dict-input/DictInput.vue';
import PIconButton from '@/components/molecules/buttons/IconButton.vue';
import PCopyButton from '@/components/molecules/buttons/CopyButton.vue';

const mergeDict = dict => _.transform(dict, (result, pair) => {
    result[pair.name] = pair.value;
}, {});

const destruct = dict => _.transform(dict, (result, value, name) => {
    result.push(({ name, value }));
}, []);

const useDictBuffer = (props, context) => {
    const destructDict = ref(destruct(props.dict));
    const state = reactive({
        validatePassWord: false,
    });

    const syncDict = () => {
        context.emit('update:dict', mergeDict(destructDict.value));
        context.emit('change');
    };

    const updatePair = (index, position, value) => {
        destructDict.value[index][position] = value;
        syncDict();
    };

    const deletePair = (index) => {
        destructDict.value.splice(index, 1);
        syncDict();
    };
    const copyText = (event) => {
        const rawText = event.target.parentElement.innerText;
        const copyLength = this.tr('COMMON.COPY').length;
        const text = rawText.slice(0, -copyLength).trim();
        this.selectToCopyToClipboard(text);
    };
    watch(() => props.dict, (dict) => {
        if (dict !== mergeDict(destructDict.value)) {
            destructDict.value = destruct(dict);
        }
    });
    return {
        destructDict,
        syncDict,
        updatePair,
        deletePair,
        copyText,
    };
};
const useNewPair = (props, context, dictBuffer) => {
    const newPair = reactive({
        name: '',
        value: '',
    });
    const reset = () => {
        newPair.name = '';
        newPair.value = '';
    };
    const addPair = (idx) => {
        dictBuffer.destructDict.value.push(reactive({ ...newPair }));
        dictBuffer.syncDict();
        reset();
    };
    return {
        newPair,
        addPair,
        reset,
    };
};

const setPairCopy = () => {
    const state = reactive({
        currentIdx: null,
    });

    const mouseInOut = (idx, flag) => {
        if (flag) {
            state.currentIdx = idx;
        } else {
            state.currentIdx = null;
        }
    };

    const getActiveState = idx => state.currentIdx === idx;

    return {
        ...toRefs(state),
        mouseInOut,
        getActiveState,
    };
};

export const setup = (props, context) => {
    const dictBuffer = useDictBuffer(props, context);
    const newPairState = useNewPair(props, context, dictBuffer);
    const pairCopyState = setPairCopy();

    return {
        ...dictBuffer,
        ...newPairState,
        ...pairCopyState,
    };
};

export default {
    name: 'PDictInputGroup',
    components: { PDictInput, PIconButton, PCopyButton },
    events: ['update:dict', 'change'],
    props: {
        editMode: {
            type: Boolean,
            default: false,
        },
        useFullCol: {
            type: Boolean,
            default: false,
        },
        dict: {
            type: Object,
        },

    },
    setup(...args) {
        return setup(...args);
    },
};
</script>

<style lang="scss" scoped>
    p-dict-input-group{
        display: flex;
        flex-wrap:  wrap;
    }
    .btn{
        flex: none;
    }
    .delete-btn{
        margin-left: 0.5rem;
    }
    .add-btn{
        margin-left: 0.5rem;
    }
    p-dict-input{
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: auto;
    }
    .new-dict-input-form{
        flex-wrap: nowrap;
        white-space: nowrap;
    }
    .dict-input-form{
        display: inline-flex;
        flex-wrap: nowrap;
        white-space: nowrap;
        flex-shrink: 1;
        margin-bottom: 0.5rem;
        &:not(.new-form){
            margin-right: 2.5rem;
        }
    }
    .data{
        display: block;
        width: 100%;
    }
    .copy-btn::v-deep{
        .p-copy-btn{top:-.3rem;
            margin-bottom: 8px;
        }
    }
</style>