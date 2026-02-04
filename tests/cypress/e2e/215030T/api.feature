Feature: Category Management - API Test

  Background:
    Given I assume the application is running

  Scenario: API-CM-001 Admin creates category hierarchy
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Outdoor" }
      """
    Then the response status should be 201
    And I capture the id as "parentId"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Flowering", "parentId": "{parentId}" }
      """
    Then the response status should be 201
    And I capture the id as "childId"
    And I request "GET" "/api/categories/{id}" with "childId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should contain "parentId"
    And I request "GET" "/api/categories/{id}" with "parentId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON

  Scenario: API-CM-002 Validate category name length rules
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "AB" }
      """
    Then the response status should be 400
    And I request "POST" "/api/categories" with body:
      """
      { "name": "TooLongName" }
      """
    Then the response status should be 400
    And I request "POST" "/api/categories" with body:
      """
      { "name": "ABC" }
      """
    Then the response status should be 201
    And I capture the id as "validCatId"
    And I request "DELETE" "/api/categories/{id}" with "validCatId" as "id"
    Then the response status should be 204

  Scenario: API-CM-003 Admin updates category with persistence
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Original" }
      """
    Then the response status should be 201
    And I capture the id as "categoryId"
    And I request "PUT" "/api/categories/{id}" with "categoryId" as "id" and body:
      """
      { "name": "Updated" }
      """
    Then the response status should be 200
    And I request "GET" "/api/categories/{id}" with "categoryId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should contain "Updated"

  Scenario: API-CM-004 Parent deletion orphan handling
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "ParentCat" }
      """
    Then the response status should be 201
    And I capture the id as "parentCatId"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "ChildCat", "parentId": "{parentCatId}" }
      """
    Then the response status should be 201
    And I capture the id as "childCatId"
    And I request "DELETE" "/api/categories/{id}" with "parentCatId" as "id"
    Then the response status should be 204
    And I request "GET" "/api/categories/{id}" with "childCatId" as "id"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not contain "parentId"
    And I request "DELETE" "/api/categories/{id}" with "childCatId" as "id"
    Then the response status should be 204

  Scenario: API-CM-005 Required field enforcement
    When I authenticate as "admin"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "" }
      """
    Then the response status should be 400
    And I request "POST" "/api/categories" with body:
      """
      { "description": "No name field" }
      """
    Then the response status should be 400
    And I request "POST" "/api/categories" with body:
      """
      { "name": "   " }
      """
    Then the response status should be 400

  Scenario: API-CM-006 User retrieves category list
    When I authenticate as "testuser"
    And I request "GET" "/api/categories"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not be empty

  Scenario: API-CM-007 User retrieves single category
    When I authenticate as "testuser"
    And I request "GET" "/api/categories/1"
    Then the response status should be 200
    And the response body should be valid JSON
    And the response body should not be empty

  Scenario: API-CM-008 User prohibited from creating categories
    When I authenticate as "testuser"
    And I request "POST" "/api/categories" with body:
      """
      { "name": "Unauthorized" }
      """
    Then the response status should be 403

  Scenario: API-CM-009 User prohibited from updating categories
    When I authenticate as "testuser"
    And I request "PUT" "/api/categories/1" with body:
      """
      { "name": "Unauthorized Update" }
      """
    Then the response status should be 403

  Scenario: API-CM-010 User prohibited from deleting categories
    When I authenticate as "testuser"
    And I request "DELETE" "/api/categories/1"
    Then the response status should be 403