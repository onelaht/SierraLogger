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
// - returns err if any errors occurs
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
	mColDefs, _ := json.Marshal(acc.ColDefs)
	mTagDefs, _ := json.Marshal(acc.TagDefs)
	mRowData, _ := json.Marshal(acc.RowData)
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

// GetAccount
// retrieves account by name
// - returns account if successful
// - returns nil and err if any errors occurs
func GetAccount(accName string) (*types.Account, error) {
	var acc types.Account
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return nil, err
	}
	defer conn.Close(ctx)
	queries := db.New(conn)
	// get account data from db
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

// GetAccountNames
// retrieves all account name in db
// - returns array of account name if successful
// - returns nil and err if any errors occursG
func GetAccountNames() []string {
	ctx := context.Background()
	// connect user and db
	conn, err := pgx.Connect(ctx, "postgres://user1:pass@localhost:5432/db1_proj1?sslmode=disable")
	if err != nil {
		return nil
	}
	defer conn.Close(ctx)
	queries := db.New(conn)
	// retrieve acc name att from db
	names, err := queries.GetAccountNames(ctx)
	// if any error occurs return nil
	if err != nil {
		return nil
	}
	return names
}
