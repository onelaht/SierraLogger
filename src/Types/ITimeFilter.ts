import {ITimeFormat} from "./ITimeFormat";
import {FilterList} from "./FilterList";

export interface ITimeFilter {
    userInput: ITimeFormat;
    filter: FilterList;
}