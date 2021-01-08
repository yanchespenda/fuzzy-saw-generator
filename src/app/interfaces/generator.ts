export interface Step1List {
    rowName: string;
    value: number;
    result: number;
    latexText: string;
}

export interface Step2List {
    alternateName: string;
    result: number;
    latexText: string;
}

export interface SourceStep2List {
    code: string;
    value: number;
}

export interface SourceStep2 {
    code: string;
    list: SourceStep2List[]
}
