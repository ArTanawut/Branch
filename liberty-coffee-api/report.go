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
	db_report  *sql.DB
	ctx_report context.Context
)

type ReportIdStockReq struct {
	Id int `json:"id"`
}

type ReportDateReq struct {
	Start_date string `json:"start_date"`
	End_date   string `json:"end_date"`
}

type ResultsReportStock struct {
	Result    []ReportStocks `json:"data"`
	ErrorCode int            `json:"error_code"`
	Message   string         `json:"message"`
}

type ReportStocks struct {
	Id          int    `json:"id"`
	Type        string `json:"type"`
	Doc_no      string `json:"doc_no"`
	Doc_date    string `json:"doc_date"`
	Record      int    `json:"record"`
	Total_price string `json:"total_price"`
}

func (p *ResultsReportStock) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsReportStockLines struct {
	Result    []ReportStockLines `json:"data"`
	ErrorCode int                `json:"error_code"`
	Message   string             `json:"message"`
}

type ReportStockLines struct {
	Barcode     string `json:"barcode"`
	Product     string `json:"product"`
	Quantity    string `json:"quantity"`
	Price       string `json:"price"`
	Total_price string `json:"total_price"`
}

func (p *ResultsReportStockLines) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsReportStocksFull struct {
	Result    []ReportStocksFull `json:"data"`
	ErrorCode int                `json:"error_code"`
	Message   string             `json:"message"`
}

type ReportStocksFull struct {
	Type        string `json:"type"`
	Doc_date    string `json:"doc_date"`
	Raw_barcode string `json:"raw_barcode"`
	Raw_name    string `json:"raw_name"`
	Quantity    string `json:"quantity"`
	Price       string `json:"price"`
	Total_price string `json:"total_price"`
}

func (p *ResultsReportStocksFull) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsReportSales struct {
	Result    []ReportSales `json:"data"`
	ErrorCode int           `json:"error_code"`
	Message   string        `json:"message"`
}

type ReportSales struct {
	Doc_date        string `json:"doc_date"`
	Product_barcode string `json:"product_barcode"`
	Product_name    string `json:"product_name"`
	Quantity        string `json:"quantity"`
	Price           string `json:"price"`
	Total_price     string `json:"total_price"`
}

func (p *ResultsReportSales) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

//======================================================

func getReportStocks(c echo.Context) (err error) {
	req := new(ReportDateReq)
	res := new(ResultsReportStock)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetReportStocks()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *ReportDateReq) GetReportStocks() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Start_date,
		p.End_date}

	results, err := models.ExecuteStore("CALL RPT_SelectStock (?,?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func getReportStockLines(c echo.Context) (err error) {
	req := new(ReportIdStockReq)
	res := new(ResultsReportStockLines)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetReportStockLines()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *ReportIdStockReq) GetReportStockLines() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL RPT_SelectStockLine (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func getReportStocksFull(c echo.Context) (err error) {
	req := new(ReportDateReq)
	res := new(ResultsReportStocksFull)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetReportStocksFull()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *ReportDateReq) GetReportStocksFull() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Start_date,
		p.End_date}

	results, err := models.ExecuteStore("CALL RPT_SelectStockFull (?,?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func getReportSales(c echo.Context) (err error) {
	req := new(ReportDateReq)
	res := new(ResultsReportSales)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetReportSales()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *ReportDateReq) GetReportSales() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Start_date,
		p.End_date}

	results, err := models.ExecuteStore("CALL RPT_SelectSale (?,?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}
