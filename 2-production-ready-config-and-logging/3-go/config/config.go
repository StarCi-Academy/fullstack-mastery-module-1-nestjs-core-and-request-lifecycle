// Package config — the single typed configuration source (Viper unmarshal into struct).
package config

import (
	"os"

	"github.com/spf13/viper"
)

// AppConfig — typed namespace wrapping the whole application config shape.
type AppConfig struct {
	// Name — application name, used in responses and observability labels.
	Name string `mapstructure:"name"`
	// Version — application version to trace deployments.
	Version string `mapstructure:"version"`
	// Port — HTTP port read from per-environment config.
	Port int `mapstructure:"port"`
	// NodeEnv — runtime environment: local | production.
	NodeEnv string `mapstructure:"node_env"`
	// LogFilePath — log file path so the logger reads from the same config source.
	LogFilePath string `mapstructure:"log_file_path"`
}

// Load reads the config file per APP_ENV then unmarshals into the typed struct.
func Load() (AppConfig, error) {
	// Pick profile via APP_ENV — empty defaults to local (switching env needs no source edit).
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local"
	}

	// config.local or config.production — base name without the .yaml suffix.
	viper.SetConfigName("config." + env)
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	// env vars override the file (PORT, NODE_ENV...) — Viper's precedence chain.
	viper.AutomaticEnv()

	// Safe defaults so the app still boots when a key is missing.
	viper.SetDefault("name", "local")
	viper.SetDefault("version", "0.0.1")
	viper.SetDefault("port", 3000)
	viper.SetDefault("node_env", "local")
	viper.SetDefault("log_file_path", "logs/app.log")

	// Read the config file; ignore "not found" since defaults already cover it.
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return AppConfig{}, err
		}
	}

	// PORT is a common E2E override env — bind it explicitly to the port key.
	if err := viper.BindEnv("port", "PORT"); err != nil {
		return AppConfig{}, err
	}
	// NODE_ENV env may override the profile name at test time.
	if err := viper.BindEnv("node_env", "NODE_ENV"); err != nil {
		return AppConfig{}, err
	}
	if err := viper.BindEnv("name", "APP_NAME"); err != nil {
		return AppConfig{}, err
	}

	// Unmarshal all keys into the typed struct — the ONLY place touching raw config.
	var cfg AppConfig
	if err := viper.Unmarshal(&cfg); err != nil {
		return AppConfig{}, err
	}
	return cfg, nil
}
