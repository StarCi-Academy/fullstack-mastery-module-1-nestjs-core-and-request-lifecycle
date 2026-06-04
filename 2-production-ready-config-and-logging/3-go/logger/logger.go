// Package logger — unified log pipeline: one zap logger fanning out to console + JSON file.
package logger

import (
	"os"
	"path/filepath"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// New builds a *zap.Logger tee-ing two cores: console (human) + JSON file (machine).
func New(logFile string) (*zap.Logger, error) {
	// JSON file encoder config — key names per contract: level/message/timestamp.
	jsonEncCfg := zap.NewProductionEncoderConfig()
	jsonEncCfg.TimeKey = "timestamp"
	jsonEncCfg.MessageKey = "message"
	jsonEncCfg.LevelKey = "level"
	// ISO8601 for a stable timestamp the aggregator can parse.
	jsonEncCfg.EncodeTime = zapcore.ISO8601TimeEncoder
	jsonEncoder := zapcore.NewJSONEncoder(jsonEncCfg)

	// Console encoder config — colored + human-friendly for devs on the terminal.
	consoleEncCfg := zap.NewDevelopmentEncoderConfig()
	consoleEncCfg.EncodeLevel = zapcore.CapitalColorLevelEncoder
	consoleEncoder := zapcore.NewConsoleEncoder(consoleEncCfg)

	// Create the log file's parent directory if missing (e.g. logs/).
	if dir := filepath.Dir(logFile); dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return nil, err
		}
	}

	// Open the log file (append) — path comes from config, not hard-coded.
	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return nil, err
	}

	// Tee merges two cores: one log event hits BOTH console and file (transport fan-out).
	core := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, zapcore.AddSync(os.Stdout), zapcore.InfoLevel),
		zapcore.NewCore(jsonEncoder, zapcore.AddSync(file), zapcore.InfoLevel),
	)
	return zap.New(core), nil
}
