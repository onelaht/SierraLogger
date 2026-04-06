package db_accounts

import (
	"context"
	"encoding/json"
	"example/gin-server/db"
	"example/gin-server/types"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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
	// initialize context
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return err
	}
	defer conn.Close(ctx)
	// create instance to execute queries
	queries := db.New(conn)
	// initialize db account
	accID, _ := queries.CreateAccount(ctx, pgtype.Text{String: acc.AccName, Valid: true})
	// serialize col def strut
	colDefsMarshal, _ := json.Marshal(acc.ColDefs)
	// create parameter type
	colDefConfig := db.CreateColDefConfigParams{
		AccountID:    accID,
		ColDefConfig: colDefsMarshal,
	}
	// use account id to store ag grid coldef config
	_, _ = queries.CreateColDefConfig(ctx, colDefConfig)
	// serialize tag def struct
	tagDefsMarshal, _ := json.Marshal(acc.TagDefs)
	// create parameter type
	tagDefConfig := db.CreateTagDefConfigParams{
		AccountID:    accID,
		TagDefConfig: tagDefsMarshal,
	}
	// use account id to store ag grid tagdef config
	_, _ = queries.CreateTagDefConfig(ctx, tagDefConfig)
	//
	var attributes []map[string][]map[string]string = nil
	// traverse per tuple
	for _, tuple := range acc.RowData {
		splitAtt := map[string][]map[string]string{
			"sierra": nil,
			"tags":   nil,
		}
		// traverse per attribute in tuple
		for j := range tuple {
			// add to sierra chart subset, if part of sierra chart standard att
			if _, ok := sierraSet[j]; ok {
				splitAtt["sierra"] = append(splitAtt["sierra"], map[string]string{j: tuple[j]})
				// add to user defined tags subset, if not part of sierra chart standard att
			} else {
				splitAtt["tags"] = append(splitAtt["tags"], map[string]string{j: tuple[j]})
			}
		}
		attributes = append(attributes, splitAtt)
	}
	//
	for i := range attributes {
		fmt.Println(i)
	}
	// loop through split attributes arr

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
