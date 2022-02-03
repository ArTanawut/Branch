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
	db_uom  *sql.DB
	ctx_uom context.Context
)

type ResultsUOM struct {
	Result    []UOMs `json:"data"`
	ErrorCode int    `json:"error_code"`
	Message   string `json:"message"`
}

type UOMs struct {
	No     string `json:"no"`
	Id     string `json:"id"`
	Name   string `json:"name"`
	Active string `json:"active"`
}

func (p *ResultsUOM) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type IdUOMReq struct {
	Id int `json:"id"`
}

type ResultsUOMT struct {
	Result    []UOMTs `json:"data"`
	ErrorCode int     `json:"error_code"`
	Message   string  `json:"message"`
}

type UOMTs struct {
	No        int     `json:"no"`
	Id        int     `json:"id"`
	Uom_id1   int     `json:"uom_id1"`
	Name1     string  `json:"name1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Name2     string  `json:"name2"`
	Quantity2 float32 `json:"quantity2"`
}

func (p *ResultsUOMT) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertUOMReq struct {
	Name   string `json:"name"`
	Active int    `json:"active"`
	User   string `json:"user"`
}

type InsertUOMTReq struct {
	Uom_id1   int     `json:"uom_id1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
}

type ResultsResUOM struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResUOM) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateUOMReq struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Active int    `json:"active"`
	User   string `json:"user"`
}

type UpdateUOMTReq struct {
	Id        int     `json:"id"`
	Uom_id1   int     `json:"uom_id1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
}

//======================================================

func getUOMs(c echo.Context) (err error) {
	res := new(ResultsUOM)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := GetUOMs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func GetUOMs() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL UOM_SelectUnits", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getUOMTs(c echo.Context) (err error) {
	req := new(IdUOMReq)
	res := new(ResultsUOMT)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetUOMTs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdUOMReq) GetUOMTs() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL UOM_SelectUnitsTransfer (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addUOM(c echo.Context) (err error) {
	req := new(InsertUOMReq)
	res := new(ResultsResUOM)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertUOM()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertUOMReq) InsertUOM() (int64, error) {
	args := []interface{}{
		p.Name,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_InsertUnit (?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func addUOMT(c echo.Context) (err error) {
	req := new(InsertUOMTReq)
	res := new(ResultsResUOM)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertUOMTReq) InsertUOMT() (int64, error) {
	args := []interface{}{
		p.Uom_id1,
		p.Quantity1,
		p.Uom_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_InsertUnitTransfer (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateUOM(c echo.Context) (err error) {
	req := new(UpdateUOMReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateUOM()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateUOMReq) UpdateUOM() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Name,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_UpdateUnit (?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateUOMT(c echo.Context) (err error) {
	req := new(UpdateUOMTReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateUOMTReq) UpdateUOMT() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Uom_id1,
		p.Quantity1,
		p.Uom_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_UpdateUnitTransfer (?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteUOM(c echo.Context) (err error) {
	req := new(IdUOMReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteUOM()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdUOMReq) DeleteUOM() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_DeleteUnit (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteUOMT(c echo.Context) (err error) {
	req := new(IdUOMReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdUOMReq) DeleteUOMT() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL UOM_DeleteUnitTransfer (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
