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
