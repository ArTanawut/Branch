package main

import (
	"context"
	"database/sql"
	"liberty/models"
	"log"
	"net/http"

	"github.com/labstack/echo"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mitchellh/mapstructure"
)

var (
	db_user  *sql.DB
	ctx_user context.Context
)

type ResultsUser struct {
	Result    []User `json:"data"`
	ErrorCode int    `json:"error_code"`
	Message   string `json:"message"`
}

type User struct {
	No          string `json:"no"`
	Id          string `json:"id"`
	Fullname    string `json:"fullName"`
	Username    string `json:"username"`
	Role_Name   string `json:"role_name"`
	Branch_Name string `json:"branch_name"`
	Active_Flag string `json:"active_flag"`
	Create_Date string `json:"create_date"`
}

func (p *ResultsUser) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertUserReq struct {
	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	Role_Id     int    `json:"role_id"`
	Branch_Id   int    `json:"branch_id"`
	Active_Flag int    `json:"active_flag"`
	User_Action string `json:"user_action"`
}

type ResultsRes struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsRes) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type IdUserReq struct {
	Id int `json:"id"`
}

type ResultsUserDetail struct {
	Result    []UserDetail `json:"data"`
	ErrorCode int          `json:"error_code"`
	Message   string       `json:"message"`
}

type UserDetail struct {
	Id          int    `json:"id"`
	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	Role_Id     int    `json:"role_id"`
	Branch_Id   int    `json:"branch_id"`
	Active_Flag int    `json:"active_flag"`
}

func (p *ResultsUserDetail) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateUserReq struct {
	Id          int    `json:"id"`
	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	Role_Id     int    `json:"role_id"`
	Branch_Id   int    `json:"branch_id"`
	Active_Flag int    `json:"active_flag"`
	User_Action string `json:"user_action"`
}

// =============================== End Sturct ================================

func getUser(c echo.Context) (err error) {
	res := new(ResultsUser)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectUser()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectUser() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL USER_GetUser", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func AddUser(c echo.Context) (err error) {
	req := new(InsertUserReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	v, err := models.GetConfig("liberty-api-config", "./etc/config")
	if err != nil {
		log.Println(err.Error())
	}
	GetConfig(v)
	TextEncrypt, err := models.AESEncrypt(req.Password, secretKey)
	log.Println(TextEncrypt)
	req.Password = TextEncrypt

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertUser()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertUserReq) InsertUser() (int64, error) {
	args := []interface{}{
		p.Firstname,
		p.Lastname,
		p.Username,
		p.Password,
		p.Role_Id,
		p.Branch_Id,
		p.Active_Flag,
		p.User_Action}

	results, err := models.ExecuteStoreNonQuery("CALL USER_InsertUser (?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func getUserDetail(c echo.Context) (err error) {
	req := new(IdUserReq)
	res := new(ResultsUserDetail)

	res.ErrorCode = 0
	err = c.Bind(req)

	v, err := models.GetConfig("liberty-api-config", "./etc/config")
	if err != nil {
		log.Println(err.Error())
	}
	GetConfig(v)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.SelectUserDetail()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	PswDB := res.Result[0].Password
	log.Println(PswDB)

	PlainTextDB, err := models.AESDecrypt(PswDB, secretKey)
	res.Result[0].Password = PlainTextDB
	log.Println("Password in DB is: " + PlainTextDB)

	return c.JSON(http.StatusOK, res)
}

func (p *IdUserReq) SelectUserDetail() ([]map[string]interface{}, error) {

	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL USER_GetUserDetail (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func deleteUsers(c echo.Context) (err error) {
	req := new(IdUserReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteUser()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdUserReq) DeleteUser() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL USER_DeleteUser (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateUsers(c echo.Context) (err error) {
	req := new(UpdateUserReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	v, err := models.GetConfig("liberty-api-config", "./etc/config")
	if err != nil {
		log.Println(err.Error())
	}
	GetConfig(v)
	TextEncrypt, err := models.AESEncrypt(req.Password, secretKey)
	log.Println(TextEncrypt)
	req.Password = TextEncrypt

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateUser()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateUserReq) UpdateUser() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Firstname,
		p.Lastname,
		p.Username,
		p.Password,
		p.Role_Id,
		p.Branch_Id,
		p.Active_Flag,
		p.User_Action}

	results, err := models.ExecuteStoreNonQuery("CALL USER_UpdateUser (?,?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
