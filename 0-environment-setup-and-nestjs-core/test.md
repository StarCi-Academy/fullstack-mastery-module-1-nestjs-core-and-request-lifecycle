# Test flows for 0-environment-setup-and-nestjs-core

## Flow 1 -- Verify app boot and routing (`GET /cats`)
**Purpose:** confirm NestJS bootstraps successfully and the `CatController` route maps to `CatService.getCats()`.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/cats`
**Command (curl):** `curl -s http://localhost:3000/cats`
**Expected response (HTTP 200):**
```json
[
  { "id": 1, "name": "Milo" },
  { "id": 2, "name": "Luna" }
]
```
**Pass criteria:** body matches the JSON above exactly; no bootstrap error in terminal.

## Flow 2 -- Verify cross-module dependency (`GET /dogs/spy`)
**Purpose:** confirm `DogModule` imports `CatModule`, `CatService` is exported, and `DogService` receives the singleton via constructor injection.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/dogs/spy`
**Command (curl):** `curl -s http://localhost:3000/dogs/spy`
**Expected response (HTTP 200):**
```json
{
  "mission": "cross-module-dependency-check",
  "dependency": "cat-network-ready",
  "status": "ok"
}
```
**Pass criteria:** `dependency` equals `"cat-network-ready"` (proves `catService.getSpyHint()` actually executed inside `DogService`).

## Flow 3 -- Path-param 200 hit (`GET /cats/1`)
**Purpose:** confirm built-in `ParseIntPipe` coerces the path param and `CatService.findById(1)` returns the matching entity which the controller serialises as JSON.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/cats/1`
**Command (curl):** `curl -s http://localhost:3000/cats/1`
**Expected response (HTTP 200):**
```json
{ "id": 1, "name": "Milo" }
```
**Pass criteria:** body matches exactly; `id` is a numeric `1` (proves `ParseIntPipe` coerced the URL segment from string to number before the handler ran).

## Flow 4 -- Path-param 404 miss (`GET /cats/999`)
**Purpose:** confirm `CatService.findById(999)` returns `undefined` and the controller maps that to a clean HTTP 404 via `NotFoundException`.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/cats/999`
**Command (curl):** `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/cats/999`
**Expected response (HTTP 404):**
```json
{
  "message": "Cat with id 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```
**Pass criteria:** status is 404 (NOT 500 — proves `NotFoundException` was thrown, not an unhandled error) and body has all three keys above.

## Flow 5 -- Verify cross-module DI exposes full CatService API (`GET /dogs/cats-via-di`)
**Purpose:** confirm exporting `CatService` from `CatModule` exposes every public method (not just the spy hint) to importing modules, and that the IoC container reuses the same singleton.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/dogs/cats-via-di`
**Command (curl):** `curl -s http://localhost:3000/dogs/cats-via-di`
**Expected response (HTTP 200):**
```json
{
  "dog": "Rex",
  "borrowedCats": [
    { "id": 1, "name": "Milo" },
    { "id": 2, "name": "Luna" }
  ]
}
```
**Pass criteria:** `borrowedCats` array equals exactly the response of `GET /cats` (same singleton, full API surface available).
