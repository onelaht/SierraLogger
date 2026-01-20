package types

type cellEditorParams struct {
	Values []string `json:"values"`
}

type TagDef struct {
	*ColDef
	Editable         bool             `json:"editable"`
	CellEditor       string           `json:"cellEditor"`
	CellEditorParams cellEditorParams `json:"cellEditorParams"`
}
