# Test flows for 2-production-ready-config-and-logging

## Flow 1 -- Verify global logger override (`GET /` on local profile)
**Purpose:** confirm `app.useLogger(WINSTON_MODULE_NEST_PROVIDER)` replaced Nest's default Logger and that the runtime status echoes the local config.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/`
**Command (curl):** `curl -s http://localhost:3000/`
**Expected response (HTTP 200):**
```json
{
  "message": "local - config-and-logging-ready",
  "env": "local",
  "appName": "local",
  "appVersion": "0.0.1",
  "appPort": 3000
}
```
**Pass criteria:** terminal shows Winston `nestLike`-formatted log lines (with `[<context>]` and colours), proving the override took effect.

## Flow 2 -- Compare local vs production (`envFilePath` swap)
**Purpose:** confirm app identity is config-driven; switching `envFilePath` to `.env.production` changes the response without any source edit beyond `app.module.ts`.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/`
**Command (curl):** `curl -s http://localhost:3000/`
**Steps:**
1. Run with `.env.local` first -- response shows `"env": "local"`.
2. Edit `src/app.module.ts` to uncomment `".env.production"` and comment out `".env.local"`, restart.
3. Hit `GET /` again -- response shows `"env": "production"`.

**Expected response (HTTP 200) -- production profile:**
```json
{
  "message": "production - config-and-logging-ready",
  "env": "production",
  "appName": "production",
  "appVersion": "0.0.1",
  "appPort": 3000
}
```
**Pass criteria:** the `env`, `message`, and `appName` fields all flip from `local` → `production` without code changes outside `app.module.ts`.

## Flow 3 -- Verify typed AppConfig snapshot (`GET /config`)
**Purpose:** confirm `ConfigService.get<AppConfig>("app")` returns the full namespace as a typed object with no `any`.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/config`
**Command (curl):** `curl -s http://localhost:3000/config`
**Expected response (HTTP 200) -- local profile:**
```json
{
  "name": "local",
  "version": "0.0.1",
  "port": 3000,
  "nodeEnv": "local",
  "logFilePath": "logs/app.log"
}
```
**Pass criteria:** all five `AppConfig` keys present, values match the `.env.local` file; types are correct (`port` is a number, others are strings).

## Flow 4 -- Verify Winston file transport writes structured JSON (`logs/app.log`)
**Purpose:** confirm the file transport actually persists log lines and that each line is structured JSON, not plain text.
**Command (PowerShell):**
```powershell
# Trigger a few logs first
Invoke-RestMethod -Uri http://localhost:3000/
Invoke-RestMethod -Uri http://localhost:3000/config
# Inspect the tail
Get-Content -Tail 5 .\logs\app.log
```
**Command (curl):**
```bash
curl -s http://localhost:3000/ > /dev/null
curl -s http://localhost:3000/config > /dev/null
tail -n 5 logs/app.log
```
**Expected output:** each tailed line is a valid JSON object with at minimum `level`, `message`, `timestamp` keys, e.g.:
```json
{ "level": "info", "message": "GET / called - returning runtime config status", "timestamp": "2026-05-23T10:21:14.082Z" }
{ "level": "info", "message": "GET /config called - returning AppConfig snapshot", "timestamp": "2026-05-23T10:21:18.913Z" }
```
**Pass criteria:** `logs/app.log` exists at the path declared by `AppConfig.logFilePath`; each tailed line is valid JSON; entries from BOTH `GET /` and `GET /config` are present (proves the same Winston instance handles every log call).
