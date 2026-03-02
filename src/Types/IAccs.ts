import {Row} from "./Row";
import {ColDef} from "ag-grid-community";

export interface IAccs {
    AccName: string,
    RowData: Row[],
    ColDefs: ColDef[],
    TagDefs: ColDef[],
}