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
	db_Stock  *sql.DB
	ctx_Stock context.Context
)

type ResultsStocks struct {
	Result    []Stocks `json:"data"`
	ErrorCode int      `json:"error_code"`
	Message   string   `json:"message"`
}

type Stocks struct {
	Id          int    `json:"id"`
	Doc_no      string `json:"doc_no"`
	Doc_date    string `json:"doc_date"`
	Remarks     string `json:"remarks"`
	Draft       int    `json:"draft"`
	Record      int    `json:"record"`
	Total_price string `json:"total_price"`
	Filename    string `json:"filename"`
}

func (p *ResultsStocks) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsStockLines struct {
	Result    []StockLines `json:"data"`
	ErrorCode int          `json:"error_code"`
	Message   string       `json:"message"`
}

type StockLines struct {
	No                int    `json:"no"`
	Id                int    `json:"id"`
	Barcode           string `json:"barcode"`
	Raw_material_id   int    `json:"raw_material_id"`
	Raw_material_name string `json:"raw_material_name"`
	Quantity          string `json:"quantity"`
	Uom_id            int    `json:"uom_id"`
	Uom_name          string `json:"uom_name"`
	Price             string `json:"price"`
	Total_price       string `json:"total_price"`
}

func (p *ResultsStockLines) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type IdStockReq struct {
	Id int `json:"id"`
}

type IdTypeReq struct {
	TypeId int `json:"type_id"`
}

type DocDateReq struct {
	Doc_date string `json:"doc_date"`
}

type InsertStockReq struct {
	Doc_no   string `json:"doc_no"`
	Doc_date string `json:"doc_date"`
	Type     int    `json:"type"`
	Remarks  string `json:"remarks"`
	Draft    int    `json:"draft"`
	Filename string `json:"filename"`
	User     int    `json:"user"`
}

type ResultsResStock struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResStock) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsInsertStocks struct {
	Result    []StockId `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type StockId struct {
	Stock_header_id int `json:"stock_header_id"`
}

func (p *ResultsInsertStocks) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertStockLineReq struct {
	Stock_header_id int     `json:"stock_header_id"`
	Raw_material_id int     `json:"raw_material_id"`
	Barcode         string  `json:"barcode"`
	Uom_id          int     `json:"uom_id"`
	Quantity        float32 `json:"quantity"`
	Price           float32 `json:"price"`
}

type UpdateStockReq struct {
	Id       int    `json:"id"`
	Doc_no   string `json:"doc_no"`
	Doc_date string `json:"doc_date"`
	Type     int    `json:"type"`
	Remarks  string `json:"remarks"`
	Draft    int    `json:"draft"`
	Filename string `json:"filename"`
	User     int    `json:"user"`
}

type ResultsCheckIdStock struct {
	Result    []CheckIdStock `json:"data"`
	ErrorCode int            `json:"error_code"`
	Message   string         `json:"message"`
}

type CheckIdStock struct {
	Checkid int `json:"checkid"`
}

func (p *ResultsCheckIdStock) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsNewDocNo struct {
	Result    []GenDocNo `json:"data"`
	ErrorCode int        `json:"error_code"`
	Message   string     `json:"message"`
}

type GenDocNo struct {
	New_docno string `json:"new_docno"`
}

func (p *ResultsNewDocNo) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

//======================================================

func getStocks(c echo.Context) (err error) {
	req := new(IdTypeReq)
	res := new(ResultsStocks)
	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetStocks()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdTypeReq) GetStocks() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.TypeId}

	results, err := models.ExecuteStore("CALL STC_SelectStocks (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func getStockLines(c echo.Context) (err error) {
	req := new(IdStockReq)
	res := new(ResultsStockLines)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetStockLines()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdStockReq) GetStockLines() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL STC_SelectStockline (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addStock(c echo.Context) (err error) {
	req := new(InsertStockReq)
	res := new(ResultsInsertStocks)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertStock()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *InsertStockReq) InsertStock() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Doc_no,
		p.Doc_date,
		p.Type,
		p.Remarks,
		p.Draft,
		p.Filename,
		p.User}

	results, err := models.ExecuteStore("CALL STC_InsertStock (?,?,?,?,?,?,?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addStockLine(c echo.Context) (err error) {
	req := new(InsertStockLineReq)
	res := new(ResultsResStock)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertStockLine()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertStockLineReq) InsertStockLine() (int64, error) {
	args := []interface{}{
		p.Stock_header_id,
		p.Raw_material_id,
		p.Barcode,
		p.Uom_id,
		p.Quantity,
		p.Price}

	results, err := models.ExecuteStoreNonQuery("CALL STC_InsertStockLine (?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteStockLine(c echo.Context) (err error) {
	req := new(IdStockReq)
	res := new(ResultsResStock)
	resCheckid := new(ResultsCheckIdStock)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	resultcheckid, err := req.CheckStockId()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	// log.Println(resultcheckid)
	mapstructure.Decode(resultcheckid, &resCheckid.Result)
	CheckId := resCheckid.Result[0].Checkid

	if CheckId == 1 {
		resultsdelete, err := req.DeleteStockLine()
		if err != nil {
			log.Println(err.Error())
			res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
			return c.JSON(http.StatusBadRequest, res)
		}
		log.Println(resultsdelete)
	}

	res.RowsAffected = 1
	return c.JSON(http.StatusOK, res)
}

func (p *IdStockReq) CheckStockId() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL STC_CheckStockline (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func (p *IdStockReq) DeleteStockLine() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL STC_DeleteStockline (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateStock(c echo.Context) (err error) {
	req := new(UpdateStockReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateStock()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateStockReq) UpdateStock() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Doc_no,
		p.Doc_date,
		p.Type,
		p.Remarks,
		p.Draft,
		p.Filename,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL STC_UpdateStock (?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteStock(c echo.Context) (err error) {
	req := new(IdStockReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteStock()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdStockReq) DeleteStock() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL STC_DeleteStock (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func genDocNo(c echo.Context) (err error) {
	req := new(DocDateReq)
	res := new(ResultsNewDocNo)
	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetNewDocNo()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *DocDateReq) GetNewDocNo() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Doc_date}

	results, err := models.ExecuteStore("CALL STC_GenDocNo (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}
