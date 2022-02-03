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
	db_role  *sql.DB
	ctx_role context.Context
)

type ResultsRoles struct {
	Result    []Roles `json:"data"`
	ErrorCode int     `json:"error_code"`
	Message   string  `json:"message"`
}

type Roles struct {
	No          string `json:"no"`
	Role_Id     string `json:"role_id"`
	Role_Name   string `json:"role_name"`
	Create_Date string `json:"create_date"`
	Create_By   string `json:"create_by"`
	Update_Date string `json:"update_date"`
	Update_by   string `json:"update_by"`
}

func (p *ResultsRoles) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertRoleReq struct {
	Role_Name   string `json:"role_name"`
	User_Action string `json:"user_action"`
}

type ResultsInsertRole struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsInsertRole) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateRoleReq struct {
	Id          int    `json:"id"`
	Role_Name   string `json:"role_name"`
	User_Action string `json:"user_action"`
}

type IdRoleReq struct {
	Id int `json:"id"`
}

func getRoles(c echo.Context) (err error) {
	res := new(ResultsRoles)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectRoles()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectRoles() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL ROLE_GetRoles", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func addRole(c echo.Context) (err error) {
	req := new(InsertRoleReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertRole()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertRoleReq) InsertRole() (int64, error) {
	args := []interface{}{
		p.Role_Name,
		p.User_Action}

	results, err := models.ExecuteStoreNonQuery("CALL ROLE_InsertRole (?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateRole(c echo.Context) (err error) {
	req := new(UpdateRoleReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateRole()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateRoleReq) UpdateRole() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Role_Name,
		p.User_Action}

	results, err := models.ExecuteStoreNonQuery("CALL ROLE_UpdateRole (?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteRole(c echo.Context) (err error) {
	req := new(IdRoleReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteRole()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdRoleReq) DeleteRole() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL ROLE_DeleteRole (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
