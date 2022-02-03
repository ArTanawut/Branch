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
	db_product  *sql.DB
	ctx_product context.Context
)

type ResultsProducts struct {
	Result    []Products `json:"data"`
	ErrorCode int        `json:"error_code"`
	Message   string     `json:"message"`
}

type Products struct {
	No                string `json:"no"`
	Id                string `json:"id"`
	Barcode           string `json:"barcode"`
	Name              string `json:"name"`
	Product_type      string `json:"product_type"`
	Product_type_name string `json:"product_type_name"`
	Uom_id            string `json:"uom_id"`
	Uom_name          string `json:"uom_name"`
	Active            string `json:"active"`
}

func (p *ResultsProducts) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsBundles struct {
	Result    []Bundles `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type Bundles struct {
	No       int    `json:"no"`
	Id       int    `json:"id"`
	Raw_id   int    `json:"raw_id"`
	Raw_name string `json:"raw_name"`
	Quantity string `json:"quantity"`
	Uom_id   int    `json:"uom_id"`
	Uom_name string `json:"uom_name"`
	Active   int    `json:"active"`
}

func (p *ResultsBundles) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type IdProductReq struct {
	Id int `json:"id"`
}

type InsertProductReq struct {
	Barcode      string `json:"barcode"`
	Name         string `json:"name"`
	Uom_id       int    `json:"uom_id"`
	Product_type int    `json:"product_type"`
	Image        string `json:"image"`
	Active       int    `json:"active"`
	User         int    `json:"user"`
}

type ResultsResProduct struct {
	RowsAffected int64  `json:"RowsAffected"`
	ErrorCode    int    `json:"ErrorCode"`
	Message      string `json:"Message"`
}

func (p *ResultsResProduct) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type ResultsInsertProducts struct {
	Result    []ProductId `json:"data"`
	ErrorCode int         `json:"error_code"`
	Message   string      `json:"message"`
}

type ProductId struct {
	Product_id int `json:"product_id"`
}

func (p *ResultsInsertProducts) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

type InsertBundleReq struct {
	Product_id int     `json:"product_id"`
	Raw_id     int     `json:"raw_id"`
	Quantity   float32 `json:"quantity"`
	Active     int     `json:"active"`
	User       int     `json:"user"`
}

type UpdateProductReq struct {
	Id           int    `json:"id"`
	Barcode      string `json:"barcode"`
	Name         string `json:"name"`
	Uom_id       int    `json:"uom_id"`
	Product_type int    `json:"product_type"`
	Image        string `json:"image"`
	Active       int    `json:"active"`
	User         int    `json:"user"`
}

type ResultsCheckId struct {
	Result    []CheckId `json:"data"`
	ErrorCode int       `json:"error_code"`
	Message   string    `json:"message"`
}

type CheckId struct {
	Checkid int `json:"checkid"`
}

func (p *ResultsCheckId) setErrorHandle(status int, msg string) {
	p.Message = msg
	p.ErrorCode = status
}

//======================================================

func getProducts(c echo.Context) (err error) {
	res := new(ResultsProducts)
	res.ErrorCode = 0

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := GetProducts()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func GetProducts() ([]map[string]interface{}, error) {

	results, err := models.ExecuteStore("CALL PRO_SelectProducts", nil)
	if err != nil {

		return nil, err
	}

	return results, nil

}

func getBundleProducts(c echo.Context) (err error) {
	req := new(IdProductReq)
	res := new(ResultsBundles)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.GetBundleProducts()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *IdProductReq) GetBundleProducts() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL PRO_SelectBundleProduct (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addProduct(c echo.Context) (err error) {
	req := new(InsertProductReq)
	res := new(ResultsInsertProducts)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertProduct()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	log.Println(results)
	mapstructure.Decode(results, &res.Result)
	return c.JSON(http.StatusOK, res)
}

func (p *InsertProductReq) InsertProduct() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Barcode,
		p.Name,
		p.Uom_id,
		p.Product_type,
		p.Image,
		p.Active,
		p.User}

	results, err := models.ExecuteStore("CALL PRO_InsertProduct (?,?,?,?,?,?,?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func addBundle(c echo.Context) (err error) {
	req := new(InsertBundleReq)
	res := new(ResultsResProduct)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.InsertBundle()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *InsertBundleReq) InsertBundle() (int64, error) {
	args := []interface{}{
		p.Product_id,
		p.Raw_id,
		p.Quantity,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL PRO_InsertBundleProduct (?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteBundle(c echo.Context) (err error) {
	req := new(IdProductReq)
	res := new(ResultsResProduct)
	resCheckid := new(ResultsCheckId)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	resultcheckid, err := req.CheckProductId()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	// log.Println(resultcheckid)
	mapstructure.Decode(resultcheckid, &resCheckid.Result)
	CheckId := resCheckid.Result[0].Checkid

	if CheckId == 1 {
		resultsdelete, err := req.DeleteBundle()
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

func (p *IdProductReq) CheckProductId() ([]map[string]interface{}, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStore("CALL PRO_CheckBundleProduct (?) ", args)
	if err != nil {

		return nil, err
	}

	return results, nil
}

func (p *IdProductReq) DeleteBundle() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL PRO_DeleteBundleProduct (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func updateProduct(c echo.Context) (err error) {
	req := new(UpdateProductReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	res.RowsAffected = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.UpdateProduct()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *UpdateProductReq) UpdateProduct() (int64, error) {
	args := []interface{}{
		p.Id,
		p.Barcode,
		p.Name,
		p.Uom_id,
		p.Product_type,
		p.Image,
		p.Active,
		p.User}

	results, err := models.ExecuteStoreNonQuery("CALL PRO_UpdateProduct (?,?,?,?,?,?,?,?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}

func deleteProduct(c echo.Context) (err error) {
	req := new(IdProductReq)
	res := new(ResultsRes)

	res.ErrorCode = 0
	err = c.Bind(req)

	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}

	results, err := req.DeleteProduct()
	if err != nil {
		log.Println(err.Error())
		res.setErrorHandle(http.StatusBadRequest, models.Message[http.StatusBadRequest])
		return c.JSON(http.StatusBadRequest, res)
	}
	res.RowsAffected = results
	return c.JSON(http.StatusOK, res)
}

func (p *IdProductReq) DeleteProduct() (int64, error) {
	args := []interface{}{
		p.Id}

	results, err := models.ExecuteStoreNonQuery("CALL PRO_DeleteProduct (?) ", args)
	if err != nil {
		log.Println(err.Error())
		return 0, err
	}

	return results, nil
}
