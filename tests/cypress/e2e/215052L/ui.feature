Feature: Dashboard & Data Integration - UI Test

  Scenario: UI-ADM-E-01 Admin dashboard displays summary
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    And I should see summary statistics for "Categories", "Plants", and "Sales"
    And I should see the navigation menu

  Scenario: UI-ADM-E-02 Admin navigates complete workflow
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    When I click "Plants" in navigation
    Then I should see the heading "Plants"
    When I click "Sales" in navigation
    Then I should see the heading "Sales"
    When I click "Dashboard" in navigation
    Then I should see the heading "Dashboard"
