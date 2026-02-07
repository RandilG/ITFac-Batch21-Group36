Feature: Sales Management API Automation
  Background: Given the application is running

  Scenario Outline: Verify <role> can view sales history
    Given I am logged in as "<role>" via API
    When I send a GET request to "/api/sales"
    Then the response status code should be 200
    And the response should contain a list of sales
    Examples:
      | role  |
      | Admin |
      | User  |

  Scenario: Admin successfully creates a sale via API
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "2"
    Then the response status code should be 201

  Scenario: User cannot create a sale
    Given I am logged in as "User" via API
    When I request to sell plant ID "1" with quantity "1"
    Then the response status code should be 403

  Scenario Outline: Fail sale creation with invalid quantity
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "<qty>"
    Then the response status code should be 400
    And the sales API error message should be "Quantity must be greater than 0"
    Examples:
      | qty |
      | 0   |
      | -5  |

  Scenario: Fail on Insufficient Stock
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "1000"
    Then the response status code should be 400

  Scenario: API-SM-011 Verify admin can retrieve individual sale by ID
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "1"
    And I note the sale ID
    And I send a GET request for that specific sale ID
    Then the response status code should be 200
    And the response should contain the correct sale details

  Scenario: Admin Delete Sale (Success)
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "1"
    And I note the sale ID
    When I send a DELETE request to that sale ID
    Then the response status code should be 200

  Scenario: User Delete Sale (Fail)
    Given I am logged in as "Admin" via API
    When I request to sell plant ID "1" with quantity "1"
    And I note the sale ID
    Given I am logged in as "User" via API
    When I send a DELETE request to that sale ID
    Then the response status code should be 403

  Scenario: API-SM-013 Verify API returns 404 for non-existent sale ID
    Given I am logged in as "Admin" via API
    When I send a GET request to "/api/sales/999999"
    Then the response status code should be 404