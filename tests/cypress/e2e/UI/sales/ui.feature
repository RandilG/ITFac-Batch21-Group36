Feature: Sales Management - UI Test

  Scenario: UI-SM-E-01 Admin sales page displays action buttons
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    Then I should see the heading "Sales"
    And I should see "Sell Plant" button
    And I should see "Delete" icon

  Scenario: UI-SM-E-02 User sales page hides action buttons
    Given I am on the login page
    When I login as "testuser" with password "test123"
    And I click "Sales" in navigation
    Then I should see the heading "Sales"
    And I should not see "Sell Plant" button
    And I should not see "Delete" icon

  Scenario: UI-SM-E-03 Admin completes successful sale via UI
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    And I click "Sell Plant" button
    Then I should see the heading "Sell Plant"
    When I select the second option from the plant dropdown
    And I enter quantity "1"
    And I click the "Sell" button
    Then I should see the heading "Sales"
    And the new sale should appear at the top of the list

  Scenario: UI-SM-E-04 Submit empty form shows validation error
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    And I click "Sell Plant" button
    When I click the "Submit" button
    Then I should see validation error "Plant is required"

  Scenario: UI-SM-E-05 Submit invalid quantity shows validation error
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    And I click "Sell Plant" button
    When I select the second option from the plant dropdown
    And I enter quantity "-5"
    And I click the "Submit" button
    Then I should see validation error "Value must be greater than or equal to 1"

  Scenario: UI-SM-E-06 Delete sale shows confirmation popup
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    When I click the delete icon for the first sale
    Then I should see a confirmation popup

  Scenario: UI-SM-E-07 Sales list sorted by date descending
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    Then the first row in the sales table should have the most recent date

  Scenario: UI-SM-E-08 Empty sales list displays message
    Given I am on the login page
    When I login as "admin" with password "admin123"
    When I navigate to a state with no sales
    Then I should see the message "No sales found"

  Scenario: UI-SM-E-09 Sales list sorting by plant name
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    When I click the column header "Plant name"
    Then the sales list should be sorted by "Plant name"

  Scenario: UI-SM-E-10 Admin cancels sale process
    Given I am on the login page
    When I login as "admin" with password "admin123"
    And I click "Sales" in navigation
    And I click "Sell Plant" button
    When I click the "Cancel" button
    Then I should see the heading "Sales"