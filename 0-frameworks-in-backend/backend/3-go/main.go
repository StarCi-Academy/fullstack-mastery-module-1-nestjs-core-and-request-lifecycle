// Package main is the composition root for the Go frameworks-in-backend demo.
// Go uses gin for HTTP routing but has no built-in IoC container — all dependency
// wiring is manual, done explicitly here in main (composition root pattern).
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"frameworks-demo/cat"
	"frameworks-demo/dog"
)

func main() {
	// Create cat.Service first — it is a shared singleton (same pointer reused).
	catSvc := cat.NewService()
	// Inject catSvc into dog.Service; no new cat.Service() inside dog (manual DI).
	dogSvc := dog.NewService(catSvc)

	r := gin.Default()

	// Route: GET /cats — delegate to catSvc.All(); controller stays thin.
	r.GET("/cats", func(c *gin.Context) { c.JSON(http.StatusOK, catSvc.All()) })
	// Route: GET /dogs/spy — proves dogSvc can call catSvc across package boundary.
	r.GET("/dogs/spy", func(c *gin.Context) { c.JSON(http.StatusOK, dogSvc.SpyReport()) })
	// Route: GET /dogs/cats-via-di — proves catSvc is the same instance (shared singleton).
	r.GET("/dogs/cats-via-di", func(c *gin.Context) { c.JSON(http.StatusOK, dogSvc.CatsViaDI()) })

	// Listen on all interfaces (0.0.0.0:3000) — change to 127.0.0.1:3000 for loopback-only.
	_ = r.Run(":3000")
}
