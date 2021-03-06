<template>
    <general-page-layout>
        <p-horizontal-layout>
            <template #container="{ height }">
                <p-dynamic-view view_type="query-search-table"
                                :api-handler="apiHandler"
                                :data_source="dataSource"
                                :vbind="{responsiveStyle:{'height': height+'px', 'overflow-y':'auto','overflow-x':'auto'}}"
                                :data="null"
                >
                    <template #col-managed-format="data">
                        <p-button style-type="primary" :disabled="!data.item.managed" @click="recovery(data.item)">
                            Recovery
                        </p-button>
                    </template>
                </p-dynamic-view>
            </template>
        </p-horizontal-layout>
        <PTab v-if="apiHandler.tableTS.selectState.isSelectOne" :tabs="singleItemTab.state.tabs" :active-tab.sync="singleItemTab.syncState.activeTab">
            <template #detail>
                <PDynamicDetails
                    :details="pluginDetails"
                    :data="apiHandler.tableTS.selectState.firstSelectItem"
                />
                <p-dict-panel :dict.sync="apiHandler.tableTS.selectState.firstSelectItem.tags" />
            </template>
            <template #rawData>
                <p-raw-data :item="apiHandler.tableTS.selectState.firstSelectItem" />
            </template>
        </PTab>
        <PTab v-else-if="apiHandler.tableTS.selectState.isSelectMulti"
              :tabs="multiItemTab.state.tabs"
              :active-tab.sync="multiItemTab.syncState.activeTab"
        >
            <template #data>
                <p-dynamic-view
                    view_type="simple-table"
                    :data_source="dataSource"
                    :data="apiHandler.tableTS.selectState.selectItems"
                />
            </template>
        </PTab>
        <p-empty v-else class="header">
            No Selected Item
        </p-empty>
    </general-page-layout>
</template>

<script lang="ts">
/* eslint-disable camelcase */


import { computed, defineComponent } from '@vue/composition-api';
import PHorizontalLayout from '@/components/organisms/layouts/horizontal-layout/HorizontalLayout.vue';
import PDynamicView from '@/components/organisms/dynamic-view/dynamic-view/DynamicView.vue';
import PDynamicDetails from '@/components/organisms/dynamic-view/dynamic-details/DynamicDetails.vue';


import PTab from '@/components/organisms/tabs/tab/Tab.vue';
import PButton from '@/components/atoms/buttons/Button.vue';
import PDropdownMenuBtn from '@/components/organisms/dropdown/dropdown-menu-btn/DropdownMenuBtn.vue';
import PQuerySearchTags from '@/components/organisms/search/query-search-tags/QuerySearchTags.vue';
import { makeTrItems } from '@/lib/view-helper';
import PRawData from '@/components/organisms/text-editor/raw-data/RawData.vue';
import PHr from '@/components/atoms/hr/Hr.vue';
import PRow from '@/components/atoms/grid/row/Row.vue';
import PEmpty from '@/components/atoms/empty/Empty.vue';
import { SearchQuery } from '@/components/organisms/search/query-search-bar/autocompleteHandler';
import SProjectTreeModal from '@/components/organisms/modals/tree-api-modal/ProjectTreeModal.vue';
import { QuerySearchTableToolSet } from '@/components/organisms/tables/toolbox-table/toolset';
import { QuerySearchTableACHandler } from '@/lib/api/auto-complete';
import { DataSourceItem, fluentApi, Tags } from '@/lib/fluent-api';
import { QuerySearchTableFluentAPI } from '@/lib/api/table';
import { AxiosResponse } from 'axios';
import { CloudServiceListResp } from '@/lib/fluent-api/inventory/cloud-service';
import { TabBarState } from '@/components/molecules/tabs/tab-bar/toolset';
import GeneralPageLayout from '@/views/containers/page-layout/GeneralPageLayout.vue';
import PDictPanel from '@/components/organisms/panels/dict-panel/DictPanel_origin.vue';

export default {
    name: 'Supervisor',
    components: {
        PHorizontalLayout,
        PDynamicView,
        PTab,
        PButton,
        PRawData,
        PDynamicDetails,
        PEmpty,
        GeneralPageLayout,
        PDictPanel,
    },
    props: {
        queryString: {
            type: String,
            default: '',
        },
    },
    setup(props, context) {
        const singleItemTab = new TabBarState({
            tabs: makeTrItems([
                ['detail', 'TAB.DETAILS'],
                ['rawData', 'TAB.RAW_DATA'],
            ]),
        });
        singleItemTab.syncState.activeTab = 'detail';

        const multiItemTab = new TabBarState({
            tabs: makeTrItems([
                ['data', 'TAB.DATA'],
            ]),
        });
        multiItemTab.syncState.activeTab = 'data';
        const pluginKeyAutoCompletes = ['plugin_id', 'version', 'endpoint'];
        const pluginACHandlerMeta = {
            handlerClass: QuerySearchTableACHandler,
            args: {
                keys: pluginKeyAutoCompletes,
                suggestKeys: pluginKeyAutoCompletes,
            },
        };

        const pluginList = fluentApi.plugin().supervisorPlugin().list();
        // .setOnly(...onlyFields);

        const apiHandler = new QuerySearchTableFluentAPI(
            pluginList,
            { selectable: false },

            undefined,
            pluginACHandlerMeta,
        );

        const dataSource: DataSourceItem[] = [
            { name: 'plugin_id', key: 'plugin_id' },
            { name: 'version', key: 'version' },
            { name: 'endpoint', key: 'endpoint' },
            { name: 'supervisor', key: 'supervisor_name' },
            { name: 'supervisor_id', key: 'supervisor_id' },
            { name: 'recovery', key: 'managed' },
        ];

        const pluginDetails = [
            {
                name: 'Base Information',
                data_source: dataSource,
            },
        ];
        const btnDisabled = computed(() => {
            if (!apiHandler.tableTS.selectState.isNotSelected
                && apiHandler.tableTS.selectState.selectItems.every(item => item.managed === true)) {
                return true;
            }
            return false;
        });
        const recovery = (item) => {
            fluentApi.plugin().supervisorPlugin().recovery().setSubIds([
                { plugin_id: item.plugin_id, version: item.version },
            ])
                .setId(item.supervisor_id)
                .execute()
                .then(() => {
                    context.root.$notify({
                        group: 'noticeBottomRight',
                        type: 'success',
                        title: 'success',
                        duration: 2000,
                        speed: 1000,
                    });
                })
                .catch(() => {
                    context.root.$notify({
                        group: 'noticeBottomRight',
                        type: 'alert',
                        title: 'Fail',
                        text: 'request Fail',
                        duration: 2000,
                        speed: 1000,
                    });
                })
                .finally(() => {
                    apiHandler.getData();
                });
        };


        apiHandler.getData();
        return {
            apiHandler,
            dataSource,
            singleItemTab,
            pluginDetails,
            multiItemTab,
            btnDisabled,
            recovery,
        };
    },
};
</script>

<style scoped>

</style>
