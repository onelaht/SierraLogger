-- name: CreateAccount :one
INSERT INTO accounts (
    name, colDefs, tagDefs, rowData
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: GetAllAccounts :many
SELECT * FROM accounts;

-- name: GetAccountNames :many
SELECT name FROM accounts;

-- name: GetAccount :one
SELECT *
FROM accounts
WHERE name = $1;