// float column types and displayed as percents
export const floatPercentSet:Set<string> = (
    new Set<string>(
        [
            "Entry Efficiency",
            "Exit Efficiency",
            "Total Efficiency",
        ]
    )
)

// float column types and displayed as rounded
export const floatRoundedSet:Set<string> = (
    new Set<string>(
        [
            "Entry Price",
            "Exit Price",
            "Low Price While Open",
            "High Price While Open",
            "Profit/Loss (C)",
            "Max Open Profit (C)",
            "Max Open Loss (C)",
            "Commission (C)",
            "FlatToFlat Profit/Loss (C)",
            "FlatToFlat Max Open Loss (C)",
            "FlatToFlat Max Open Profit (C)",

        ]
    )
)

// integer column types
export const integerSet:Set<string> = (
    new Set<string>(
        [
            "Trade Quantity",
            "Open Position Quantity",
            "Close Position Quantity",
            "Max Open Quantity",
            "Max Closed Quantity",
        ]
    )
)

// duration custom filter
export const durationSet:Set<string> = (
    new Set<string>(
        [
            "Duration"
        ]
    )
)

// checkbox custom filter
export const checkboxSet:Set<string> = (
    new Set<string>(
        [
            "Trade Type",
            "Symbol"
        ]
    )
)