import {IJsonModel} from "flexlayout-react";

export const Layout1:IJsonModel = {
    global: {},
    borders: [
        {
            type: "border",
            location: "left" as const,
            children: [
                {
                    type: "tab",
                    name: "Accounts",
                    component: "Accounts",
                    borderWidth: 350,
                    enableClose: false,
                },
                {
                    type: "tab",
                    name: "Columns",
                    component: "ColumnVisibility",
                    borderWidth: 350,
                    enableClose: false,
                },
                {
                    type: "tab",
                    name: "Tags",
                    component: "Tags",
                    borderWidth: 350,
                    enableClose: false,
                }
            ]
        }
    ],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 100,
                children: [
                    {
                        type: "tab",
                        name: "Table",
                        component: "Table",
                        enableClose: false,
                    },
                    {
                        type: "tab",
                        name: "Performance",
                        component: "PerformanceChart",
                        enableClose: false,
                    }
                ]
            }
        ]
    }
}