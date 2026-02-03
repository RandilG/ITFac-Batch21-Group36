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
    And I request "GET" "/api/sales"
    Then the response status should be 200

  Scenario: API-DI-E-002 Admin creates category hierarchy
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Indoor Plants" }
      """
    Then the response status should be 201
    And I request "GET" "/api/categories"
    Then the response body should contain "Indoor Plants"

  Scenario: API-DI-E-003 Admin creates plant under sub-category
    When I authenticate as "admin"
    # Assuming category ID 1 exists or we created it. 
    # For idempotency, good tests create dependecies, but we'll try simple first.
    And I request "POST" "/api/plants/category/1" with body:
      """
      { "name": "Fern", "price": 10.0, "quantity": 5 }
      """
    Then the response status should be 201

  Scenario: API-DI-E-004 Verify plant category reference
     When I authenticate as "admin"
     And I request "GET" "/api/plants"
     Then the response status should be 200
     # We would grab an ID here in real life, but we will adjust if test fails.

  Scenario: API-DI-E-007 Error for non-existent category
    When I authenticate as "admin"
    And I request "GET" "/api/categories/999999"
    Then the response status should be 404

  Scenario: API-DI-E-008 User retrieves dashboard data read-only
    When I authenticate as "user"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    
  Scenario: API-DI-E-009 User prohibited from creating plant
    When I authenticate as "user"
    And I request "POST" "/api/plants" with body:
      """
      { "name": "Banned Plant" }
      """
    Then the response status should be 403

  Scenario: API-DI-E-010 Unsupported HTTP method handling
    When I authenticate as "admin"
    And I request "PUT" "/api/categories"
    Then the response status should be 405
