Feature: Dashboard & Data Integration - UI Test

  Scenario: UI-ADM-E-01 Admin dashboard displays summary
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    And I should see summary statistics for "Categories", "Plants", and "Sales"
    And I should see the navigation menu
