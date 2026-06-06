// Package main boots the gin server for the error-handling lesson — registers the global error convergence point.
package main

import (
	"os"

	"error-handling-demo/items"
	"error-handling-demo/middleware"

	"github.com/gin-gonic/gin"
)

// main registers ErrorHandler at the head of the middleware chain then maps routes; default port 3000.
func main() {
	r := gin.New()
	// Put it at the head of the middleware chain to wrap every handler behind it (both returned errors and panics).
	r.Use(middleware.ErrorHandler())

	// Static /items/explode route is declared before /items/:id so it is not captured as a param.
	r.GET("/items/explode", items.Explode)
	r.GET("/items/:id", items.GetItem)

	// Default port 3000 — allow override via env PORT so audit/parallel tests avoid port collisions.
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	_ = r.Run("127.0.0.1:" + port)
}
