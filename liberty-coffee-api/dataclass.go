package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo"

	_ "github.com/go-sql-driver/mysql"
)

var (
	db  *sql.DB
	ctx context.Context
)

type UserProfile struct {
	UserId       string `json:"userId"`
	Password     string `json:"password"`
	FullNameUser string `json:"fullNameUser"`
	Email        string `json:"email"`
}

type UserLog struct {
	UserId     string `json:"UserId"`
	PageCode   string `json:"PageCode"`
	ActionCode string `json:"ActionCode"`
}

// type UserLog struct {
// 	UserId     string `json:"UserId"`
// 	PageCode   string `json:"PageCode"`
// 	ActionCode string `json:"ActionCode"`
// }

// type ResponseBase

func getuserlogin(c echo.Context) (err error) {

	req := new(UserProfile)
	err = c.Bind(req)
	if err != nil {
		return err
	}
	var query string

	fmt.Println(req.UserId)
	query = "SELECT UserId,FullNameUser,Email FROM [dbo].[GMX_MAS_User] WHERE UserId='" + req.UserId + "'"
	fmt.Println(query)
	results, err := db.Query(query)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	u := []UserProfile{}

	for results.Next() {
		var r UserProfile

		_ = results.Scan(&r.UserId, &r.FullNameUser, &r.Email)

		u = append(u, r)
	}
	return c.JSON(http.StatusOK, u)
}

func getUserProfile(c echo.Context) (err error) {

	var query string

	query = "SELECT UserId,FullNameUser,Email FROM [dbo].[GMX_MAS_User]"
	results, err := db.Query(query)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	u := []UserProfile{}

	for results.Next() {
		var r UserProfile

		_ = results.Scan(&r.UserId, &r.Password, &r.FullNameUser, &r.Email)

		u = append(u, r)
	}
	return c.JSON(http.StatusOK, u)
}

func insertuserlogin(c echo.Context) (err error) {
	req := new(UserProfile)
	err = c.Bind(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}
	var query string
	var args []interface{}
	args = append(args, req.UserId)
	args = append(args, req.Password)
	args = append(args, req.FullNameUser)
	args = append(args, req.Email)

	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	query = "INSERT INTO mt_user ( UserId,Password,FullNameUser,Email) VALUES (?,?,?,?)"

	_, err = db.Exec(query, args...)

	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, nil)
	}

	return c.JSON(http.StatusOK, "nil")
}

func getUserTest(c echo.Context) (err error) {
	var query string
	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	query = "SELECT UserId,Password,FullNameUser,Email FROM mt_user"
	results, err := db.Query(query)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	u := []UserProfile{}

	for results.Next() {
		var r UserProfile

		_ = results.Scan(&r.UserId, &r.Password, &r.FullNameUser, &r.Email)

		u = append(u, r)
	}
	return c.JSON(http.StatusOK, u)
}

func getUse1(c echo.Context) (err error) {
	var query string
	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	req := new(UserProfile)
	err = c.Bind(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}
	var args []interface{}
	// args = append(args, req.Email)
	args = append(args, "aaa")

	query = "SELECT UserId,Password,FullNameUser,Email " +
		"FROM mt_user " +
		"WHERE Email = ? "

	results, err := db.Query(query, args...)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	u := []UserProfile{}

	for results.Next() {
		var r UserProfile

		_ = results.Scan(&r.UserId, &r.Password, &r.FullNameUser, &r.Email)

		u = append(u, r)
	}
	return c.JSON(http.StatusOK, u)
}

func updateUser1(c echo.Context) (err error) {
	var query string
	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}
	req := new(UserProfile)
	err = c.Bind(req)

	query = "Update mt_user " +
		"SET Password='" + req.Password + "',FullNameUser='" + req.FullNameUser + "',Email='" + req.Email + "' " +
		"WHERE UserId='" + req.UserId + "'"
	_, err = db.Exec(query)

	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, nil)
	}

	return c.JSON(http.StatusOK, "Update Complete")
}

func login(c echo.Context) (err error) {
	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	var query string
	req := new(UserProfile)
	err = c.Bind(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}
	var args []interface{}
	args = append(args, req.Email)
	args = append(args, req.Password)

	query = "SELECT UserId,Password,FullNameUser,Email " +
		"FROM mt_user " +
		"WHERE Email = ? AND Password = ?"

	results, err := db.Query(query, args...)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	var statusLogin bool = false
	u := []UserProfile{}

	for results.Next() {
		var r UserProfile

		_ = results.Scan(&r.UserId, &r.Password, &r.FullNameUser, &r.Email)

		u = append(u, r)
		statusLogin = true
	}
	return c.JSON(http.StatusOK, statusLogin)
}

func insertuserlog(c echo.Context) (err error) {

	req := new(UserLog)
	err = c.Bind(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}
	var query string
	var args []interface{}
	args = append(args, req.UserId)
	args = append(args, req.PageCode)
	args = append(args, req.ActionCode)
	args = append(args, req.UserId)
	query = "INSERT INTO GMX_MAS_UserLog ( UserId,PageCode,ActionCode,CreateDate,CreateBy) VALUES (?,?,?,GETDATE(),?)"

	_, err = db.Exec(query, args...)

	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest, nil)
	}

	return c.JSON(http.StatusOK, nil)
}

func InitialDb() (err error) {

	// db, err = sql.Open("mssql", "server=10.9.16.192;user id=sa;password=P@ssw0rd;port=1433;database=GMX;encrypt=disable;")
	db, err := sql.Open("mysql", "root:P@ssw0rd@tcp(127.0.0.1:3306)/testdb")
	if err != nil {
		return err
	}

	if err := db.Ping(); err != nil {
		return err
	}

	// insert, err := db.Query("INSERT INTO testid VALUES (100)")

	// if err != nil {
	// 	panic(err.Error())
	// }

	// defer insert.Close()

	return nil
}
