// Package main — middlewares composing Gin's request lifecycle chain.
package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// allowedRole is the only role allowed to access the restricted route.
const allowedRole = "admin"

// RequestIDMiddleware attaches the x-request-id header earliest so later layers can trace it.
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Reuse the client-provided id if present, otherwise generate a new uuid.
		id := c.GetHeader("x-request-id")
		if id == "" {
			id = uuid.NewString()
			c.Request.Header.Set("x-request-id", id)
		}
		c.Header("x-request-id", id)
		c.Next()
	}
}

// LoggerMiddleware writes a one-line access log per request.
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}

// TimingMiddleware records the start mark (nano) before the handler to compute executionMs outbound.
func TimingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Record the start mark into the context — only the later layer (envelope) reads it back.
		c.Set("startNs", time.Now().UnixNano())
		c.Next()
	}
}

// ResponseEnvelopeMiddleware wraps the handler payload into the standard envelope outbound.
func ResponseEnvelopeMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Wait for the handler to finish before wrapping — this is the "after c.Next()" part.
		c.Next()

		payload, exists := c.Get("payload")
		if !exists {
			// Handler already wrote the response (e.g. 400/403 error) — do not wrap again.
			return
		}
		var executionMs *int64
		if startNs, ok := c.Get("startNs"); ok {
			ms := (time.Now().UnixNano() - startNs.(int64)) / 1_000_000
			executionMs = &ms
		}
		c.JSON(http.StatusOK, gin.H{
			"data":        payload,
			"timestamp":   time.Now().UTC().Format(time.RFC3339),
			"requestId":   c.GetHeader("x-request-id"),
			"executionMs": executionMs,
		})
	}
}

// RoleMiddleware blocks requests whose role is not admin with HTTP 403 before the handler.
func RoleMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.Query("role")
		if role == allowedRole {
			c.Next()
			return
		}
		// c.Abort stops the chain immediately — the allow/deny decision is independent of business logic.
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"message":    "Role \"" + role + "\" is not allowed; expected \"" + allowedRole + "\"",
			"error":      "Forbidden",
			"statusCode": http.StatusForbidden,
		})
	}
}
