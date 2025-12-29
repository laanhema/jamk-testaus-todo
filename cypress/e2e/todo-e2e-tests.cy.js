/* eslint-disable no-undef */
/// <reference types="cypress" />

/*
 * Yllä oleva rivi (mukaanlukien ///-merkit) käynnistää IntelliSensen tälle kyseiselle tiedostolle, jonka avulla
 * näemme funktioiden definitionit
 */

// describe – Mocha.js:n toiminto, joka kuvaa testijoukkoa
// describe('My First Test', () => {
//   // it – Mocha.js:n toiminto, joka kuvaa yksittäistä testitapausta
//   it('clicking "type" shows the right headings', () => {
//     // cy. – viittaa Cypressin toimintoihin
//     // visit – vieraillaan annetulla verkkosivulla
//     cy.visit('https://example.cypress.io');

//     // wait – odotetaan annetun millisekuntien ajan.
//     cy.wait(5000);

//     // contains – etsi DOM-elementin joka sisältää annetun arvon
//     // click – klikataan DOM-elementtiä
//     cy.contains('type').click();

//     cy.wait(5000);

//     // url – haetaan tämänhetkinen URL
//     // should – jokin tulisi olla jotain, määritellään argumenteillä
//     // include – sisältää jonkin annetun arvon
//     cy.url().should('include', '/commands/actions');

//     // get – haetaan DOM-elementti
//     // type – kirjoitetaan DOM-elementtiin
//     // have.value – tarkistetaan, että valitussa elementissä on annettu arvo
//     // piste-operaattorilla voidaan ketjuttaa komentoja
//     cy.get('.action-email')
//       .type('fake@email.com')
//       .should('have.value', 'fake@email.com');
//   });
// });

describe('TODO-app E2E tests', () => {
  beforeEach(() => {
    cy.visit('/'); // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });
  it('Jos listassa ei ole yhtään taskia näkyykö käyttöliittymässä teksti "No tasks yet. Add your first task above."', () => {
    cy.get('#empty-state').should(
      'contain.text',
      'No tasks yet. Add your first task above.'
    );
  });
  it('Luodaan uusi task ja varmistetaan että se tulee käyttöliittymään listaan näkyviin', () => {
    // luodaan uusi task
    cy.get('#topic').should('not.be.disabled').type('task 1');
    cy.get('#save-btn').click();

    // varmistetaan että se lisätään listaan käyttöliittymään näkyviin
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .should('be.visible');

    // painetaan task 1 kohdalla "Complete"
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .get('.controls > button:nth-child(2)')
      .click();

    // varmistetaan että taskin tyyli muuttuu (done-luokka lisätään)
    cy.get('#task-list .task:first-child').should('have.class', 'done');

    // nyt painikkeessa pitäisi lukea "Undo"
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .get('.controls > button:nth-child(2)')
      .should('contain.text', 'Undo');

    // painetaan task 1 kohdalla "Undo"
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .get('.controls > button:nth-child(2)')
      .click();

    // varmistetaan taskin tyyli muuttuu takaisin (done-luokka poistetaan)
    cy.get('#task-list .task:first-child').should('not.have.class', 'done');

    // varmistetaan että nyt task 1 kohdalla lukee taas "Complete"
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .get('.controls > button:nth-child(2)')
      .should('contain.text', 'Complete');
    //
    // cy.wait(99999);
  });

  /*
  it('creates a new task and displays it in the list', () => {
    // Fill in the form
    cy.get('#topic').type('Testitaski').should('have.value', 'Testitaski');
    cy.get('#description')
      .type('Testitaskin kuvaus')
      .should('have.value', 'Testitaskin kuvaus');
    // Submit the form
    cy.get('#save-btn').click();
    // Verify the task appears in the list
    cy.get('#task-list').should('be.visible');
    cy.get('#task-list.task').should('have.length', 1); // Check the task contains correct content
    cy.get('#task-list.task')
      .first()
      .within(() => {
        cy.get('.title').should('contain', 'Testitaski');
        cy.get('.desc').should('contain', 'Testitaskin kuvaus');
      }); // Verify empty state is hidden
    cy.get('#empty-state').should('not.be.visible'); // Verify task is persisted in localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(1);
      expect(tasks[0].topic).to.equal('Testitaski');
      expect(tasks[0].description).to.equal('Testitaskin kuvaus');
      expect(tasks[0].priority).to.equal('medium'); // default value
      expect(tasks[0].status).to.equal('todo'); // default value
      expect(tasks[0].completed).to.be.false;
    });
  });
  it('deletes a task and verifies it is removed', () => {
    // First, create a task
    cy.get('#topic').type('Poistettava taski');
    cy.get('#description').type('Tämä poistetaan');
    cy.get('#save-btn').click(); // Verify task was created
    cy.get('#task-list.task').should('have.length', 1);
    cy.get('#task-list.task.title').should('contain', 'Poistettava taski'); // Delete the task
    cy.get('#task-list.task')
      .first()
      .within(() => {
        cy.get('button[data-action="delete"]').click();
      }); // Verify task is removed from the list
    cy.get('#task-list .task').should('have.length', 0); // Verify empty state is displayed
    cy.get('#empty-state').should('be.visible'); // Verify task is removed from localStorage
    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(tasks).to.have.length(0);
    });
  });
  */
});
