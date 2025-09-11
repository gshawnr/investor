# How to Update Data Financial Data

This guide explains how to update different types of financial data in the app.

## Table of Contents

1. [Overview](#overview)
2. [Updating financial statements](#updating-financial-statments)
   - [Update User Information](#update-user-information)
   - [Update Product Information](#update-product-information)
   - [Update Settings](#update-settings)
3. [Updating Exchange Rates](#updating-data-via-api)
   - [Authentication](#authentication)
   - [Update Endpoints](#update-endpoints)
4. [Updating Targets & Favorites](#common-issues--troubleshooting)

## Overview

The primary goal is to fetch any released financial data that has not already been fetched and then process it accordingly. primary financial statements that wil be fetched are the Balance Sheet, Income Statement and Cashflow Statement.

### Methods

- **Via the API** (using Postman)
- **Via the web interface** (not yet available)

## Updating Financial Statements

1. Use must be [Authenticated](#authentication) to call the endpoints.
2. Use /fetch/all endpoint with QPs for limit and ticker to fetch all statments. For only the most recent statement set "limit" QP to 1.
3. Wait until all statements fetched before proceeding
4. Ensure exchange rates exist for current year (currently: USD, CAD, GBP, TWD, JPY, EUR).
5. Refresh / Fetch all prices for the current year using the /fetch/prices endpoint. Use the from QP to select the period the start of the current year in the form of YYYY-MM-DD.
6. Run POST /summaries with empty body to create all summaries. Use "fiscal_year" to create by year.
7. Run POST /metrics with empty body to create all metrics. Use "fiscal_year" to create by year.
8. Run POST /targets to create targets. Use "fiscal_year" in boyd to create by year.

### Update User Information

1. Navigate to **Profile** from the top menu.

### Update Product Information

1. Go to the **Products** section.

### Update Settings

1. Navigate to **Settings** from the sidebar.

## Updating Data via API

### Authentication

To update data via the API, you need to include your **JWT token** in the `Authorization` header:

1. Start with the /users/login endpoint to get your jwt token.
2. In Postman, add the token to the Auth tab of the Investor folder with Auth Type of Bearer Token.

```http
Authorization: Bearer <your_token_here>
```
