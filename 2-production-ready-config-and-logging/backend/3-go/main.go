// Entrypoint — wires config + unified logger + Gin, framework logs share the zap pipeline.
package main

import (
	"log"
	"strconv"
	"time"

	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"starci/config-and-logging/config"
	"starci/config-and-logging/handler"
	applogger "starci/config-and-logging/logger"
)

func main() {
	// Step 1: load typed config (Viper) — the only place touching env/file.
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	// Step 2: build the unified logger (console + JSON file) from the config path.
	logger, err := applogger.New(cfg.LogFilePath)
	if err != nil {
		log.Fatalf("failed to init logger: %v", err)
	}
	// flush buffer on exit.
	defer func() { _ = logger.Sync() }()

	// gin.New() drops the default logger/recovery that write text straight to stdout.
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	// Gin access log + panic recovery flow through the SAME *zap.Logger — unified pipeline.
	r.Use(ginzap.Ginzap(logger, time.RFC3339, true))
	r.Use(ginzap.RecoveryWithZap(logger, true))

	// Routes — handlers receive the typed logger + cfg.
	r.GET("/", handler.GetStatus(logger, cfg))
	r.GET("/config", handler.GetConfig(logger, cfg))

	// Startup log through the unified logger (also lands in the JSON file).
	addr := ":" + strconv.Itoa(cfg.Port)
	logger.Info("HTTP server starting",
		// context makes the startup line carry the same fields as application logs.
		zap.String("context", "Bootstrap"),
		zap.String("addr", addr),
	)
	if err := r.Run(addr); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
