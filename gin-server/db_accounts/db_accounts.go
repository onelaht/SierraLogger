package db_accounts

import (
	"example/gin-server/types"
	"fmt"
)

// NewAccount
// insert account data as new tuple
// - returns nil if successful
// - returns err if any errors occurs
func NewAccount(acc types.Account) error {
	// if rowData is empty or dne, ignore
	if acc.RowData == nil || len(acc.RowData) == 0 {
		return nil
	}
	// attributes provided by sierra chart
	sierraSet := map[string]struct{}{
		"Entry DateTime":                 struct{}{},
		"Exit DateTime":                  struct{}{},
		"Duration":                       struct{}{},
		"Symbol":                         struct{}{},
		"Trade Type":                     struct{}{},
		"Entry Price":                    struct{}{},
		"Exit Price":                     struct{}{},
		"Low Price While Open":           struct{}{},
		"High Price While Open":          struct{}{},
		"Profit/Loss (C)":                struct{}{},
		"Max Open Profit (C)":            struct{}{},
		"Max Open Loss (C)":              struct{}{},
		"Commission (C)":                 struct{}{},
		"Trade Quantity":                 struct{}{},
		"Open Position Quantity":         struct{}{},
		"Close Position Quantity":        struct{}{},
		"Max Open Quantity":              struct{}{},
		"Max Closed Quantity":            struct{}{},
		"Entry Efficiency":               struct{}{},
		"Exit Efficiency":                struct{}{},
		"Total Efficiency":               struct{}{},
		"FlatToFlat Profit/Loss (C)":     struct{}{},
		"FlatToFlat Max Open Loss (C)":   struct{}{},
		"FlatToFlat Max Open Profit (C)": struct{}{},
		"Note":                           struct{}{},
	}

	// initialize db account
	//

	// use account id to store ag grid coldef config
	//

	// use account id to store ag grid tagdef config
	//

	// traverse per tuple
	for i, tuple := range acc.RowData {
		// use tuple index and create map where values {sierra: [], tags: []}
		fmt.Println(i)
		// traverse per attribute in tuple
		for j := range tuple {
			// add to sierra chart subset, if part of sierra chart standard att
			if _, ok := sierraSet[j]; ok {
				fmt.Println("This is part of Sierra Chart Statistics (" + j + ")")
				// add to user defined tags subset, if not part of sierra chart standard att
			} else {
				fmt.Println("This is part of Sierra Chart Statistics (" + j + ")")
			}
		}
		// add both query to chunk
	}

	return nil
}

// GetAccount
// retrieves account by name
// - returns account if successful
// - returns nil and err if any errors occurs
func GetAccount(accName string) (*types.Account, error) {
	return nil, nil
}

// GetAccountNames
// retrieves all account name in db
// - returns array of account name if successful
// - returns nil and err if any errors occursG
func GetAccountNames() []string {
	return nil
}
