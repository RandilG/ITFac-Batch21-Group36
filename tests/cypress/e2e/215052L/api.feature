Feature: Dashboard & Data Integration - API Test

  Background:
    Given I assume the application is running

  Scenario: API-DI-E-001 Admin retrieves dashboard summary data
    When I authenticate as "admin"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    And the response body should be valid JSON
    And I request "GET" "/api/plants"
    Then the response status should be 200
    And the response body should be valid JSON
    And I request "GET" "/api/sales"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-DI-E-002 Admin creates category hierarchy
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "Cat_{timestamp}"
      }
      """
    Then the response status should be 201
    And the response body should be valid JSON
    When I capture the id as "parentCategoryId"
    And I request "POST" "/api/categories" with body using "parentCategoryId" as "parentId":
      """
      {
        "name": "Sub_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    And the response body should be valid JSON
    When I capture the id as "subCategoryId"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-DI-E-003 Admin creates plant in sub-category
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "Cat_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "parentCategoryId"
    And I request "POST" "/api/categories" with body using "parentCategoryId" as "parentId":
      """
      {
        "name": "Sub_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "subCategoryId"
    And I request "POST" "/api/plants/category/{id}" with "subCategoryId" as "id" and body:
      """
      {
        "name": "Plant_{timestamp}",
        "price": 50.0,
        "quantity": 100
      }
      """
    Then the response status should be 201
    And the response body should be valid JSON

  Scenario: API-DI-E-004 Admin validates plant-category relationship integrity
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "PRC_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "parentRelId"
    And I request "POST" "/api/categories" with body using "parentRelId" as "parentId":
      """
      {
        "name": "SRC_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "subRelId"
    And I request "POST" "/api/plants/category/{id}" with "subRelId" as "id" and body:
      """
      {
        "name": "RP_{timestamp}",
        "price": 15.0,
        "quantity": 20
      }
      """
    Then the response status should be 201
    When I capture the id as "plantId"
    And I request "GET" "/api/plants/{id}" with "plantId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body "categoryId" should match captured "subRelId"

  Scenario: API-DI-E-005 Admin records sale and verifies stock reduction
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "SC_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "saleParentId"
    And I request "POST" "/api/categories" with body using "saleParentId" as "parentId":
      """
      {
        "name": "SS_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "saleSubId"
    And I request "POST" "/api/plants/category/{id}" with "saleSubId" as "id" and body:
      """
      {
        "name": "SP_{timestamp}",
        "price": 10.0,
        "quantity": 100
      }
      """
    Then the response status should be 201
    When I capture the id as "salePlantId"
    And I request "POST" "/api/sales/plant/{id}?quantity=10" with "salePlantId" as "id"
    Then the response status should be 201
    When I request "GET" "/api/plants/{id}" with "salePlantId" as "id"
    Then the response status should be 200
    And the response body "quantity" should be 90

  Scenario: API-DI-E-006 Admin retrieves complete sales history
    When I authenticate as "admin"
    And I request "GET" "/api/sales"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not be empty

  Scenario: API-DI-E-007 Admin receives error for non-existent category
    When I authenticate as "admin"
    And I request "GET" "/api/categories/999999"
    Then the response status should be 404
    And the response body should be valid JSON
    And the response body should contain "not found"

  Scenario: API-DI-E-008 User retrieves dashboard data read-only
    When I authenticate as "user"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    And I request "GET" "/api/plants"
    Then the response status should be 200
    And I request "GET" "/api/sales"
    Then the response status should be 200

  Scenario: API-DI-E-009 User prohibited from creating plant
    When I authenticate as "user"
    And I request "POST" "/api/plants/category/1" with body:
      """
      {
        "name": "UnauthorizedPlant",
        "price": 10.0,
        "quantity": 100
      }
      """
    Then the response status should be 403 or 401

  Scenario: API-DI-E-010 Unsupported HTTP method handling
    When I authenticate as "admin"
    And I request "PUT" "/api/categories"
    Then the response status should be 500
