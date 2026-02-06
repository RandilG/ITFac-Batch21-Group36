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

  Scenario: UI-ADM-E-03 Data tables display correctly
    Given I am on the login page
    When I login as "admin" with password "admin123"
    When I click "Categories" in navigation
    Then I should see the "Categories" table with data
    When I click "Plants" in navigation
    Then I should see the "Plants" table displaying "Price" and "Stock" columns
    When I click "Sales" in navigation
    Then I should see the "Sales" table with data

  Scenario: UI-ADM-E-04 Admin action buttons visible
    Given I am on the login page
    When I login as "admin" with password "admin123"
    When I click "Categories" in navigation
    Then I should see "Add A Category" button
    When I click "Plants" in navigation
    Then I should see "Add a Plant" button
    When I click "Sales" in navigation
    Then I should see the heading "Sales"
    And I should see "Sell Plant" button

  Scenario: UI-ADM-E-05 Admin session stability
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Categories" in navigation
    Then I should see the heading "Categories"
    When I click "Plants" in navigation
    Then I should see the heading "Plants"
    When I click "Sales" in navigation
    Then I should see the heading "Sales"
    When I click "Dashboard" in navigation
    Then I should see the heading "Dashboard"
    And I should see summary statistics for "Categories", "Plants", and "Sales"
    And I should see the navigation menu

  Scenario: UI-USR-E-01 User dashboard without admin actions
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    And I should see the navigation menu
    And I should not see "Add A Category" button
    And I should not see "Add a Plant" button
    And I should not see "Sell Plant" button

  Scenario: UI-USR-E-02 User navigates read-only pages
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Categories" in navigation
    Then I should see the "Categories" table with data
    And I should not see "Add A Category" button
    When I click "Plants" in navigation
    Then I should see the "Plants" table with data
    And I should not see "Add a Plant" button
    When I click "Sales" in navigation
    Then I should see the "Sales" table with data
    And I should not see "Sell Plant" button

  Scenario: UI-USR-E-03 User views tables without edit capabilities
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Categories" in navigation
    Then I should see the "Categories" table with data
    And I should not see "Add A Category" button
    When I click "Plants" in navigation
    Then I should see the "Plants" table with data
    And I should not see "Add a Plant" button
    When I click "Sales" in navigation
    Then I should see the "Sales" table with data
    And I should not see "Sell Plant" button

  Scenario: UI-USR-E-04 User session stability
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Categories" in navigation
    Then I should see the heading "Categories"
    When I click "Plants" in navigation
    Then I should see the heading "Plants"
    When I click "Sales" in navigation
    Then I should see the heading "Sales"
    When I click "Dashboard" in navigation
    Then I should see the heading "Dashboard"

  Scenario: UI-USR-E-05 User browser navigation
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Categories" in navigation
    Then I should see the heading "Categories"
    When I click "Plants" in navigation
    Then I should see the heading "Plants"
    When I go back in browser history
    Then I should see the heading "Categories"
    And I should still be logged in as "testuser"
