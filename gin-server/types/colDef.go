package types

type ColDef struct {
	Editable     bool                `json:"editable"`
	Hide         bool                `json:"hide"`
	CellDataType string              `json:"cellDataType"`
	Field        string              `json:"field"`
	Filter       string              `json:"filter"`
	FilterParams map[string][]string `json:"filterParams"`
}
