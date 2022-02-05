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

type IdshopReq struct {
	Id int `json:"id"`
}

type ResultsshopT struct {
	Result    []shopTs `json:"data"`
	ErrorCode int      `json:"error_code"`
	Message   string   `json:"message"`
}

type shopTs struct {
	No        int     `json:"no"`
	Id        int     `json:"id"`
	shop_id1  int     `json:"shop_id1"`
	Name1     string  `json:"name1"`
	Quantity1 float32 `json:"quantity1"`
	shop_id2  int     `json:"shop_id2"`
	Name2     string  `json:"name2"`
	Quantity2 float32 `json:"quantity2"`
}

func (p *ResultsshopT) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertshopReq struct {
	Name   string `json:"name"`
	Active int    `json:"active"`
	User   string `json:"user"`
}

type InsertshopTReq struct {
	shop_id1  int     `json:"shop_id1"`
	Quantity1 float32 `json:"quantity1"`
	shop_id2  int     `json:"shop_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
}

type ResultsResshop struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResshop) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateshopReq struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Active int    `json:"active"`
	User   string `json:"user"`
}

type UpdateshopTReq struct {
	Id        int     `json:"id"`
	shop_id1  int     `json:"shop_id1"`
	Quantity1 float32 `json:"quantity1"`
	shop_id2  int     `json:"shop_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
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

	results, err := models.ExecuteStore("CALL SHP_SelectBranchs", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getshopTs(c echo.Context) (err error) {
	req := new(IdshopReq)
	res := new(ResultsshopT)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetshopTs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdshopReq) GetshopTs() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL shop_SelectUnitsTransfer (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addshop(c echo.Context) (err error) {
	req := new(InsertshopReq)
	res := new(ResultsResshop)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.Insertshop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertshopReq) Insertshop() (int64, error) {
	args := []interface{}{
		p.Name,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL shop_InsertUnit (?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func addshopT(c echo.Context) (err error) {
	req := new(InsertshopTReq)
	res := new(ResultsResshop)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertshopT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertshopTReq) InsertshopT() (int64, error) {
	args := []interface{}{
		p.shop_id1,
		p.Quantity1,
		p.shop_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL shop_InsertUnitTransfer (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateshop(c echo.Context) (err error) {
	req := new(UpdateshopReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.Updateshop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateshopReq) Updateshop() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Name,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL shop_UpdateUnit (?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateshopT(c echo.Context) (err error) {
	req := new(UpdateshopTReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateshopT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateshopTReq) UpdateshopT() (int64, error) {
	args := []interface{}{
		p.Id,
		p.shop_id1,
		p.Quantity1,
		p.shop_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL shop_UpdateUnitTransfer (?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteshop(c echo.Context) (err error) {
	req := new(IdshopReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.Deleteshop()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdshopReq) Deleteshop() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL shop_DeleteUnit (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteshopT(c echo.Context) (err error) {
	req := new(IdshopReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteshopT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdshopReq) DeleteshopT() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL shop_DeleteUnitTransfer (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
