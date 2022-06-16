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
	Group_id      string `json:"group_id"`
	Group_name    string `json:"group_name"`
	Min_qty       string `json:"min_qty"`
	Max_qty       string `json:"max_qty"`
	Price         string `json:"price"`
	Percent_Loss  string `json:"percent_loss"`
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
	Min_qty       float32 `json:"min_qty"`
	Max_qty       float32 `json:"max_qty"`
	Group_id      int     `json:"group_id"`
	Uom_id2       int     `json:"uom_id2"`
	Qty2          float32 `json:"qty2"`
	Price         float32 `json:"price"`
	Qty1          float32 `json:"qty1"`
	Percent_Loss  float32 `json:"percent_loss"`
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
	Min_qty       float32 `json:"min_qty"`
	Max_qty       float32 `json:"max_qty"`
	Group_id      int     `json:"group_id"`
	Price         float32 `json:"price"`
	Percent_Loss  float32 `json:"percent_loss"`
}

type IdRUOMReq struct {
	Id int `json:"id"`
}

type ResultsRUOMT struct {
	Result    []RUOMTs `json:"data"`
	ErrorCode int      `json:"error_code"`
	Message   string   `json:"message"`
}

type RUOMTs struct {
	No        int     `json:"no"`
	Id        int     `json:"id"`
	Uom_id1   int     `json:"uom_id1"`
	Name1     string  `json:"name1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Name2     string  `json:"name2"`
	Quantity2 float32 `json:"quantity2"`
}

func (p *ResultsRUOMT) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertRUOMTReq struct {
	Raw_id    int     `json:"raw_id"`
	Uom_id1   int     `json:"uom_id1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
}

type ResultsResRUOM struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResRUOM) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type UpdateRUOMReq struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Active int    `json:"active"`
	User   string `json:"user"`
}

type UpdateRUOMTReq struct {
	Id        int     `json:"id"`
	Raw_id    int     `json:"raw_id"`
	Uom_id1   int     `json:"uom_id1"`
	Quantity1 float32 `json:"quantity1"`
	Uom_id2   int     `json:"uom_id2"`
	Quantity2 float32 `json:"quantity2"`
	Active    int     `json:"active"`
	User      int     `json:"user"`
}

type ResultsNotification struct {
	Result    []Notification `json:"data"`
	ErrorCode int            `json:"error_code"`
	Message   string         `json:"message"`
}

type Notification struct {
	Id                string `json:"id"`
	Message           string `json:"message"`
	Url               string `json:"url"`
	Raw_material_id   string `json:"raw_material_id"`
	Raw_name          string `json:"raw_name"`
	Remaining_qty     string `json:"remaining_qty"`
	Uom_name          string `json:"uom_name"`
	Read_flag         string `json:"read_flag"`
	Notification_Date string `json:"notification_date"`
	Notification_Time string `json:"notification_time"`
}

func (p *ResultsNotification) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
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
		p.User,
		p.Min_qty,
		p.Max_qty,
		p.Group_id,
		p.Price,
		p.Percent_Loss}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_InsertRaw (?,?,?,?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func addRawImport(c echo.Context) (err error) {
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

	results, err := req.InsertRawImport()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertRawReq) InsertRawImport() (int64, error) {
	args := []interface{}{
		p.Barcode,
		p.Name,
		p.Uom_id,
		p.Remaining_qty,
		p.Active,
		p.User,
		p.Min_qty,
		p.Max_qty,
		p.Group_id,
		p.Uom_id2,
		p.Qty2,
		p.Price,
		p.Qty1,
		p.Percent_Loss}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_InsertRawImport (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ", args)
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
		p.User,
		p.Min_qty,
		p.Max_qty,
		p.Group_id,
		p.Price,
		p.Percent_Loss}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_UpdateRaw (?,?,?,?,?,?,?,?,?,?,?,?) ", args)
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

func getRUOMTs(c echo.Context) (err error) {
	req := new(IdRUOMReq)
	res := new(ResultsRUOMT)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetRUOMTs()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdRUOMReq) GetRUOMTs() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL RAW_SelectUnitsTransfer (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addRUOMT(c echo.Context) (err error) {
	req := new(InsertRUOMTReq)
	res := new(ResultsResRUOM)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertRUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertRUOMTReq) InsertRUOMT() (int64, error) {
	args := []interface{}{
		p.Raw_id,
		p.Uom_id1,
		p.Quantity1,
		p.Uom_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_InsertUnitTransfer (?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateRUOMT(c echo.Context) (err error) {
	req := new(UpdateRUOMTReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateRUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateRUOMTReq) UpdateRUOMT() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Raw_id,
		p.Uom_id1,
		p.Quantity1,
		p.Uom_id2,
		p.Quantity2,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_UpdateUnitTransfer (?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteRUOMT(c echo.Context) (err error) {
	req := new(IdRUOMReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteRUOMT()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdRUOMReq) DeleteRUOMT() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL RAW_DeleteUnitTransfer (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func getNotifications(c echo.Context) (err error) {
	res := new(ResultsNotification)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := GetNotifications()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func GetNotifications() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL STC_GetNotification", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func updateReadNotification(c echo.Context) (err error) {
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := UpdateReadNotification()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func UpdateReadNotification() (int64, error) {

	results, err := models.ExecuteStoreNonQuery("CALL STC_UpdateReadNotification", nil)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
