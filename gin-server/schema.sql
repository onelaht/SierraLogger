DROP TABLE IF EXISTS accounts CASCADE;

CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY,
    account_name TEXT
);

CREATE TABLE column_def_config (
    account_id INTEGER PRIMARY KEY REFERENCES accounts(account_id),
    col_def_config JSONB
);

CREATE TABLE tag_def_config (
    account_id INTEGER PRIMARY KEY REFERENCES accounts(account_id),
    tag_def_config JSONB
);

CREATE TABLE sierra_data (
    sierra_data_id INTEGER PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    symbol TEXT,
    entry_datetime TIMESTAMP,
    trade_type TEXT,
    duration TEXT,
    profit_loss NUMERIC,
    cumulative_profit_loss NUMERIC,
    max_open_profit NUMERIC,
    max_open_loss NUMERIC,
    exit_datetime TIMESTAMP,
    commission NUMERIC,
    max_open_quantity INTEGER,
    trade_quantity INTEGER,
    entry_price NUMERIC,
    exit_price NUMERIC,
    max_closed_quantity INTEGER,
    flat_to_flat_profit_loss NUMERIC,
    flat_to_flat_max_open_profit NUMERIC,
    flat_to_flat_max_open_loss NUMERIC,
    entry_efficiency NUMERIC,
    exit_efficiency NUMERIC,
    total_efficiency NUMERIC,
    high_price_while_open NUMERIC,
    low_price_while_open NUMERIC,
    note TEXT,
    open_position_quantity INTEGER,
    close_position_quantity INTEGER
);

CREATE TABLE tags_defs (
    tag_def_id INTEGER PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    tag_name TEXT,
    UNIQUE(account_id, tag_name)
);

CREATE TABLE sierra_data_tags (
    sierra_data_tag_id INTEGER PRIMARY KEY,
    sierra_data_id INTEGER REFERENCES sierra_data(sierra_data_id),
    tag_def_id INTEGER REFERENCES tags_defs(tag_def_id),
    tag_value TEXT
)