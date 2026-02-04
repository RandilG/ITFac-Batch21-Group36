Feature: Category Management - UI Test

  Scenario: UI-CM-001 Add new category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I should see "Add Category" button
    And I click "Add Category" button
    And I enter "NewCat" in "name" field
    And I submit the form
    Then I should see "NewCat" in category list

  Scenario: UI-CM-002 Validate category name length
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I should see "Add Category" button
    And I click "Add Category" button
    And I submit the form
    Then I should see validation error
    And the category should not be created

  Scenario: UI-CM-003 View category hierarchy
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I should see category hierarchy

  Scenario: UI-CM-004 Edit category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I click "Add Category" button
    And I enter "OldName" in "name" field
    And I submit the form
    Then I should see "OldName" in category list
    And I click "Edit" button for "OldName"
    And I enter "NewName" in "name" field
    And I save the changes
    Then I should see "NewName" in category list

  Scenario: UI-CM-005 Delete category via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I click "Add Category" button
    And I enter "ToDelete" in "name" field
    And I submit the form
    Then I should see "ToDelete" in category list
    And I click "Delete" button for "ToDelete"
    And I confirm the deletion
    Then I should not see "ToDelete" in category list

  Scenario: UI-CM-006 Admin session persistence
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I click "Categories" in navigation
    And I click "Plants" in navigation
    And I click "Sales" in navigation
    And I click "Categories" in navigation
    Then I should see the dashboard
    And I should see "Add Category" button

  Scenario: UI-CM-007 Admin dashboard display
    Given I am on the login page
    When I login as "admin" with password "admin123"
    Then I should see the dashboard
    And I should see summary statistics
    And I should see the navigation menu
    And I should see the content area

  Scenario: UI-CM-008 User views categories only
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I click "Categories" in navigation
    And I should see category list
    And I should not see "Add Category" button

  Scenario: UI-CM-009 Prevent direct admin URL access
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I navigate directly to "/admin/categories"
    Then I should see access denied or redirect to dashboard

  Scenario: UI-CM-010 User dashboard navigation
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    And I should see limited navigation menu
    And I should not see admin options