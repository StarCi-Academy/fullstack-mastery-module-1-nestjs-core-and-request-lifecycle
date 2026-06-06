// Package items holds the item domain: sentinel errors, in-memory service and gin handlers.
package items

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ErrNotFound is the sentinel for the "not found" domain error (expected → 404).
// The middleware classifies errors via errors.Is(err, ErrNotFound); the actual
// client message comes from domainError.Error(), not from this sentinel string.
var ErrNotFound = errors.New("not found")

// ErrValidation is the sentinel for an input validation error (expected → 400).
// Same classification pattern as ErrNotFound — sentinel for middleware routing,
// domainError.Error() for the safe client message.
var ErrValidation = errors.New("validation")

// domainError attaches a safe client-facing message to a sentinel for classification.
// `Error()` returns EXACTLY the safe message (no sentinel suffix), while `Is`/`Unwrap`
// let the middleware classify via errors.Is — separating "what the client sees" from "how we classify".)
type domainError struct {
	message  string
	sentinel error
}

// Error returns the safe message for the client — this is exactly the string sent to the envelope.
func (e *domainError) Error() string { return e.message }

// Unwrap so errors.Is can match the ErrNotFound/ErrValidation sentinel.
func (e *domainError) Unwrap() error { return e.sentinel }

// Item is the shape of an item, shared by every handler.
type Item struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// store is in-memory data so the lesson focuses on error handling instead of DB setup.
var store = []Item{
	{ID: 1, Name: "keyboard"},
	{ID: 2, Name: "mouse"},
}

// find returns an item by id — wraps ErrNotFound (keeping a safe message) when missing.
func find(id int) (Item, error) {
	for _, it := range store {
		if it.ID == id {
			return it, nil
		}
	}
	// Expected domain error: a safe message we author → the middleware keeps it as-is.
	return Item{}, &domainError{message: fmt.Sprintf("Item %d not found", id), sentinel: ErrNotFound}
}

// GetItem handles GET /items/:id — validate id (400) then look up (404), attaching errors to the context.
func GetItem(c *gin.Context) {
	raw := c.Param("id")
	id, convErr := strconv.Atoi(raw)
	if convErr != nil || id <= 0 {
		// Validate before business logic — attach ErrValidation with a fixed safe message.
		_ = c.Error(&domainError{message: "id must be a positive integer", sentinel: ErrValidation})
		return
	}

	item, err := find(id)
	if err != nil {
		// The handler attaches the error to the context then returns; the middleware reads c.Errors to shape the envelope.
		_ = c.Error(err)
		return
	}

	c.JSON(http.StatusOK, item)
}

// Explode handles GET /items/explode — panic() simulates an unexpected runtime failure.
func Explode(c *gin.Context) {
	// Unexpected error: the panic carries sensitive detail → the middleware masks it with a generic message.
	panic("boom: simulated internal failure with secret detail")
}
