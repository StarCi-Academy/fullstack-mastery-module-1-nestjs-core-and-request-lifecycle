// Package main — entry point: registers the middleware chain + routes then runs the server.
package main

import (
	"os"

	"github.com/gin-gonic/gin"
)

// main assembles the middleware chain in correct lifecycle order then starts Gin.
func main() {
	service := NewItemsService()
	handler := NewItemsHandler(service)

	r := gin.New()
	// r.Use order is invariant: request-id first so envelope can read it; timing records the start mark.
	r.Use(RequestIDMiddleware())
	r.Use(ResponseEnvelopeMiddleware())
	r.Use(TimingMiddleware())
	r.Use(LoggerMiddleware())

	items := r.Group("/items")
	// Register the static "restricted" route before the dynamic ":id" route to avoid wildcard conflict.
	items.GET("", handler.List)
	items.GET("/restricted", RoleMiddleware(), handler.Restricted)
	items.GET("/:id", handler.FindByID)

	// Allow overriding the port via the PORT env var, defaulting to 3000.
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	if err := r.Run("127.0.0.1:" + port); err != nil {
		panic(err)
	}
}
