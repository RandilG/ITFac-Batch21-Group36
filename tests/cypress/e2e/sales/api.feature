Feature: Sales Management - API Test

  Background:
    Given I assume the application is running

  Scenario: API-SM-E-001 Admin retrieves sales history
    When I authenticate as "admin"
    And I request "GET" "/api/sales"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not be empty

  Scenario: API-SM-E-002 User retrieves sales history
    When I authenticate as "user"
    And I request "GET" "/api/sales"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-SM-E-003 Admin successfully creates a sale
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=2" with "1" as "id"
    Then the response status should be 201
    And the response body should be valid JSON

  Scenario: API-SM-E-004 User prohibited from creating a sale
    When I authenticate as "user"
    And I request "POST" "/api/sales/plant/{id}?quantity=1" with "1" as "id"
    Then the response status should be 403

  Scenario: API-SM-E-005 Sale creation fails with zero quantity
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=0" with "1" as "id"
    Then the response status should be 400
    And the response body should contain "Quantity must be greater than 0"

  Scenario: API-SM-E-006 Sale creation fails with negative quantity
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=-5" with "1" as "id"
    Then the response status should be 400
    And the response body should contain "Quantity must be greater than 0"

  Scenario: API-SM-E-007 Sale creation fails on insufficient stock
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=1000" with "1" as "id"
    Then the response status should be 400
    And the response body should be valid JSON

  Scenario: API-SM-E-008 Admin successfully deletes a sale
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=1" with "1" as "id"
    Then the response status should be 201
    When I capture the id as "saleId"
    And I request "DELETE" "/api/sales/{id}" with "saleId" as "id"
    Then the response status should be 200

  Scenario: API-SM-E-009 User prohibited from deleting a sale
    When I authenticate as "admin"
    And I request "POST" "/api/sales/plant/{id}?quantity=1" with "1" as "id"
    Then the response status should be 201
    When I capture the id as "saleId"
    And I authenticate as "user"
    And I request "DELETE" "/api/sales/{id}" with "saleId" as "id"
    Then the response status should be 403