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

## Flow 3 -- Verify path param + service findById (`GET /cats/:id`)
**Purpose:** confirm built-in `ParseIntPipe` coerces the path param and the service returns either the entity or `undefined`, which the controller maps to a clean 404.
**Command (PowerShell):**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/cats/1
Invoke-RestMethod -Uri http://localhost:3000/cats/999
```
**Command (curl):**
```bash
curl -s http://localhost:3000/cats/1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/cats/999
```
**Expected response (HTTP 200) for id=1:**
```json
{ "id": 1, "name": "Milo" }
```
**Expected response (HTTP 404) for id=999:**
```json
{
  "message": "Cat with id 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```
**Pass criteria:** id=1 returns the cat; id=999 returns HTTP 404 with the message above (NOT HTTP 500 — proves `NotFoundException` is thrown correctly).

## Flow 4 -- Verify cross-module DI exposes full CatService API (`GET /dogs/cats-via-di`)
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
