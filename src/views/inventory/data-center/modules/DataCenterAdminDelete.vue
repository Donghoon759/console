<template>
    <div class="animated fadeIn">
        <p-button-modal
            ref="modal"
            :theme-color="'alert'"
            :scrollable="true"
            :centered="true"
            :size="'xl'"
            :fade="true"
            :backdrop="true"
            :header-title="getMemberModalTitle"
            :visible.sync="visible"
            :footer-cancel-button-bind="buttons.cancelButton"
            :footer-confirm-button-bind="buttons.confirmButton"
            @close="close"
            @confirm="confirm"
        >
            <template #body>
                <div class="delete-alert">
                    {{$t('IDENTITY.DEL_MEMBER_PRJ', [$t(getSelectedTypeKey)] ) }}
                </div>
                <p-data-table
                    :responsive-style="{'height': '35vh', 'overflow-y':'auto', 'box-shadow': 'none', 'border':'none'}"
                    :items="memberToDelete"
                    :fields="selectedFields"
                    :hover="true"
                >
                    <template v-slot:col-user_id-format="data">
                        {{ data.item.user_info.user_id }}
                    </template>
                    <template v-slot:col-name-format="data">
                        {{ data.item.user_info.name }}
                    </template>
                    <template v-slot:col-email-format="data">
                        {{ data.item.user_info.email }}
                    </template>
                    <template v-slot:col-labels-format="data">
                        <div>
                            <PBadge v-for="(label, idx) in data.item.labels" :key="idx"
                                    class="p-label"
                                    style-type="gray200"
                            >
                                {{ getEmptyString(label) }}
                            </PBadge>
                        </div>
                    </template>
                </p-data-table>
            </template>
            <template #close-button>
                {{$t('BTN.CANCEL') }}
            </template>
            <template #confirm-button>
                {{$t('BTN.DELETE') }}
            </template>
        </p-button-modal>
    </div>
</template>
<script>
import _ from 'lodash';
import PButtonModal from '@/components/organisms/modals/button-modal/ButtonModal';
import PDataTable from '@/components/organisms/tables/data-table/DataTable';
import PBadge from '@/components/atoms/badges/Badge';
import {defaultQuery} from "@/lib/api/query";

export default {
    name: 'ProjectMemberDelete',
    events: ['close'],
    components: {
        PButtonModal,
        PDataTable,
        PBadge,
    },
    props: {
        referenceMember: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            visible: false,
            memberToDelete: [],
            searchText: null,
            selectable: true,
            sortable: true,
            selectIndex: [],
            buttons: {
                cancelButton: {
                    styleType: 'gray900',
                    outline: true,
                },
                confirmButton: {
                    styleType: 'alert',
                },
            },
            tablePage: {
                sortBy: 'name',
                sortDesc: true,
                thisPage: 1,
                allPage: 1,
                pageSize: 15,
            },
        };
    },
    computed: {
        getSelectedTypeKey() {
            const currentType = this.$parent.selectedNode.node.data.item_type;
            return (currentType === 'REGION') ? 'COMMON.REGION' : (currentType === 'ZONE') ? 'COMMON.ZONE' : 'COMMON.POOL';
        },
        getMemberModalTitle() {
            return this.$t('IDENTITY.DEL_ARG', [this.$t('COMMON.MEMBER')]);
        },
        getSearchPlaceHolder() {
            return this.$t('IDENTITY.SCH_PAC_DT');
        },
        selectedFields() {
            return [
                {
                    name: 'user_id', label: this.$t('COMMON.UID'),
                },
                {
                    name: 'name', label: this.$t('COMMON.NAME'),
                },
                {
                    name: 'email', label: this.$t('COMMON.EMAIL'),
                },
                {
                    name: 'labels', label: this.$t('COMMON.LABELS'),
                },
            ];
        },
    },
    methods: {
        getEmptyString(object) {
            return this.isEmpty(object) ? '' : object;
        },
        getDefaultQuery() {
            return {
                query: defaultQuery(
                    this.tablePage.thisPage,
                    this.tablePage.pageSize,
                    this.tablePage.sortBy,
                    this.tablePage.sortDesc,
                ),
            };
        },
        changePageSize() {
            this.tablePage.thisPage = 1;
            this.tablePage.allPage = 1;
            this.listMembers();
        },
        getMembers() {
            this.listMembersOnSearch();
        },
        showModal() {
            this.visible = true;
            const sortedIndex = this.$parent._data.selectIndex;
            this.getSelectedMember(sortedIndex);
        },
        hideModal() {
            this.visible = false;
        },
        getSelectedMember(sortedIdx) {
            sortedIdx.sort((a, b) => a - b);
            const selectItem = [];
            sortedIdx.forEach((index) => {
                selectItem.push(this.referenceMember[index]);
            });
            this.memberToDelete = selectItem;
        },
        onSelect(item, index, event) {
            if (!_.find(this.tagRelated.Tags, { text: item.user_id })) {
                this.tagRelated.Tags.push({ text: item.user_id, tiClasses: ['ti-valid'] });
            }
        },
        async deleteUserOnProject() {
            const selectedNodeDT = this.$parent.selectedNode.node.data;
            const param = { users: _.map(this.memberToDelete, 'user_info.user_id') };
            const key = `${this.replaceAll(selectedNodeDT.item_type, '_', '-').toLowerCase()}_id`;
            param[key] = selectedNodeDT.id;
            const url = `/inventory/${this.replaceAll(selectedNodeDT.item_type, '_', '-').toLowerCase()}/member/remove`;
            await this.$http.post(url, param).then(() => {
                this.$notify({
                    group: 'noticeBottomRight',
                    type: 'success',
                    title: 'Success',
                    text: 'Selected item successfully Removed from Project Group',
                    duration: 3000,
                    speed: 2000,
                });
                this.$parent.getMembers();
                this.hideModal();
            }).catch((error) => {
                console.error(error);
            });
        },
        search() {
            this.listMembersOnSearch(this.searchText);
        },
        confirm() {
            this.deleteUserOnProject();
        },
        close() {
            console.debug('close Modal');
        },
    },
};
</script>
<style lang="postcss" scoped>
    .p-label {
        @apply text-gray-900;
        margin-bottom:5px;
        margin-right: 0.5rem;
    }
    .delete-alert{
        margin-bottom: 2rem;
        text-align: left;
        font: 24px/29px Arial;
        letter-spacing: 0;
        color: #000000;
        opacity: 1;
    }

    .tag-input {
        @apply bg-primary4 border border-gray-100;
        height: 20vh;
        overflow-y: auto;
        opacity: 1;
    }
</style>
