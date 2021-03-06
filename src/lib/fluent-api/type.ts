/* eslint-disable camelcase */
export type ApiMethods = 'post' | 'get' | 'delete' | 'put';

export interface LongFilterType {
    key: string;
    value: string | string[];
    operator: string;
}

type OperatorType = '' | '!' | '>' | '>=' | '<' | '<=' | '=' | '!=' | '$';

export interface FilterItem extends LongFilterType {
    key: string;
    value: string | string[];
    operator: OperatorType;
}

export interface ShortFilterType {
    k: string;
    v: string | string[];
    o: string;
}

export type FilterType = LongFilterType | ShortFilterType;

export interface RawParameterActionState<T> {
    parameter: T ;
}

export interface GetActionState<T> {
    parameter: T;
    only: string[];
}

export interface Sort {
    key: string;
    desc?: boolean;
}

export interface Page {
    start: number;
    limit?: number;
}

export interface Query {
    filter?: FilterType[];
    only?: string[];
    page?: Page;
    sort?: Sort;
    keyword?: string;
    count_only?: boolean;
}

export interface QueryApiState<T=any> {
    filter: FilterItem[];
    fixFilter: FilterItem[];
    only: string[];
    thisPage: number;
    pageSize: number;
    sortBy: string;
    sortDesc: boolean;
    keyword: string;
    extraParameter: T;
    count_only: boolean;
    query: () => Query;
}

export interface StatQuery {
    filter?: FilterType[];
    // sort: string;
    limit?: number;
    start?: string;
    end?: string;
    aggregate?: Array<undefined | string>;
    merge?: Array<undefined | string>;
}

export interface StatQueryApiState<T=any> {
    filter?: FilterItem[];
    // sortBy: string;
    limit?: number;
    start?: string;
    end?: string;
    aggregate?: Array<undefined | string>;
    merge?: Array<undefined | string>;
    extraParameter?: T;
}


export interface DataSourceItem {
    name: string;
    key: string;
    view_type?: string;
    view_option?: any;
}

export interface DynamicFormItem {
    type: string;
    is_required: boolean;
    name: string;
    key: string;
}


export interface DynamicViewMetaData {
    name: string;
    data_source: DataSourceItem[];
}

export interface DefaultMetaData{
    details?: DynamicViewMetaData;
    sub_data?: DynamicViewMetaData;
}

export interface HistoryItem {
    update_at: number;
    key: string;
    update_by: string;
}

export interface CollectionInfo {
    update_history: HistoryItem[];
    state: string;
    collectors: string[];
    pinned_keys: string[];

}


export interface TimeStamp {
    seconds: string;
    nanos: number;
}

export interface ListType<T> {
    results: T[];
    total_count: number;
}

export interface ReferenceInfo {
    resource_id?: string;
    external_link?: string;
}

export interface Tags {
    tags?: {
        [key: string]: any;
    };
}

export interface ProjectGroupInfo extends Tags {
    project_group_id: string;
    name: string;
    parent_project_group_info: null | ProjectGroupInfo;
    domain_id: string;
    created_by: string;
    created_at: TimeStamp;
    deleted_at: TimeStamp;
}
