Feature: API Business Logic & Boundary Tests - 214241H

  Scenario: API-BL-001 Admin creates plant with minimum valid price (0.01)
    When I authenticate as "admin"
    # Step 1: Create Category hierarchy to ensure a valid sub-category exists
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Main" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "subCatId"
    # Step 2: Create plant with 0.01 price
    And I request "POST" "/api/plants/category/{id}" with "subCatId" as "id" and body:
      """
      {
        "name": "MinPrice_{timestamp}",
        "price": 0.01,
        "quantity": 5
      }
      """
    Then the response status should be 201
    And the response body "price" should be 0.01


  Scenario: API-BL-002 - Admin creates plant with exact minimum name length (3 chars)
    Given I authenticate as "admin"
    
    # Step 1: Create a Main Category
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "MAIN_{timestamp}"
      }
      """
    Then the response status should be 201
    And I capture the id as "main_cat_id"

    # Step 2: Create a Sub-Category using the main_cat_id
    And I request "POST" "/api/categories" with body using "main_cat_id" as "parentId":
      """
      {
        "name": "SUB_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    And I capture the id as "sub_category_id"

    # Step 3: Create plant under the Sub-Category (Valid boundary: 3 chars)
    When I request "POST" "/api/plants/category/{categoryId}" with "sub_category_id" as "categoryId" and body:
      """
      {
        "name": "Abc",
        "price": 10.0,
        "quantity": 5
      }
      """
    Then the response status should be 201
    And I capture the id as "min_name_plant_id"
    And the response body "name" should be "Abc"

    # Step 4: Verify plant creation via GET
    When I request "GET" "/api/plants/{id}" with "min_name_plant_id" as "id"
    Then the response status should be 200
    And the response body "name" should be "Abc"

  Scenario: API-BL-003 Admin creates plant with maximum name length (25 chars)
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat03" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub03", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "subCatId"
    And I request "POST" "/api/plants/category/{id}" with "subCatId" as "id" and body:
      """
      {
        "name": "ABCDEFGHIJKLMNOPQRSTUVWXY",
        "price": 10.00,
        "quantity": 5
      }
      """
    Then the response status should be 201
    And the response body "name" should be "Abcdefghij"

  Scenario: API-BL-004 Admin updates plant and verifies category remains associated
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat04" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub04", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "testCatId"
    And I request "POST" "/api/plants/category/{id}" with "testCatId" as "id" and body:
      """
      { "name": "ToUpdate_{timestamp}", "price": 15.0, "quantity": 10 }
      """
    Then the response status should be 201
    When I capture the id as "plantToUpdateId"
    And I request "PUT" "/api/plants/{id}" with "plantToUpdateId" as "id" and body:
      """
      { "name": "UpdatedName", "price": 25.0, "quantity": 15 }
      """
    Then the response status should be 200
    When I request "GET" "/api/plants/{id}" with "plantToUpdateId" as "id"
    Then the response body "categoryId" should match captured "testCatId"

  Scenario: API-BL-005 Verify plants are queryable by category ID
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat05" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub05", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "testCatId"
    And I request "GET" "/api/plants/category/{id}" with "testCatId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-BL-006 Admin verifies multiple plants exist in one category
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat06" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub06", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "testCatId"
    And I request "POST" "/api/plants/category/{id}" with "testCatId" as "id" and body:
      """
      { "name": "P1_{timestamp}", "price": 10.0, "quantity": 5 }
      """
    And I request "POST" "/api/plants/category/{id}" with "testCatId" as "id" and body:
      """
      { "name": "P2_{timestamp}", "price": 10.0, "quantity": 5 }
      """
    And I request "GET" "/api/plants/category/{id}" with "testCatId" as "id"
    Then the response status should be 200
    And the response body should not be empty

  Scenario: API-BL-007 Verify plant list returns consistent data structure
    When I authenticate as "user"
    And I request "GET" "/api/plants"
    Then the response status should be 200
    And the response body should contain "id"
    And the response body should contain "name"

  Scenario: API-BL-008 Verify total price calculation (quantity x price)
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat09" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub09", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "testCatId"
    And I request "POST" "/api/plants/category/{id}" with "testCatId" as "id" and body:
      """
      { "name": "CalcPlant_{timestamp}", "price": 20.0, "quantity": 50 }
      """
    Then the response status should be 201
    When I capture the id as "calcPlantId"
    And I request "POST" "/api/sales/plant/{id}?quantity=3" with "calcPlantId" as "id"
    Then the response status should be 201
    And the response body "totalPrice" should be 60.0

  Scenario: API-BL-009 Verify inventory decrements correctly after multiple sales
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat10" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub10", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "testCatId"
    And I request "POST" "/api/plants/category/{id}" with "testCatId" as "id" and body:
      """
      { "name": "StockPlant_{timestamp}", "price": 10.0, "quantity": 10 }
      """
    Then the response status should be 201
    When I capture the id as "stockPlantId"
    And I request "POST" "/api/sales/plant/{id}?quantity=3" with "stockPlantId" as "id"
    And I request "POST" "/api/sales/plant/{id}?quantity=4" with "stockPlantId" as "id"
    And I request "GET" "/api/plants/{id}" with "stockPlantId" as "id"
    Then the response body "quantity" should be 3

  Scenario: API-BL-010 Admin creates plant with special characters in name and verifies handling
    When I authenticate as "admin"
    # Step 1: Create a Main Category
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Cat11" }
      """
    Then the response status should be 201
    When I capture the id as "parentCatId"
    # Step 2: Create a Sub-Category
    And I request "POST" "/api/categories" with body using "parentCatId" as "parentId":
      """
      { "name": "Sub11", "parent": { "id": {parentId} } }
      """
    Then the response status should be 201
    When I capture the id as "subCatId"
    # Step 3: Create plant with special characters in name
    And I request "POST" "/api/plants/category/{id}" with "subCatId" as "id" and body:
      """
      {
        "name": "Rose & L",
        "price": 10.00,
        "quantity": 5
      }
      """
    Then the response status should be 201
    And I capture the id as "specialCharPlantId"
    # Step 4: Verify special characters are in response
    And the response body should contain "Rose & L"
    # Step 5: Verify special characters persisted by retrieving the plant
    When I request "GET" "/api/plants/{id}" with "specialCharPlantId" as "id"
    Then the response status should be 200
    And the response body should contain "Rose & L"