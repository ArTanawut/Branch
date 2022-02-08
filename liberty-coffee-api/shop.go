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
	db_shop  *sql.DB
	ctx_shop context.Context
)

type ResultsShop struct {
	Result    []Shop `json:"data"`
	ErrorCode int    `json:"error_code"`
	Message   string `json:"message"`
}

type Shop struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Open_time   string `json:"open_time"`
	Close_time  string `json:"close_time"`
}

func (p *ResultsShop) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsBranchs struct {
	Result    []Branchs `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type Branchs struct {
	No         string `json:"no"`
	Id         string `json:"id"`
	Name       string `json:"name"`
	Address1   string `json:"address1"`
	Address2   string `json:"address2"`
	Open_time  string `json:"open_time"`
	Close_time string `json:"close_time"`
	Active     string `json:"active"`
}

func (p *ResultsBranchs) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertShopReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Open_time   string `json:"open_time"`
	Close_time  string `json:"close_time"`
	User        int    `json:"user"`
}

type UpdateShopReq struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Open_time   string `json:"open_time"`
	Close_time  string `json:"close_time"`
	User        int    `json:"user"`
}

type ResultsResShop struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResShop) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertBranchReq struct {
	Name       string `json:"name"`
	Address1   string `json:"address1"`
	Open_time  string `json:"open_time"`
	Close_time string `json:"close_time"`
	Active     int    `json:"active"`
	User       int    `json:"user"`
}

type UpdateBranchReq struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Address1   string `json:"address1"`
	Open_time  string `json:"open_time"`
	Close_time string `json:"close_time"`
	Active     int    `json:"active"`
	User       int    `json:"user"`
}

type ResultsResBranch struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResBranch) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

//======================================================

func getBranchs(c echo.Context) (err error) {
	res := new(ResultsBranchs)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := GetBranchs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func GetBranchs() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL MNG_SelectBranchs", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getShop(c echo.Context) (err error) {
	res := new(ResultsShop)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := SelectShop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func SelectShop() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL MNG_SelectShop", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func addShop(c echo.Context) (err error) {
	req := new(InsertShopReq)
	res := new(ResultsResShop)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertShop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertShopReq) InsertShop() (int64, error) {
	args := []interface{}{
		p.Name,
		p.Description,
		p.Open_time,
		p.Close_time,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL MNG_InsertShop (?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateShop(c echo.Context) (err error) {
	req := new(UpdateShopReq)
	res := new(ResultsResShop)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateShop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateShopReq) UpdateShop() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Name,
		p.Description,
		p.Open_time,
		p.Close_time,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL MNG_UpdateShop (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func addBranch(c echo.Context) (err error) {
	req := new(InsertBranchReq)
	res := new(ResultsResBranch)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertBranch()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertBranchReq) InsertBranch() (int64, error) {
	args := []interface{}{
		p.Name,
		p.Address1,
		p.Open_time,
		p.Close_time,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL MNG_InsertBranch (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateBranch(c echo.Context) (err error) {
	req := new(UpdateBranchReq)
	res := new(ResultsResBranch)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateBranch()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateBranchReq) UpdateBranch() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Name,
		p.Address1,
		p.Open_time,
		p.Close_time,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL MNG_UpdateBranch (?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
