Feature: UI - Business Logic & Functional Tests - 214104R (Sales Management)

  Scenario: UI-SM-01 Access Control - Sell Plant Button
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see "Sales" in the body
    And I should see "Sell Plant" button
    And I should see the sales table

  Scenario: UI-SM-02 Table Structure - Column Verification
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see the sales table
    And the sales table should display the column "Plant Name"
    And the sales table should display the column "Quantity"
    And the sales table should display the column "Total Price"
    And the sales table should display the column "Sold Date"
    And the sales table should display the column "Actions"

  Scenario: UI-SM-03 Sell Plant Form - Dropdown Visibility
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    When I click "Sell Plant" button
    Then I should see the sale form
    And the plant dropdown should be visible
    And the plant dropdown should contain available plants
    And I should see the quantity input field

  Scenario: UI-SM-04 Sales Process - Successful Creation
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    When I click "Sell Plant" button
    And I select a plant from the dropdown
    And I enter "2" into "quantity" field
    And I click "Submit" button
    Then I should see a success message "Sale created successfully"
    And I should see the sale in the sales list

  Scenario: UI-SM-05 Form Validation - Required Fields
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    When I click "Sell Plant" button
    Then I should see the sale form
    When I click "Submit" button
    Then the form should not be submitted
    And I should see validation error messages for required fields

  Scenario: UI-SM-06 Form Cancellation Logic
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    When I click "Sell Plant" button
    And I select a plant from the dropdown
    And I enter "5" into "quantity" field
    When I click "Cancel" button
    Then I should see the sales table
    And no sale should be created

  Scenario: UI-SM-07 Data Deletion - Admin Confirmation
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see the sales table
    When I click the delete icon on the first row
    Then a confirmation dialog should appear
    When I confirm the deletion
    Then the sale should be removed from the list

  Scenario: UI-SM-08 Table Sorting - Total Price
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see the sales table
    When I click the "Total Price" column header
    Then the sales should be sorted by "Total Price"
    And a sort indicator should be visible

  Scenario: UI-SM-09 User Permissions - Read Only Access
    Given I am on the login page
    When I login as "testuser" with password "test123"
    Then I should see the dashboard
    When I navigate to the sales page
    Then I should see "Sales" in the body
    And I should see the sales table
    And I should not see "Sell Plant" button

  Scenario: UI-SM-10 Data Integrity - Search Filtering
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I navigate to the sales page
    Then I should see the sales table
    When I enter "Rose" into "search" field
    Then the sales table should display only sales matching the search term