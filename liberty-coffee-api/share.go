package main

import (
	"context"
	"database/sql"
	"liberty/models"
	"log"
	"net/http"

	"github.com/spf13/viper"

	"github.com/labstack/echo"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mitchellh/mapstructure"
)

var (
	db_share  *sql.DB
	ctx_share context.Context
)

var (
	secretKey string
	PswDB     string
)

type ResultsRole struct {
	Result    []Role `json:"data"`
	ErrorCode int    `json:"error_code"`
	Message   string `json:"message"`
}

type Role struct {
	// Id          string `json:"id"`
	Role_Id   string `json:"role_id"`
	Role_Name string `json:"role_name"`
	// Create_Date string `json:"create_date"`
}

func (p *ResultsRole) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsBranch struct {
	Result    []Branch `json:"data"`
	ErrorCode int      `json:"error_code"`
	Message   string   `json:"message"`
}

type Branch struct {
	Id          string `json:"id"`
	Branch_Id   string `json:"branch_id"`
	Branch_Name string `json:"branch_name"`
	Province    string `json:"province"`
}

func (p *ResultsBranch) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsddlUOMs struct {
	Result    []ddlUOMs `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type ddlUOMs struct {
	// Id          string `json:"id"`
	UOM_Id   string `json:"uom_id"`
	UOM_Name string `json:"uom_name"`
	// Create_Date string `json:"create_date"`
}

func (p *ResultsddlUOMs) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ResultsLogin struct {
	Result    []Login `json:"data"`
	ErrorCode int     `json:"error_code"`
	Message   string  `json:"message"`
}

type Login struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Password  string `json:"password"`
	Role_Id   int    `json:"role_id"`
	Branch_Id int    `json:"branch_id"`
}

func (p *ResultsLogin) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsddlRAWs struct {
	Result    []ddlRAWs `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type ddlRAWs struct {
	// Id          string `json:"id"`
	Raw_Id   string `json:"raw_id"`
	Raw_Name string `json:"raw_name"`
	Uom_Id   string `json:"uom_id"`
	Uom_Name string `json:"uom_name"`
	// Create_Date string `json:"create_date"`
}

func (p *ResultsddlRAWs) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

// =============================== End Sturct ================================

func getRole(c echo.Context) (err error) {
	res := new(ResultsRole)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectRole()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectRole() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL LIB_GetRole", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getBranch(c echo.Context) (err error) {
	res := new(ResultsBranch)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectBranch()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectBranch() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL LIB_GetBranch", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func onLogin(c echo.Context) (err error) {
	req := new(LoginReq)
	res := new(ResultsLogin)
	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	v, err := models.GetConfig("liberty-api-config", "./etc/config")
	if err != nil {
		log.Println(err.Error())
	}
	GetConfig(v)
	// TextEncrypt, err := models.AESEncrypt(req.Password, secretKey)
	// log.Println(TextEncrypt)
	// req.Password = TextEncrypt
	PlainTextReq := req.Password

	results, err := req.CheckLogin()
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

	log.Println("Password in DB is: " + PlainTextDB)

	if err != nil {
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	if PlainTextDB != PlainTextReq {

		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)

	}

	return c.JSON(http.StatusOK, res)
}

func (p *LoginReq) CheckLogin() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Username}

	results, err := models.ExecuteStore("CALL LIB_UserLogin (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func getddlUOMs(c echo.Context) (err error) {
	res := new(ResultsddlUOMs)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectddlUOMs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectddlUOMs() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL LIB_ddlUOMs", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getddlRAWs(c echo.Context) (err error) {
	res := new(ResultsddlRAWs)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectddlRAWs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectddlRAWs() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL LIB_ddlRAWs", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

// GetConfig get secretKey
func GetConfig(v *viper.Viper) {

	secretKey = v.GetString("secret.key")
	log.Println("GetConfig key")
	log.Println(secretKey)

}
