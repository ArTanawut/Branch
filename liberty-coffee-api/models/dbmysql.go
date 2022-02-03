package models

import (
	"context"
	"database/sql"
	"log"
	"strings"

	// For mysql driver
	_ "github.com/go-sql-driver/mysql"
	"github.com/spf13/viper"
)

var (
	// DB .
	DB  *sql.DB
	ctx context.Context
)

// InitialDB set config for connection to database
func InitialDB(v *viper.Viper) error {

	dataSource, err := DecodeBase64(v.GetString("mysql.connection"))

	if err != nil {
		return err
	}

	// fmt.Println(dataSource)

	driverName := v.GetString("mysql.driver")

	if err != nil {
		return err
	}

	DB, err = sql.Open(driverName, dataSource)

	if err != nil {
		defer DB.Close()
		return err
	}

	if err := DB.Ping(); err != nil {
		defer DB.Close()
		return err
	}

	return nil
}

//ExecuteStore format for execute database and return many rows
func ExecuteStore(query string, args []interface{}) ([]map[string]interface{}, error) {

	if err := DB.Ping(); err != nil {
		log.Println(err.Error())
		return nil, err
	}

	rows, err := DB.Query(query, args...)
	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	count := len(columns)
	tableData := make([]map[string]interface{}, 0)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)
	for rows.Next() {
		for i := 0; i < count; i++ {
			valuePtrs[i] = &values[i]
		}
		rows.Scan(valuePtrs...)
		entry := make(map[string]interface{})
		for i, col := range columns {
			var v interface{}
			val := values[i]
			b, ok := val.([]byte)
			if ok {
				v = string(b)
			} else {
				v = val
			}
			entry[col] = v
		}
		tableData = append(tableData, entry)
	}

	return tableData, nil
}

//ExecuteStoreNonQuery format for execute database and return many rows
func ExecuteStoreNonQuery(query string, args []interface{}) (int64, error) {

	if err := DB.Ping(); err != nil {
		log.Println(err.Error())
		return 0, err
	}

	rows, err := DB.Exec(query, args...)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return rows.RowsAffected()
}

// ExecuteQueryRow format for execute database and return one row
func ExecuteQueryRow(tableName string, columnName []string, whereCause []string, args []interface{}) (*sql.Row, error) {

	var query string

	query = "SELECT TOP 1 " + strings.Join(columnName, " , ")

	query = query + " FROM " + tableName

	query = query + " WHERE " + strings.Join(whereCause, " AND ")

	if err := DB.Ping(); err != nil {
		log.Println(err.Error())
		return nil, err
	}

	r := DB.QueryRow(query, args...)

	return r, nil
}
