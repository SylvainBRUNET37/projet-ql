// https://on.cypress.io/api

describe('AuthForm', () => {
  it('visits the app root url', () => {
    cy.visit('/auth')
    cy.contains('h1', 'Welcome to LocaMat !')
  })
})
