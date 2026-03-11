import {Row} from "./Row";
import {ColDef} from "ag-grid-community";

export interface IAccount {
    AccName: string,
    RowData: Row[],
    ColDefs: ColDef[],
    TagDefs: ColDef[],
}