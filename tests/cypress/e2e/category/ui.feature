Feature: Category Management - UI Test

  Scenario: UI-CM-001 Add new category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see "Add A Category" button
    When I click "Add A Category" button
    And I enter "NewCat123" in "name" field
    And I submit the form
    Then I should see "NewCat123" in the category list

  Scenario: UI-CM-002 Validate category name length
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see "Add A Category" button
    When I click "Add A Category" button
    And I submit the form without entering data
    Then I should see a validation error
    And no new category should be created

  Scenario: UI-CM-003 View category hierarchy
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see the "Categories" table with data

  Scenario: UI-CM-004 Edit category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see "Add A Category" button
    Given a category named "OldName456" exists
    Then I should see "OldName456" in the category list
    When I click "Edit" button for "OldName456"
    And I clear and enter "NewName789" in "name" field
    And I save the changes
    Then I should see "NewName789" in the category list
    And I should not see "OldName456" in the category list

  Scenario: UI-CM-005 Delete category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see "Add A Category" button
    Given a category named "ToDelete99" exists
    Then I should see "ToDelete99" in the category list
    When I click "Delete" button for "ToDelete99"
    And I confirm the deletion
    Then I should not see "ToDelete99" in the category list

  Scenario: UI-CM-006 Admin session persistence
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    When I click "Plants" in navigation
    Then I should see the heading "Plants"
    When I click "Sales" in navigation
    Then I should see the heading "Sales"
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see "Add A Category" button

  Scenario: UI-CM-007 Admin dashboard display
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    And I should see summary statistics for "Categories", "Plants", and "Sales"
    And I should see the navigation menu
    And the dashboard content should be displayed

  Scenario: UI-CM-008 User views categories only
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    When I click "Categories" in navigation
    Then I should see the heading "Categories"
    And I should see the "Categories" table with data
    And I should not see "Add A Category" button
    And I should not see any "Edit" buttons
    And I should not see any "Delete" buttons

  Scenario: UI-CM-009 Prevent direct admin URL access
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    When I navigate directly to "/admin/categories"
    Then I should be redirected or see access denied

  Scenario: UI-CM-010 User dashboard navigation
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    And I should see the navigation menu
    And I should not see "Add A Category" button
    And I should not see "Add a Plant" button
    And I should not see "Sell Plant" button
