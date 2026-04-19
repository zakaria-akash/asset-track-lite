# Asset Track Lite API Reference

This document summarizes the stable MVP HTTP contracts for all backend
route handlers.

## Base URL

- Local development: <http://localhost:3000>
- API prefix: /api

## Response Format

### Success

```json
{
  "ok": true,
  "data": {},
  "message": "Optional human-readable message"
}
```

### Error

```json
{
  "ok": false,
  "error": "Short error label",
  "details": [
    "Optional validation item 1",
    "Optional validation item 2"
  ]
}
```

## Endpoints

## GET /api/assets

Returns all assets with computed depreciation snapshot fields.

### Example request

```bash
curl -X GET http://localhost:3000/api/assets
```

### GET /api/assets success response

```json
{
  "ok": true,
  "data": [
    {
      "id": "A001",
      "name": "Dell Latitude 7420",
      "category": "Laptop",
      "purchasePrice": 1450,
      "purchaseDate": "2023-01-10",
      "usefulYears": 4,
      "status": "in-use",
      "depreciation": {
        "yearsPassed": 3,
        "annualDepreciation": 362.5,
        "totalDepreciation": 1087.5,
        "currentValue": 362.5
      }
    }
  ]
}
```

## POST /api/assets

Creates a new asset after server-side validation.

### POST /api/assets required body fields

- name
- category
- purchaseDate
- purchasePrice
- usefulYears

### POST /api/assets example request

```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HP ProBook 450",
    "category": "Laptop",
    "purchaseDate": "2025-02-01",
    "purchasePrice": 1200,
    "usefulYears": 4,
    "status": "in-use"
  }'
```

### POST /api/assets success response

```json
{
  "ok": true,
  "data": {
    "id": "A010",
    "name": "HP ProBook 450",
    "category": "Laptop"
  },
  "message": "Asset created successfully"
}
```

### Example validation error response

```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [
    "name is required",
    "purchasePrice must be a positive number"
  ]
}
```

## GET /api/assets/:id

Returns one asset by id.

### GET /api/assets/:id example request

```bash
curl -X GET http://localhost:3000/api/assets/A001
```

### Example not-found response

```json
{
  "ok": false,
  "error": "Asset not found"
}
```

## PATCH /api/assets/:id

Partially updates an asset. Common use: status update.

### PATCH /api/assets/:id example request

```bash
curl -X PATCH http://localhost:3000/api/assets/A001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "retired"
  }'
```

### PATCH /api/assets/:id success response

```json
{
  "ok": true,
  "data": {
    "id": "A001",
    "status": "retired"
  },
  "message": "Asset updated successfully"
}
```

## DELETE /api/assets/:id

Deletes an asset by id.

### DELETE /api/assets/:id example request

```bash
curl -X DELETE http://localhost:3000/api/assets/A001
```

### DELETE /api/assets/:id success response

```json
{
  "ok": true,
  "data": {
    "id": "A001"
  },
  "message": "Asset deleted successfully"
}
```

## POST /api/maintenance

Adds one maintenance entry to an existing asset.

### POST /api/maintenance required body fields

- assetId
- date
- type
- cost

### POST /api/maintenance example request

```bash
curl -X POST http://localhost:3000/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": "A001",
    "date": "2026-04-19",
    "type": "inspection",
    "cost": 25,
    "note": "Quarterly preventive check"
  }'
```

### POST /api/maintenance success response

```json
{
  "ok": true,
  "data": {
    "assetId": "A001",
    "maintenanceId": "M-20260419-001"
  },
  "message": "Maintenance record added"
}
```

## POST /api/search

Searches assets by free text and optional filters.

### Supported body fields

- query
- category
- status
- code
- serial

### POST /api/search example request

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "dell",
    "category": "Laptop",
    "status": "in-use"
  }'
```

### POST /api/search success response

```json
{
  "ok": true,
  "data": [
    {
      "id": "A001",
      "name": "Dell Latitude 7420",
      "category": "Laptop",
      "status": "in-use"
    }
  ]
}
```

## Notes

- Fields shown in examples are representative and may include additional
  properties returned by the current implementation.
- If persistence is migrated from JSON to a database, keep route paths and
  response structure stable to avoid frontend breaking changes.
