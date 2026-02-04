Feature: Dashboard & Data Integration - UI Test

  Scenario: UI-ADM-E-01 Admin dashboard displays summary
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    And I should see summary statistics
    And I should see the navigation menu

  Scenario: UI-ADM-E-02 Admin navigates complete workflow
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    Then I click "Plants" in navigation
    Then I click "Sales" in navigation
    Then I click "Dashboard" in navigation

  Scenario: UI-ADM-E-04 Admin action buttons visible
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    Then I should see "Add Category" button

  Scenario: UI-USR-E-01 User dashboard without admin actions
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    And I should not see "Add Category" button
