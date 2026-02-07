Feature: UI - Business Logic & Functional Tests - Student 214241H

  Scenario: UI-01 Pagination - Plants
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the plants page
    Then I should see the plants table
    And I should see pagination controls
    And the "Next" pagination button should be visible
    When I click the "Next" pagination button
    Then the page number should update
    And the "Previous" pagination button should be enabled

  Scenario: UI-02 Pagination - Categories
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the categories page
    Then I should see the category list
    And I should see pagination controls
    And the "Next" pagination button should be visible
    When I click the "Next" pagination button
    Then the page number should update

  Scenario: UI-03 Pagination - Sales
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see the sales table
    And I should see pagination controls
    And the "Next" pagination button should be visible
    When I click the "Next" pagination button
    Then the page number should update

  Scenario: UI-04 Plant Search Clear
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I navigate to the plants page
    And I enter "Rose" in the plant search field
    And I click the plant search button
    Then the plants table should show filtered results
    When I clear the plant search field
    And I click the plant search button
    Then the plants table should display all plants

  Scenario: UI-05 Search By Name
  Given I am on the login page
  When I login as "testuser" with password "test123"
  And I navigate to the plants page
  When I enter "Rose" in the plant search field
  And I click the plant search button
  Then the plants table should show filtered results

  Scenario: UI-06 No Results Message
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I navigate to the plants page
    When I enter "xyz123nonexistent" in the plant search field
    And I click the plant search button
    Then I should see no plants found message

  Scenario: UI-07 Category Filter + Search
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I navigate to the plants page
    And I should see the category filter dropdown
    When I select the first category from the filter dropdown
    And I enter "Plant" in the plant search field
    And I click the plant search button
    Then the plants table should show filtered results
    And the results should match both filter criteria

  Scenario: UI-08 Form Validation Retains Data
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the plants page
    And I click "Add a Plant"
    When I enter price "25.00"
    And I enter quantity "10"
    And I click "Save"
    Then I should see a validation error for name field
    And the price field should retain value "25.00"
    And the quantity field should retain value "10"

  Scenario: UI-09 Validation Clears on Fix
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the plants page
    And I click "Add a Plant"
    When I click "Save"
    Then I should see a validation error for name field
    When I enter plant name "Tulip"
    Then the name validation error should be cleared

 Scenario: UI-10 Save Plant Redirects to List
  Given I am on the login page
  When I login as "admin" with password "admin123"
  And I navigate to the plants page
  And I click "Add a Plant"
  And I enter plant name "TestPlant"
  And I select the first available category
  And I enter price "19.99"
  And I enter quantity "25"
  And I click "Save"
  Then I should see the plants table
