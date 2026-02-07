Feature: Sales Management UI Automation 
This feature verifies Sales Management UI functionality for Admin users


Scenario Outline: Verify UI elements based on role 
Given I open the application login page 
And I login as "<role>" via UI 
When I click the "Sales" link in the navigation 
Then I should be on the Sales List page 
And the "Sell Plant" button should be "<visibility>" 
And the "Delete" icon should be "<visibility>" 
Examples: 
| role  | visibility | 
| Admin | visible    | 
| User  | hidden     | 


 
Scenario: Admin completes a successful sale via UI
    Given I open the application login page
    And I login as "Admin" via UI
    And I navigate to the "Sell Plant" page
    When I select the second option from the plant dropdown
    And I enter quantity "1"
    And I click the "Sell" button
    Then I should be redirected to the Sales List
    And the new sale should appear at the top of the list



Scenario: Submit Empty Form Validation 
    Given I open the application login page 
    And I login as "Admin" via UI 
    And I navigate to the "Sell Plant" page 
    When I click the "Submit" button 
    Then I should see a validation error "Plant is required" on the page 
 

  Scenario: Submit Invalid Quantity Validation
    Given I open the application login page
    And I login as "Admin" via UI
    And I navigate to the "Sell Plant" page
    When I select the second option from the plant dropdown
    And I enter quantity "-5"
    And I click the "Submit" button
    Then I should see a validation error "Value must be greater than or equal to 1" on the page
 

  Scenario: Delete Confirmation 
    Given I open the application login page 
    And I login as "Admin" via UI 
    When I click the "Sales" link in the navigation 
    And I click the delete icon for the first sale 
    Then I should see a confirmation popup 


    Scenario: UI-SM-009 Verify sales list default sorting by sold date descending
    Given I open the application login page
    And I login as "Admin" via UI
    When I click the "Sales" link in the navigation
    Then the first row in the sales table should have the most recent date

  Scenario: UI-SM-014 Verify No sales found message when sales list is empty
    Given I open the application login page
    And I login as "Admin" via UI
    When I navigate to a state with no sales
    Then I should see the message "No sales found"

 Scenario: UI-SM-016 Verify sorting by Plant Name column
    Given I open the application login page
    And I login as "Admin" via UI
    When I click the "Sales" link in the navigation
    And I click the column header "Plant"
    Then the sales list should be sorted by "Plant"

  Scenario: UI-SM-017 Admin cancels a sale process
    Given I open the application login page
    And I login as "Admin" via UI
    And I navigate to the "Sell Plant" page
    When I click the "Cancel" button
    Then I should be redirected to the Sales List