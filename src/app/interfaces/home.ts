export interface CriteriaDataSource {
    code: string;
    name: string;
    weight: number;
    type: number;
}

export interface AlternateDataSource {
    code: string;
    name: string;
}


export interface ValueSourceList {
    code: string;
    value: number;
}

export interface ValueSource {
    code: string;
    list: ValueSourceList[];
}
