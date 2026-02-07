Feature: Plant Management - UI Test
  Member: 214147B

  Scenario: UI-PM-001 Admin accesses plant management dashboard
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Plants" in navigation
    Then I should be on the "ui/plants" page
    And I should see the heading "Plants"
    And I should see the "Plants" table with data

  Scenario: UI-PM-002 Admin adds new plant via form
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Plants" in navigation
    And I click "Add a"
    And I enter "P02_{timestamp}" into "Name" field
    And I enter "150.0" into "Price" field
    And I enter "20" into "Quantity" field
    And I select the first option from "Category" dropdown
    And I click "Save" button
    Then I should see a success message "Plant added successfully"
    And I should see "P02_" in the table

  Scenario: UI-PM-003 Plant form validates empty fields
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Plants" in navigation
    And I click "Add a"
    And I click "Save" button
    Then I should see validation error "Plant name is required"
    And I should see validation error "Price is required"

  Scenario: UI-PM-004 Admin edits existing plant price
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Plants" in navigation
    And I click the edit icon on the first row
    And I clear and enter "999" into "Price" field
    And I click "Save" button
    Then I should see a success message "Plant updated successfully"
    And I should see "999" in the table

  Scenario: UI-PM-005 Admin deletes plant from list
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Plants" in navigation
    And I click the delete icon on the first row
    And I confirm the deletion
    Then I should see a success message "Plant deleted successfully"

  Scenario: UI-PM-006 User views plant listing page
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Plants" in navigation
    Then I should be on the "ui/plants" page
    And I should see the heading "Plants"
    And I should see "Name" column in the table
    And I should see "Category" column in the table
    And I should see "Price" column in the table

  Scenario: UI-PM-007 User cannot see Add Plant button
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Plants" in navigation
    Then I should be on the "ui/plants" page
    And I should not see "Add a" button

  Scenario: UI-PM-008 User cannot see edit/delete actions
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Plants" in navigation
    Then I should be on the "ui/plants" page
    And I should not see any action buttons in the table

  Scenario: UI-PM-009 User blocked from plant addition URL
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I visit "/ui/plants/add"
    And I should see the message "403 - Access Denied"

  Scenario: UI-10 Save Plant Redirects to List
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the plants page
    And I click "Add a Plant"
    And I enter plant name "BackButtonTestPlant"
    And I select the first available category
    And I enter price "19.99"
    And I enter quantity "25"
    And I click "Save"
    Then I should see the plants table
