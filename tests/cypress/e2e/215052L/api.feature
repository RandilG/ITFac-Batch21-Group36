Feature: Dashboard & Data Integration - API Test

  Background:
    Given I assume the application is running

  Scenario: API-DI-E-001 Admin setup and dashboard check
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Indoor" }
      """
    Then the response status should be 201
    And I capture the id as "catId"
    And I request "POST" "/api/plants/category/{id}" with "catId" as "id" and body:
      """
      { "name": "Fern", "price": 10.0, "quantity": 5 }
      """
    Then the response status should be 201
    And I capture the id as "plantId"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not be empty
    And I request "GET" "/api/plants"
    Then the response status should be 200
    And the response body should not be empty
    And I request "GET" "/api/sales"
    Then the response status should be 200

  Scenario: API-DI-E-003 Admin creates plant under sub-category
    When I authenticate as "admin"
    And I request "POST" "/api/plants/category/{id}" with "catId" as "id" and body:
      """
      { "name": "Fern", "price": 10.0, "quantity": 5 }
      """
    Then the response status should be 201

  Scenario: API-DI-E-004 Verify plant category reference
     When I authenticate as "admin"
     And I request "GET" "/api/plants"
     Then the response status should be 200

  Scenario: API-DI-E-007 Error for non-existent category
    When I authenticate as "admin"
    And I request "GET" "/api/categories/999999"
    Then the response status should be 404

  Scenario: API-DI-E-008 User retrieves dashboard data read-only
    When I authenticate as "testuser"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    
  Scenario: API-DI-E-009 User prohibited from creating plant
    When I authenticate as "testuser"
    And I request "POST" "/api/plants/category/{id}" with "catId" as "id" and body:
      """
      { "name": "Banned Plant", "price": 10.0, "quantity": 1 }
      """
    Then the response status should be 403

  Scenario: API-DI-E-010 Unsupported HTTP method handling
    When I authenticate as "admin"
    And I request "PUT" "/api/categories"
    Then the response status should be 405

  Scenario: API-INV-E-001 Admin adjusts stock IN for a plant
    When I authenticate as "admin"
    And I request "POST" "/api/inventory/plant/{id}" with "plantId" as "id" and body:
      """
      { "quantity": 10, "type": "IN", "remark": "Restock" }
      """
    Then the response status should be 201

  Scenario: API-INV-E-002 Admin adjusts stock OUT for a plant
    When I authenticate as "admin"
    And I request "POST" "/api/inventory/plant/{id}" with "plantId" as "id" and body:
      """
      { "quantity": 5, "type": "OUT", "remark": "Sale" }
      """
    Then the response status should be 201

  Scenario: API-INV-E-003 Admin retrieves inventory history for a plant
    When I authenticate as "admin"
    And I request "GET" "/api/inventory/plant/{id}" with "plantId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-INV-E-004 User prohibited from adjusting stock
    When I authenticate as "testuser"
    And I request "POST" "/api/inventory/plant/{id}" with "plantId" as "id" and body:
      """
      { "quantity": 10, "type": "IN", "remark": "Unauthorized" }
      """
    Then the response status should be 403

  Scenario: API-INV-E-005 Error for non-existent plant during stock adjustment
    When I authenticate as "admin"
    And I request "POST" "/api/inventory/plant/999999" with body:
      """
      { "quantity": 10, "type": "IN", "remark": "Non-existent plant" }
      """
    Then the response status should be 404
