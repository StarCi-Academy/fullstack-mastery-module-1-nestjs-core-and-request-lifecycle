# Test flows for 1-request-lifecycle

## Flow 1 -- Verify response wrapper (`GET /items`)
**Purpose:** confirm the middleware → guard → interceptor chain produces the `{ data, timestamp, requestId, executionMs }` envelope.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/items`
**Command (curl):** `curl -s http://localhost:3000/items`
**Expected response (HTTP 200):**
```json
{
  "data": [
    { "id": 1, "name": "keyboard" },
    { "id": 2, "name": "mouse" }
  ],
  "timestamp": "<ISO-timestamp>",
  "requestId": "<uuid>",
  "executionMs": 1
}
```
**Pass criteria:** all four keys present; `requestId` is a UUID; `executionMs` is a non-negative number.

## Flow 2 -- Verify Pipe rejects invalid input (`GET /items/-1`)
**Purpose:** confirm `ParsePositiveIntPipe` blocks `-1` before the handler runs, returning HTTP 400.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/items/-1`
**Command (curl):** `curl -s http://localhost:3000/items/-1`
**Expected response (HTTP 400):**
```json
{
  "message": "id must be a positive integer",
  "error": "Bad Request",
  "statusCode": 400
}
```
**Pass criteria:** HTTP 400, message exactly `"id must be a positive integer"`; the handler did NOT execute.

## Flow 3 -- Verify Pipe happy path + dynamic wrapper (`GET /items/10`)
**Purpose:** confirm Pipe coerces any positive integer (not just `5`) and the interceptor wraps the dynamic payload.
**Command (PowerShell):** `Invoke-RestMethod -Uri http://localhost:3000/items/10`
**Command (curl):** `curl -s http://localhost:3000/items/10`
**Expected response (HTTP 200):**
```json
{
  "data": { "id": 10, "name": "item-10" },
  "timestamp": "<ISO-timestamp>",
  "requestId": "<uuid>",
  "executionMs": 1
}
```
**Pass criteria:** `data.id === 10`, `data.name === "item-10"`; wrapper keys all present.

## Flow 4 -- Verify Guard layer (`GET /items/restricted?role=`)
**Purpose:** confirm `RoleGuard` reads `request.query.role` and gates the handler with HTTP 403 for non-admin roles.
**Command (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/items/restricted?role=admin"
Invoke-RestMethod -Uri "http://localhost:3000/items/restricted?role=guest"
```
**Command (curl):**
```bash
curl -s "http://localhost:3000/items/restricted?role=admin"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/items/restricted?role=guest"
```
**Expected response (HTTP 200) for `role=admin`:**
```json
{
  "data": [
    { "id": 1, "name": "keyboard" },
    { "id": 2, "name": "mouse" }
  ],
  "timestamp": "<ISO-timestamp>",
  "requestId": "<uuid>",
  "executionMs": 1
}
```
**Expected response (HTTP 403) for `role=guest`:**
```json
{
  "message": "Role \"guest\" is not allowed; expected \"admin\"",
  "error": "Forbidden",
  "statusCode": 403
}
```
**Pass criteria:** admin passes with the items list wrapped normally; guest gets HTTP 403 and the handler does not run.
