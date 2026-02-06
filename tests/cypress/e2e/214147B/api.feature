Feature: Plant Management API

  @API-PM-001
  Scenario: Admin creates plant with valid data
    Given I assume the application is running
    And I authenticate as "admin"
    When I request "POST" "/api/plants" with body:
      """
      {
        "name": "Aloe Vera",
        "price": 12.50,
        "quantity": 50,
        "categoryId": 1
      }
      """
    Then the response status should be 201
    And the response body should not be empty
    When I capture the id as "newPlantId"
    And I request "GET" "/api/plants/{newPlantId}" with "newPlantId" as "newPlantId"
    Then the response status should be 200
    And the response body should contain "Aloe Vera"
