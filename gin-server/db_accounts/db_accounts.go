package db_accounts

import (
	"context"
	"encoding/json"
	"example/gin-server/db"
	"example/gin-server/types"

	"github.com/jackc/pgx/v5"
)

// NewAccount
// insert account data as new tuple
// - returns nil if successful
// - returns error message if any errors occurs
func NewAccount(acc types.Account) error {
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return err
	}
	defer conn.Close(ctx)
	// create instance to execute queries
	queries := db.New(conn)
	// jsonify data
	mColDefs, _ := json.Marshal(acc.Data.ColDefs)
	mTagDefs, _ := json.Marshal(acc.Data.TagDefs)
	mRowData, _ := json.Marshal(acc.Data.RowData)
	// create account
	_, err = queries.CreateAccount(ctx, db.CreateAccountParams{
		Name:    acc.AccName,
		Coldefs: mColDefs,
		Tagdefs: mTagDefs,
		Rowdata: mRowData,
	})
	if err != nil {
		return err
	}
	return nil
}

func GetAccount(accName string) (*types.Accs, error) {
	var acc types.Accs
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return nil, err
	}
	defer conn.Close(ctx)
	queries := db.New(conn)
	//
	tuple, err := queries.GetAccount(ctx, accName)
	if err != nil {
		return nil, err
	}
	// set to var
	acc.AccName = tuple.Name
	json.Unmarshal(tuple.Rowdata, &acc.RowData)
	json.Unmarshal(tuple.Coldefs, &acc.ColDefs)
	json.Unmarshal(tuple.Tagdefs, &acc.TagDefs)
	return &acc, nil
}

func GetAccountNames() []string {
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return nil
	}
	defer conn.Close(ctx)
	//
	queries := db.New(conn)
	names, err := queries.GetAccountNames(ctx)
	//
	if err != nil {
		return nil
	}
	return names
}

// GetAllAccount
// retrieves all tuples from account table
// - returns an empty array if empty or any error occurs
func GetAllAccount() []types.Account {
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return nil
	}
	defer conn.Close(ctx)
	queries := db.New(conn)

	table, err := queries.GetAllAccounts(ctx)
	if err != nil {
		return nil
	}
	// initialize array
	var accounts []types.Account
	for _, value := range table {
		// cast type
		var accData types.AccountData
		var account types.Account
		// unmarshal json
		if err := json.Unmarshal(value.Coldefs, &accData.ColDefs); err != nil {
			return nil
		}
		if err := json.Unmarshal(value.Rowdata, &accData.RowData); err != nil {
			return nil
		}
		if err := json.Unmarshal(value.Tagdefs, &accData.TagDefs); err != nil {
			return nil
		}
		// insert and append data
		account.AccName = value.Name
		account.Data = accData
		accounts = append(accounts, account)
	}
	return accounts
}
