-- name: CreateAccount :one
INSERT INTO accounts (
    account_name
) VALUES (
    $1
) RETURNING account_id;

-- name: CreateColDefConfig :one
INSERT INTO column_def_config (
    account_id, col_def_config
) VALUES (
    $1, $2
) RETURNING  account_id;

-- name: CreateTagDefConfig :one
INSERT INTO tag_def_config (
    account_id, tag_def_config
) VALUES (
    $1, $2
) RETURNING account_id;

-- name: CreateSierraData :one
INSERT INTO sierra_data (
    account_id, symbol, entry_datetime, trade_type, duration, profit_loss, cumulative_profit_loss,
    max_open_profit, max_open_loss, exit_datetime, commission, max_open_quantity, trade_quantity, entry_price,
    exit_price, max_closed_quantity, flat_to_flat_profit_loss, flat_to_flat_max_open_profit, flat_to_flat_max_open_loss,
    entry_efficiency, total_efficiency, high_price_while_open, low_price_while_open, note, open_position_quantity,
    close_position_quantity
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    $10, $11, $12, $13, $14, $15, $16,
    $17, $18, $19, $20, $21, $22,
    $23, $24, $25, $26
) RETURNING sierra_data_id;

-- name: CreateTagDefs :one
INSERT INTO tag_defs (
    account_id, tag_name
) VALUES (
    $1, $2
) RETURNING tag_def_id;

-- name: CreateSierraDataTags :one
INSERT INTO sierra_data_tags (
    sierra_data_id, tag_def_id, tag_value
) VALUES (
    $1, $2, $3
) RETURNING sierra_data_tag_id;