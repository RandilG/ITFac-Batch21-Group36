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
