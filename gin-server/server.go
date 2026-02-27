package main

import (
	"example/gin-server/userdata"

	"example/gin-server/types"

	"example/gin-server/db_accounts"

	"net/http"

	"github.com/gin-gonic/gin"
)

// rawUpload
// converts raw user data (TXT) to array of tuples
// - returns 2D array of user data
// - returns nil if raw user data is empty
// - returns error message if any error occurs
func rawUpload(c *gin.Context) {
	var data types.RawFile
	// prompt if error occurs
	if err := c.BindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	relation, uSymbol, uAccount := userdata.ManageData(data.UserData)
	c.JSON(http.StatusOK, gin.H{
		"data":     relation,
		"uSymbol":  uSymbol,
		"uAccount": uAccount,
	})
}

// saveNewAccount
// inserts account data to db
// - returns 200 if successful
// - returns error message if any error occurs
func saveNewAccount(c *gin.Context) {
	// initialize payload and datatype
	type payload struct {
		Account types.Account `json:"acc"`
	}
	var data payload
	// prompt if error occurs during data retrieval
	if err := c.BindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	err := db_accounts.NewAccount(data.Account)
	// prompt if error occurs during data insertion
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	// return 200
	c.JSON(http.StatusOK, gin.H{})
}

// retrieveAccounts
// returns value of GetAllAccount()
func retrieveAccounts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"accounts": db_accounts.GetAllAccount(),
	})
}

func getAccountNames(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"names": db_accounts.GetAccountNames(),
	})
}

func getAccount(c *gin.Context) {
	type Payload struct {
		AccName string `json:"name"`
	}
	var payload Payload
	//
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}
	//
	acc, _ := db_accounts.GetAccount(payload.AccName)
	c.JSON(http.StatusOK, gin.H{
		"account": acc,
	})
}

// contains endpoint initialization and handlers
func main() {
	// initialize gin
	router := gin.Default()
	// upload endpoint handler
	router.POST("/upload", rawUpload)
	router.POST("/saveNewAccount", saveNewAccount)
	router.POST("/getAccount", getAccount)
	router.GET("/retrieveAccounts", retrieveAccounts)
	router.GET("/getAccountNames", getAccountNames)
	// run via localhost:5000
	err := router.Run(":5000")
	// exit if any error occurs
	if err != nil {
		return
	}
}
