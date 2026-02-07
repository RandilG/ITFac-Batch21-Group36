Feature: Plant Management - API Test

  Scenario: API-PM-001 Admin creates plant with valid data
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "Par_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "parentId"
    And I request "POST" "/api/categories" with body using "parentId" as "parentId":
      """
      {
        "name": "Sub_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "subId"
    And I request "POST" "/api/plants/category/{id}" with "subId" as "id" and body:
      """
      {
        "name": "Plant_{timestamp}",
        "price": 150.0,
        "quantity": 25
      }
      """
    Then the response status should be 201
    And the response body should contain "Plant_"
    When I capture the id as "plantId"
    And I request "GET" "/api/plants/{id}" with "plantId" as "id"
    Then the response status should be 200
    And the response body should contain "Plant_"

  Scenario: API-PM-002 Admin updates plant price and quantity
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "P2_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "p2Id"
    And I request "POST" "/api/categories" with body using "p2Id" as "parentId":
      """
      {
        "name": "S2_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "s2Id"
    And I request "POST" "/api/plants/category/{id}" with "s2Id" as "id" and body:
      """
      {
        "name": "UP_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 201
    When I capture the id as "pId"
    And I request "PUT" "/api/plants/{id}" with "pId" as "id" and body:
      """
      {
        "name": "UP_{timestamp}",
        "price": 250.5,
        "quantity": 55
      }
      """
    Then the response status should be 200
    And I request "GET" "/api/plants/{id}" with "pId" as "id"
    Then the response status should be 200
    And the response body should contain "250.5"
    And the response body should contain "55"

  Scenario: API-PM-003 Admin deletes plant successfully
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "P3_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "p3Id"
    And I request "POST" "/api/categories" with body using "p3Id" as "parentId":
      """
      {
        "name": "S3_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "s3Id"
    And I request "POST" "/api/plants/category/{id}" with "s3Id" as "id" and body:
      """
      {
        "name": "DEL_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 201
    When I capture the id as "dpId"
    And I request "DELETE" "/api/plants/{id}" with "dpId" as "id"
    Then the response status should be 204
    And I request "GET" "/api/plants/{id}" with "dpId" as "id"
    Then the response status should be 404

  Scenario: API-PM-004 Validate negative price prevention
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "P4_{timestamp}"
      }
      """
    Then the response status should be 201
    When I capture the id as "p4Id"
    And I request "POST" "/api/categories" with body using "p4Id" as "parentId":
      """
      {
        "name": "S4_{timestamp}",
        "parent": {
          "id": {parentId}
        }
      }
      """
    Then the response status should be 201
    When I capture the id as "s4Id"
    And I request "POST" "/api/plants/category/{id}" with "s4Id" as "id" and body:
      """
      {
        "name": "NEG_{timestamp}",
        "price": -50.0,
        "quantity": 10
      }
      """
    Then the response status should be 400
    And the response body should contain "price"

  Scenario: API-PM-005 Prevent plant creation with invalid category
    When I authenticate as "admin"
    And I request "POST" "/api/plants/category/{id}" with "99999" as "id" and body:
      """
      {
        "name": "INV_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 400
    And the response body should contain "sub-categories"

  Scenario: API-PM-006 User retrieves all plants
    When I authenticate as "user"
    And I request "GET" "/api/plants"
    Then the response status should be 200

  Scenario: API-PM-007 User retrieves specific plant details
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "C7_{timestamp}",
        "parentCategoryId": null
      }
      """
    Then the response status should be 201
    And I capture the id as "root_id"
    And I request "POST" "/api/categories" with body using "root_id" as "root_id":
      """
      {
        "name": "S7_{timestamp}",
        "parent": {
          "id": {root_id}
        }
      }
      """
    Then the response status should be 201
    And I capture the id as "sub_id"
    And I request "POST" "/api/plants/category/{id}" with "sub_id" as "id" and body:
      """
      {
        "name": "P7_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 201
    And I capture the id as "plant_id"
    When I authenticate as "user"
    And I request "GET" "/api/plants/{id}" with "plant_id" as "id"
    Then the response status should be 200
    And the response body should contain "P7_"

  Scenario: API-PM-008 User prohibited from creating plants
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "C8_{timestamp}",
        "parentCategoryId": null
      }
      """
    Then the response status should be 201
    And I capture the id as "root_id"
    And I request "POST" "/api/categories" with body using "root_id" as "root_id":
      """
      {
        "name": "S8_{timestamp}",
        "parent": {
          "id": {root_id}
        }
      }
      """
    Then the response status should be 201
    And I capture the id as "sub_id"
    When I authenticate as "user"
    And I request "POST" "/api/plants/category/{id}" with "sub_id" as "id" and body:
      """
      {
        "name": "P8_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 403

  Scenario: API-PM-009 User prohibited from updating plants
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "C9_{timestamp}",
        "parentCategoryId": null
      }
      """
    Then the response status should be 201
    And I capture the id as "root_id"
    And I request "POST" "/api/categories" with body using "root_id" as "root_id":
      """
      {
        "name": "S9_{timestamp}",
        "parent": {
          "id": {root_id}
        }
      }
      """
    Then the response status should be 201
    And I capture the id as "sub_id"
    And I request "POST" "/api/plants/category/{id}" with "sub_id" as "id" and body:
      """
      {
        "name": "P9_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 201
    And I capture the id as "plant_id"
    When I authenticate as "user"
    And I request "PUT" "/api/plants/{id}" with "plant_id" as "id" and body:
      """
      {
        "name": "P9_U_{timestamp}",
        "price": 200.0,
        "quantity": 20
      }
      """
    Then the response status should be 403

  Scenario: API-PM-010 User prohibited from deleting plants
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      {
        "name": "C10_{timestamp}",
        "parentCategoryId": null
      }
      """
    Then the response status should be 201
    And I capture the id as "root_id"
    And I request "POST" "/api/categories" with body using "root_id" as "root_id":
      """
      {
        "name": "S10_{timestamp}",
        "parent": {
          "id": {root_id}
        }
      }
      """
    Then the response status should be 201
    And I capture the id as "sub_id"
    And I request "POST" "/api/plants/category/{id}" with "sub_id" as "id" and body:
      """
      {
        "name": "P10_{timestamp}",
        "price": 100.0,
        "quantity": 10
      }
      """
    Then the response status should be 201
    And I capture the id as "plant_id"
    When I authenticate as "user"
    And I request "DELETE" "/api/plants/{id}" with "plant_id" as "id"
    Then the response status should be 403
