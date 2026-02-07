Feature: Sales Management - UI Test

Scenario: UI-SM-001
Verify admin sales UI elements
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
Then I should see the heading "Sales"
And I should see "Sell Plant" button
And I should see the "Delete" icon

Scenario: UI-SM-002
Verify user sales UI elements
Given I am on the login page
When I login as "testuser" with password "test123"
Then I should see the dashboard
When I click "Sales" in navigation
Then I should see the heading "Sales"
And I should not see "Sell Plant" button
And I should not see the "Delete" icon

Scenario: UI-SM-003
Admin completes a successful sale via UI
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click "Sell Plant" button
And I select the second option from the plant dropdown
And I enter "1" in "quantity" field
And I click "Sell" button
Then I should be redirected to the Sales List
And the new sale should appear at the top of the list

Scenario: UI-SM-004
Submit empty form validation
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click "Sell Plant" button
And I click the "Submit" button
Then I should see a validation error "Plant is required"

Scenario: UI-SM-005
Submit invalid quantity validation
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click "Sell Plant" button
And I select the second option from the plant dropdown
And I enter "-5" in "quantity" field
And I click the "Submit" button
Then I should see a validation error "Value must be greater than or equal to 1"

Scenario: UI-SM-006
Delete sale confirmation
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click the delete icon for the first sale
Then I should see a confirmation popup

Scenario: UI-SM-007
Verify sales list default sorting
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
Then the first row in the sales table should have the most recent date

Scenario: UI-SM-008
Verify empty sales list message
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I navigate to a state with no sales
Then I should see the message "No sales found"

Scenario: UI-SM-009
Verify sorting by Plant Name column
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click the column header "Plant"
Then the sales list should be sorted by "Plant"

Scenario: UI-SM-010
Admin cancels a sale process
Given I am on the login page
When I login as "admin" with password "admin123"
Then I should see the dashboard
When I click "Sales" in navigation
And I click "Sell Plant" button
And I click the "Cancel" button
Then I should be redirected to the Sales List