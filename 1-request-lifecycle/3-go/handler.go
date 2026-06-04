// Package main — business HTTP handlers for the /items route.
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ItemsHandler wires the /items route to ItemsService.
type ItemsHandler struct {
	// service is the business layer providing item data.
	service *ItemsService
}

// NewItemsHandler constructs the handler with an injected service.
func NewItemsHandler(service *ItemsService) *ItemsHandler {
	return &ItemsHandler{service: service}
}

// parsePositiveID parses + validates id; aborts 400 if it is not a positive integer.
func parsePositiveID(c *gin.Context) (int, bool) {
	parsed, err := strconv.Atoi(c.Param("id"))
	if err != nil || parsed <= 0 {
		// AbortWithStatusJSON emits 400 and STOPS the chain — the handler never runs on bad input.
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message":    "id must be a positive integer",
			"error":      "Bad Request",
			"statusCode": http.StatusBadRequest,
		})
		return 0, false
	}
	return parsed, true
}

// List handles GET /items — sets the payload for the envelope middleware to wrap outbound.
func (h *ItemsHandler) List(c *gin.Context) {
	// Only set payload, do NOT write JSON directly — the envelope layer owns the response shape.
	c.Set("payload", h.service.List())
}

// Restricted handles GET /items/restricted — runs after RoleMiddleware allows it through.
func (h *ItemsHandler) Restricted(c *gin.Context) {
	c.Set("payload", h.service.List())
}

// FindByID handles GET /items/:id after the id has been validated.
func (h *ItemsHandler) FindByID(c *gin.Context) {
	id, ok := parsePositiveID(c)
	if !ok {
		return
	}
	c.Set("payload", h.service.FindByID(id))
}
