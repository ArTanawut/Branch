package main

import (
	"fmt"
	"liberty/models"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/tylerb/graceful"
)

func getPort() string {
	var port = os.Getenv("PORT")
	fmt.Println("port get env : " + port)
	if port == "" {
		port = "8080"
		fmt.Println("No Port In Heroku :" + port)
	}
	return ":" + port
}

func main() {
	v, err := models.GetConfig("liberty-api-config", "./etc/config")

	if err != nil {
		log.Println(err.Error())
	}

	log.Println("Liberty COFFEE API Starting . . .")

	err = models.InitialDB(v)

	if err != nil {
		log.Println(err.Error())
	}

	port := v.GetInt("server.port")
	timeout := v.GetInt("server.timeout")

	e := echo.New()

	e.Use(
		middleware.Logger(),
		middleware.Recover(),
		middleware.CORSWithConfig(
			middleware.CORSConfig{
				AllowOrigins:     []string{"*"},
				AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodHead},
				AllowCredentials: true,
				AllowHeaders:     []string{echo.HeaderAuthorization, echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
			},
		),
	)

	e.GET("/", Version)
	e.GET("/helpcheck/:name", func(c echo.Context) error {
		name := c.Param("name")
		return c.String(http.StatusOK, name)
	})

	// share
	e.GET("share/getRole", getRole)
	e.GET("share/getBranch", getBranch)
	e.POST("share/login", onLogin)
	e.GET("share/ddlUOMs", getddlUOMs)
	e.GET("share/ddlRAWs", getddlRAWs)

	// user
	e.GET("user/getUser", getUser)
	e.POST("user/users", AddUser)
	e.POST("user/getUserDetail", getUserDetail)
	e.POST("user/updateUser", updateUsers)
	e.POST("user/deleteUser", deleteUsers)

	// role
	e.GET("role/getRoles", getRoles)
	e.POST("role/addRole", addRole)
	e.POST("role/updateRole", updateRole)
	e.POST("role/deleteRole", deleteRole)

	// uom
	e.GET("uom/getUOMs", getUOMs)
	e.POST("uom/addUOM", addUOM)
	e.POST("uom/updateUOM", updateUOM)
	e.POST("uom/deleteUOM", deleteUOM)
	e.POST("uom/getUOMTs", getUOMTs)
	e.POST("uom/addUOMT", addUOMT)
	e.POST("uom/updateUOMT", updateUOMT)
	e.POST("uom/deleteUOMT", deleteUOMT)

	// raw
	e.GET("raw/getRaws", getRaws)
	e.POST("raw/addRaw", addRaw)
	e.POST("raw/updateRaw", updateRaw)
	e.POST("raw/deleteRaw", deleteRaw)

	// product
	e.GET("product/getProducts", getProducts)
	e.POST("product/addProduct", addProduct)
	e.POST("product/addBundle", addBundle)
	e.POST("product/deleteBundle", deleteBundle)
	e.POST("product/getBundleProduct", getBundleProducts)
	e.POST("product/updateProduct", updateProduct)
	e.POST("product/deleteProduct", deleteProduct)

	// stock
	e.POST("stock/getStocks", getStocks)
	e.POST("stock/addStock", addStock)
	e.POST("stock/addStockLine", addStockLine)
	e.POST("stock/deleteStockLine", deleteStockLine)
	e.POST("stock/getStockLine", getStockLines)
	e.POST("stock/updateStock", updateStock)
	e.POST("stock/deleteStock", deleteStock)
	e.POST("stock/genDocNo", genDocNo)

	e.GET("stock/GetBundleProducts", getBundleProduct)
	e.POST("stock/addSaleHeader", addSale)
	e.POST("stock/addSaleLine", addSaleLine)
	e.POST("stock/getSaleLine", getSaleLines)

	// shop
	e.GET("shop/getBranch", getBranchs)

	e.Server.Addr = fmt.Sprintf(":%d", port)
	graceful.ListenAndServe(e.Server, time.Duration(timeout)*time.Second)

}

func Version(context echo.Context) error {
	return context.JSON(http.StatusOK, map[string]interface{}{"version": 2})
}
