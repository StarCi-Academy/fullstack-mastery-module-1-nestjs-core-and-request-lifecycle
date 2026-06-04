// Package middleware holds the error-handling middleware — the global error convergence point.
package middleware

import (
	"errors"
	"log"
	"net/http"
	"runtime/debug"
	"time"

	"error-handling-demo/items"

	"github.com/gin-gonic/gin"
)

// writeEnvelope writes the normalized error envelope — the single place that decides what the client sees.
func writeEnvelope(c *gin.Context, status int, message string) {
	c.AbortWithStatusJSON(status, gin.H{
		"statusCode": status,
		"error":      http.StatusText(status),
		"message":    message,
		"timestamp":  time.Now().UTC().Format(time.RFC3339),
		"path":       c.Request.URL.Path,
	})
}

// ErrorHandler is the convergence point: recover() catches panics + reads c.Errors, classifying expected vs unexpected.
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if rec := recover(); rec != nil {
				// panic = unexpected error: the stack trace is logged internally ONLY, never returned to the client.
				log.Printf("panic %s %s: %v\n%s", c.Request.Method, c.Request.URL.Path, rec, debug.Stack())
				writeEnvelope(c, http.StatusInternalServerError, "Internal server error")
			}
		}()

		c.Next() // run the handler

		if len(c.Errors) == 0 {
			return
		}
		err := c.Errors.Last().Err
		switch {
		case errors.Is(err, items.ErrNotFound):
			// the domain's safe message
			writeEnvelope(c, http.StatusNotFound, err.Error())
		case errors.Is(err, items.ErrValidation):
			writeEnvelope(c, http.StatusBadRequest, err.Error())
		default:
			// Unknown error: log internally, the client only sees a generic message.
			log.Printf("unhandled %s %s: %v", c.Request.Method, c.Request.URL.Path, err)
			writeEnvelope(c, http.StatusInternalServerError, "Internal server error")
		}
	}
}
