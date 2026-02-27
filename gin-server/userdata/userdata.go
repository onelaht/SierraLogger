package userdata

import (
	"strconv"
	"strings"
)

// ManageData
// converts user file (raw data) to array of maps
// - returns split data of userfile
// - returns nil if empty
func ManageData(data string) ([]map[string]string, []string, []string) {
	userMap := setMap(splitData(data))
	uniqueSymbol := getColUnique(userMap, "Symbol")
	uniqueAccount := getColUnique(userMap, "Account\r")
	return userMap, uniqueSymbol, uniqueAccount
}

// getColUnique
// extracts unique (non-dup) value from specific attribute/column
// - returns array of unique string
// - returns nil if provided arr of map is empty
func getColUnique(userMap []map[string]string, col string) []string {
	// if empty
	if len(userMap) == 0 {
		return nil
	}
	var colUnique []string
	// detect if dup
	seen := make(map[string]bool)
	// traverse through arr of map
	for _, tuple := range userMap {
		// if not seen, mark as seen and append
		if !seen[tuple[col]] {
			seen[tuple[col]] = true
			colUnique = append(colUnique, tuple[col])
		}
	}
	return colUnique
}

// splitData
// splits by newline and then by tabs
// - returns double array of split data
// - returns nil if empty
func splitData(data string) [][]string {
	// if empty, return nil
	if len(data) < 1 {
		return nil
	}
	var splitByTab [][]string
	newLine := strings.Split(data, "\n")
	// traverse through each line
	for x := 0; x < len(newLine); x++ {
		// split line to tabs
		splitByTab = append(splitByTab, strings.Split(newLine[x], "\t"))
	}
	return splitByTab
}

// setMap
// initializes array of maps
// - mimics python dictionary; where var["Account"] contains account name
// - returns split data as array of maps
// - returns nil if empty
func setMap(data [][]string) []map[string]string {
	// if empty, return
	if data == nil {
		return nil
	}
	// create array of map (store all rows)
	var rows []map[string]string
	// traverse through each tuple (exception to col headers)
	for i := 1; i < len(data); i++ {
		// create map for each row)
		row := make(map[string]string)
		// loop through each attribute
		for j := 0; j < len(data[i]); j++ {
			// if empty, skip tuple
			if data[i][0] == "" {
				continue
			}
			// fix formatting and set to individual tuple map
			row[data[0][j]] = adjustFormatting(data[0][j], data[i][j])
		}
		// append individual tuple map to array
		if len(row) > 0 {
			rows = append(rows, row)
		}
	}
	return rows
}

// adjustFormatting
// - removes additional values from specific column types
// - returns adjusted values
// - returns same value if case is not specified
func adjustFormatting(colType string, colValue string) string {
	switch colType {
	case "Account\r":
		return strings.TrimRight(colValue, "\r")
	case "Duration":
		intArr := make([]int, 0)
		for _, str := range strings.Split(colValue, ":") {
			converted, _ := strconv.Atoi(str)
			intArr = append(intArr, converted)
		}
		return strconv.Itoa(intArr[0]*3600 + intArr[1]*60 + intArr[2])
	case "Symbol":
		before, _, found := strings.Cut(colValue, " ")
		if found {
			return before
		}
		return colValue
	case "Entry DateTime":
		return strings.TrimRight(colValue, " BP")
	case "Exit DateTime":
		return strings.TrimRight(colValue, " EP")
	case "Entry Efficiency":
		fallthrough
	case "Exit Efficiency":
		fallthrough
	case "Total Efficiency":
		return strings.TrimRight(colValue, "%")
	default:
		return colValue
	}
}
