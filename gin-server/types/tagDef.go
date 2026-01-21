package types

type cellEditorParams struct {
	Values []string `json:"values"`
}

type TagDef struct {
	*ColDef
	CellEditor       string           `json:"cellEditor"`
	CellEditorParams cellEditorParams `json:"cellEditorParams"`
}
