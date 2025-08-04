package configs

import (
	"database/sql"
    "log"
    "time"
	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
    var err error
    
    DB, err = sql.Open(
        "mysql", "root:@tcp(localhost:3306)/steam_catalog") 
    if err != nil {
        log.Fatal("Failed to open database connection:", err)
    }

    DB.SetMaxOpenConns(10)
    DB.SetMaxIdleConns(5)
    DB.SetConnMaxLifetime(time.Minute * 5)

    err = DB.Ping()
    if err != nil {
        log.Fatal("Failed to ping database:", err)
    }

    _, err = DB.Query("SELECT 1 FROM games LIMIT 1")
    if err != nil {
        log.Fatal("Failed to query games table:", err)
    }

    log.Println("Successfully connected to database")
}