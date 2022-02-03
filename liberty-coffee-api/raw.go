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
	db_raw  *sql.DB
	ctx_raw context.Context
)

type ResultsRaws struct {
	Result    []Raws `json:"data"`
	ErrorCode int    `json:"error_code"`
	Message   string `json:"message"`
}

type Raws struct {
	No            string `json:"no"`
	Id            string `json:"id"`
	Barcode       string `json:"barcode"`
	Name          string `json:"name"`
	Uom_id        string `json:"uom_id"`
	Uom_name      string `json:"uom_name"`
	Remaining_qty string `json:"remaining_qty"`
	Active        string `json:"active"`
}

func (p *ResultsRaws) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type IdRawReq struct {
	Id int `json:"id"`
}

type InsertRawReq struct {
	Barcode       string  `json:"barcode"`
	Name          string  `json:"name"`
	Uom_id        int     `json:"uom_id"`
	Remaining_qty float32 `json:"remaining_qty"`
	Active        int     `json:"active"`
	User          int     `json:"user"`
}

type ResultsResRaw struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResRaw) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateRawReq struct {
	Id            int     `json:"id"`
	Barcode       string  `json:"barcode"`
	Name          string  `json:"name"`
	Uom_id        int     `json:"uom_id"`
	Remaining_qty float32 `json:"remaining_qty"`
	Active        int     `json:"active"`
	User          int     `json:"user"`
}

//======================================================

func getRaws(c echo.Context) (err error) {
	res := new(ResultsRaws)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := GetRaws()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func GetRaws() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL RAW_SelectRaws", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func addRaw(c echo.Context) (err error) {
	req := new(InsertRawReq)
	res := new(ResultsResRaw)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertRaw()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertRawReq) InsertRaw() (int64, error) {
	args := []interface{}{
		p.Barcode,
		p.Name,
		p.Uom_id,
		p.Remaining_qty,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_InsertRaw (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateRaw(c echo.Context) (err error) {
	req := new(UpdateRawReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateRaw()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateRawReq) UpdateRaw() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Barcode,
		p.Name,
		p.Uom_id,
		p.Remaining_qty,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_UpdateRaw (?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteRaw(c echo.Context) (err error) {
	req := new(IdRawReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteRaw()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdRawReq) DeleteRaw() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_DeleteRaw (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
