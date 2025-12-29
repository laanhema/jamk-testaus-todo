/* eslint-disable no-undef */
/// <reference types="cypress" />

/*
 * Yllä oleva rivi (mukaanlukien ///-merkit) käynnistää IntelliSensen tälle kyseiselle tiedostolle, jonka avulla
 * näemme funktioiden definitionit
 */

// describe – Mocha.js:n toiminto, joka kuvaa testijoukkoa
describe('My First Test', () => {
  // it – Mocha.js:n toiminto, joka kuvaa yksittäistä testitapausta
  it('clicking "type" shows the right headings', () => {
    // cy. – viittaa Cypressin toimintoihin
    // visit – vieraillaan annetulla verkkosivulla
    cy.visit('https://example.cypress.io');

    // wait – odotetaan annetun millisekuntien ajan.
    cy.wait(5000);

    // contains – etsi DOM-elementin joka sisältää annetun arvon
    // click – klikataan DOM-elementtiä
    cy.contains('type').click();

    cy.wait(5000);

    // url – haetaan tämänhetkinen URL
    // should – jokin tulisi olla jotain, määritellään argumenteillä
    // include – sisältää jonkin annetun arvon
    cy.url().should('include', '/commands/actions');

    // get – haetaan DOM-elementti
    // type – kirjoitetaan DOM-elementtiin
    // have.value – tarkistetaan, että valitussa elementissä on annettu arvo
    // piste-operaattorilla voidaan ketjuttaa komentoja
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com');
  });
});
