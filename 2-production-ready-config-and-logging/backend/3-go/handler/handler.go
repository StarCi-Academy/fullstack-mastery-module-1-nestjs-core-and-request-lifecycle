// Package handler — HTTP handlers reading config via the typed struct and logging via the unified logger.
package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"starci/config-and-logging/config"
)

// configResponse — flat shape for GET /config, matching the 5-field contract.
type configResponse struct {
	// application name.
	Name string `json:"name"`
	// application version.
	Version string `json:"version"`
	// HTTP port.
	Port int `json:"port"`
	// runtime environment.
	NodeEnv string `json:"nodeEnv"`
	// log file path.
	LogFilePath string `json:"logFilePath"`
}

// GetStatus handles GET / — emits runtime identity sourced from config (not hard-coded).
func GetStatus(logger *zap.Logger, cfg config.AppConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Per-request log: attach context "AppController" so the JSON file has the contract field.
		logger.Info("GET / called - returning runtime config status",
			zap.String("context", "AppController"),
		)
		// Every value comes from the typed cfg — the handler is environment-independent.
		c.JSON(http.StatusOK, gin.H{
			"message":    cfg.NodeEnv + " - config-and-logging-ready",
			"env":        cfg.NodeEnv,
			"appName":    cfg.Name,
			"appVersion": cfg.Version,
			"appPort":    cfg.Port,
		})
	}
}

// GetConfig handles GET /config — returns the typed snapshot with all 5 fields.
func GetConfig(logger *zap.Logger, cfg config.AppConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Log so Flow 4 can observe the JSON line in logs/app.log.
		logger.Info("GET /config called - returning AppConfig snapshot",
			zap.String("context", "AppController"),
		)
		c.JSON(http.StatusOK, configResponse{
			Name:        cfg.Name,
			Version:     cfg.Version,
			Port:        cfg.Port,
			NodeEnv:     cfg.NodeEnv,
			LogFilePath: cfg.LogFilePath,
		})
	}
}
