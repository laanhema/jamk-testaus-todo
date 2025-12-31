/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('TODO-app E2E tests', () => {
  beforeEach(() => {
    cy.visit('/'); // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });

  it('Testataan voiko taskeja filtteröidä niiden tärkeysluokittelun mukaisesti', () => {
    // luodaan muutamia uusia taskeja eri priorityillä
    const testData = [
      { title: 'test task 1', prio: 'Low' },
      { title: 'test task 2', prio: 'Medium' },
      { title: 'test task 3', prio: 'High' },
      { title: 'test task 4', prio: 'Low' },
      { title: 'test task 5', prio: 'Medium' },
      { title: 'test task 6', prio: 'High' },
      { title: 'test task 7', prio: 'High' },
      { title: 'test task 8', prio: 'High' },
      { title: 'test task 9', prio: 'Medium' },
      { title: 'test task 10', prio: 'Low' },
    ];
    for (let i = 0; i < testData.length; i++) {
      cy.get('#topic').should('not.be.disabled').type(testData[i].title);
      cy.get('#priority').should('not.be.disabled').select(testData[i].prio);
      cy.get('#save-btn').click();
    }

    // klikataan 'Low' -> tarkistetaan että listassa näkyy nyt 3 taskia: 10, 4, 1
    cy.get('#pill-low').should('not.be.disabled').click();
    let expectedTasks = ['task 10', 'task 4', 'task 1'];
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-low').should('not.be.disabled').click();

    // klikataan 'Medium' -> tarkistetaan että listassa näkyy nyt 3 taskia: 9, 5, 2
    cy.get('#pill-medium').should('not.be.disabled').click();
    expectedTasks = ['task 9', 'task 5', 'task 2'];
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-medium').should('not.be.disabled').click();

    // klikataan 'High' -> tarkistetaan että listassa näkyy nyt 4 taskia: 8, 7, 6, 3
    cy.get('#pill-high').should('not.be.disabled').click();
    expectedTasks = ['task 8', 'task 7', 'task 6', 'task 3'];
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-high').should('not.be.disabled').click();

    // Testataan kahta filteriä yhdessä: Low + Medium
    // Pitäisi näkyä taskit: 9, 5, 2, 10, 4, 1
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-medium').should('not.be.disabled').click();
    expectedTasks = [
      'task 9',
      'task 5',
      'task 2',
      'task 10',
      'task 4',
      'task 1',
    ];
    cy.get('#task-list .task').should('have.length', expectedTasks.length);
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-medium').should('not.be.disabled').click();

    // Testataan kahta filteriä yhdessä: Medium + High
    // Pitäisi näkyä taskit: 8, 7, 6, 3, 9, 5, 2
    cy.get('#pill-medium').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();
    expectedTasks = [
      'task 8',
      'task 7',
      'task 6',
      'task 3',
      'task 9',
      'task 5',
      'task 2',
    ];
    cy.get('#task-list .task').should('have.length', expectedTasks.length);
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-medium').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();

    // Testataan kahta filteriä yhdessä: Low + High
    // Pitäisi näkyä taskit: 8, 7, 6, 3, 10, 4, 1
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();
    expectedTasks = [
      'task 8',
      'task 7',
      'task 6',
      'task 3',
      'task 10',
      'task 4',
      'task 1',
    ];
    cy.get('#task-list .task').should('have.length', expectedTasks.length);
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();

    // Testataan kolmea filteriä yhdessä: Low + Medium + High
    // Pitäisi näkyä kaikki 10 taskia tässä järjestyksessä: 8, 7, 6, 3, 9, 5, 2, 10, 4, 1
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-medium').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();
    cy.get('#task-list .task').should('have.length', 10);
    expectedTasks = [
      'task 8',
      'task 7',
      'task 6',
      'task 3',
      'task 9',
      'task 5',
      'task 2',
      'task 10',
      'task 4',
      'task 1',
    ];
    cy.get('#task-list .task').should('have.length', expectedTasks.length);
    for (let i = 0; i < expectedTasks.length; i++) {
      cy.get(`#task-list .task:nth-child(${i + 1}) div div.title`).should(
        'contain.text',
        expectedTasks[i]
      );
    }
    cy.get('#pill-low').should('not.be.disabled').click();
    cy.get('#pill-medium').should('not.be.disabled').click();
    cy.get('#pill-high').should('not.be.disabled').click();
  });

  it('Jos listassa ei ole yhtään taskia näkyykö käyttöliittymässä teksti "No tasks yet. Add your first task above."', () => {
    cy.get('#empty-state').should(
      'contain.text',
      'No tasks yet. Add your first task above.'
    );
  });

  it('Luodaan uusi task -> Varmistetaan että se tulee käyttöliittymään listaan näkyviin -> Painetaan "Complete" ja varmistetaan että task tulee tehdyksi -> Painetaan "Undo" ja varmistetaan että task on nyt tekemättä -> Poistetaan task -> Varmistetaan että task on nyt poistettu käyttöliittymästä', () => {
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

    // poistetaan task 1

    // laitetaan cypress kuuntelemaan että modal ikkuna ilmestyy
    cy.on('window:confirm', (text) => {
      expect(text).to.contain('Delete this task?');
    });

    // painetaan delete
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'task 1')
      .get('.controls > button:nth-child(3)')
      .should('contain.text', 'Delete')
      .click();

    // painetaan modal-ikkunasta OK
    cy.on('window:confirm', () => true);

    // varmistetaan että task on poistettu
    cy.get('#task-list .task:first-child').should('not.exist');
    // cy.wait(99999);
  });

  it('Tyhjentääkö reset-painike kirjoitettavat kentät oletusarvoihin kuten halutaan', () => {
    // luodaan uusi task ja kirjoitetaan kenttiin jotain ja vaihdetaan select valikoiden arvot johonkin
    cy.get('#topic').should('not.be.disabled').type('asdasdasds');
    cy.get('#priority').should('not.be.disabled').select('High');
    cy.get('#status').should('not.be.disabled').select('In progress');
    cy.get('#description').should('not.be.disabled').type('asdasdasdasdasdsa');
    // sitten painetaan reset ja katsotaan muuttuuko kentät oletusarvohin
    cy.get('#reset-btn').click();

    cy.get('#topic').should('not.be.disabled').should('contain.text', '');
    cy.get('#priority')
      .should('not.be.disabled')
      .should('have.value', 'medium');
    cy.get('#status').should('not.be.disabled').should('have.value', 'todo');
    cy.get('#description').should('not.be.disabled').should('contain.text', '');
  });

  it('Scrollaako muokkauspainikkeen klikkaus sivun ylös lomakkeen kohdalle -> Toimiiko aiemmin luodun taskin muokkaus halutulla tavalla -> Reloadataan sivu ja tarkistetaan että aiemmin lisätyt taskit näkyvät edelleen käyttöliittymässä -> Tyhjennetään localStorage ja reloadataan uudestaan nyt ei pitäisi olla yhtään taskia listassa', () => {
    // luodaan muutamia uusia taskeja, tarpeeksi että scrollbar ilmestyy sivulle
    // kaikki default priority (medium), joten järjestys on: hwhwhwhh, cggcgcghdh, rhdhdrh, qwageg, qfwddwa, eeqeg, fasf, asdasdasd, asdasdasds, first
    const testData = [
      'first',
      'asdasdasds',
      'asdasdasd',
      'fasf',
      'eeqeg',
      'qfwddwa',
      'qwageg',
      'rhdhdrh',
      'cggcgcghdh',
      'hwhwhwhh',
    ];
    for (let i = 0; i < testData.length; i++) {
      cy.get('#topic').should('not.be.disabled').type(testData[i]);
      cy.get('#save-btn').click();
    }
    // scrollataan alas sivulle viimeisen elementin kohdalle (title="first" on nyt listassa viimeisenä)
    cy.get('#task-list .task:nth-child(10)').scrollIntoView();

    // painetaan viimeisen (10.) elementin Edit-nappia ("first" on viimeisenä koska se luotiin ensimmäisenä)
    cy.get('#task-list .task:nth-child(10)')
      .should('contain.text', 'first')
      .find('.controls > button:nth-child(1)')
      .should('contain.text', 'Edit')
      .click();

    // varmistetaan että form-title on nyt näkyvissä viewportissa
    cy.get('#form-title').should('be.visible');

    // varmistetaan että sivu scrollasi ylös sivun alkuun (Y-koordinaatti 0 tai lähes 0)
    cy.window().its('scrollY').should('be.at.most', 5);

    // muokataan taskin kenttiä ja painetaan save
    cy.get('#topic')
      .should('not.be.disabled')
      .type('{selectall}{backspace}')
      .type('edited title');
    cy.get('#priority').should('not.be.disabled').select('Low');
    cy.get('#status').should('not.be.disabled').select('Blocked');
    cy.get('#description')
      .should('not.be.disabled')
      .type('{selectall}{backspace}')
      .type('edited description');
    cy.get('#save-btn').click();

    // tarkistetaan onko taskin tiedot nyt muuttuneet listassa myös
    // Koska priority muutettiin Low:ksi, se on nyt viimeisenä (medium taskit ennen sitä)
    cy.get('#task-list .task:nth-child(10)')
      .scrollIntoView()
      .find('.title')
      .should('contain.text', 'edited title');
    cy.get('#task-list .task:nth-child(10)')
      .find('.desc')
      .should('contain.text', 'edited description');

    // reloadataan sivu
    cy.wait(1000);
    cy.reload();
    // cy.wait(1000);

    // aiemmin lisätyt 10 taskia pitäisi vielä näkyä sivulla
    // jos ei näy, localstorage ei toimi oikein
    cy.get('#task-list .task').should('have.length', 10);

    // tarkistetaan että aiemmin muokattu task näkyy oikealla nimellä
    // Low priority task on viimeisenä (position 10)
    cy.get('#task-list .task:nth-child(10) .title').should(
      'contain.text',
      'edited title'
    );

    // tarkistetaan muutama muu task että ne ovat tallentuneet oikein
    // Medium priority taskit (uusimmat ensin): hwhwhwhh, cggcgcghdh, ..., asdasdasds
    cy.get('#task-list .task:nth-child(1) .title').should(
      'contain.text',
      'hwhwhwhh'
    );
    cy.get('#task-list .task:nth-child(2) .title').should(
      'contain.text',
      'cggcgcghdh'
    );
    cy.get('#task-list .task:nth-child(9) .title').should(
      'contain.text',
      'asdasdasds'
    );

    // entä jos cache tyhjennetään
    cy.clearLocalStorage();
    cy.reload();

    // tämä pitäisi näkyä nyt
    cy.get('#empty-state').should(
      'contain.text',
      'No tasks yet. Add your first task above.'
    );
  });

  it('Testataan muuttuuko uusi task automaattisesti tehdyksi jos sen status kentän muuttaa arvoon "done"', () => {
    // luodaan uusi task
    cy.get('#topic').should('not.be.disabled').type('already done task 1');
    cy.get('#description')
      .should('not.be.disabled')
      .type('this task is already done as I am creating it');
    cy.get('#status').should('not.be.disabled').select('Done');

    cy.get('#save-btn').click();

    // varmistetaan että se lisätään listaan käyttöliittymään näkyviin
    cy.get('#task-list .task:first-child div div.title')
      .should('contain.text', 'already done task')
      .should('be.visible');

    // varmistetaan että taskin tyyli on "done"
    cy.get('#task-list .task:first-child').should('have.class', 'done');
  });

  it('Testataan lomakkeen validointi: Jos topic kenttä on tyhjä ja yritetään tallentaa niin pitäisi näkyä "Please fill out this field" viesti', () => {
    // varmistetaan että topic-kenttä on tyhjä
    cy.get('#topic').should('have.value', '');

    // yritetään klikata tallenna-nappia
    cy.get('#save-btn').click();

    // tarkistetaan että validointiviesti ilmestyy
    cy.get('#topic')
      .invoke('prop', 'validationMessage')
      .should('contain', 'Please fill out this field');

    // tarkistetaan että topic-kenttä on invalidi
    cy.get('#topic').should('have.attr', 'required');

    // kirjoitetaan nyt jotain topic-kenttään
    cy.get('#topic').type('valid task title');

    // nyt validointiviesti ei pitäisi olla
    cy.get('#topic').invoke('prop', 'validationMessage').should('equal', '');

    // tallennetaan task
    cy.get('#save-btn').click();

    // varmistetaan että task ilmestyi listaan
    cy.get('#task-list .task:first-child .title').should(
      'contain.text',
      'valid task title'
    );
  });

  it('Testataan että topic-kenttä ei hyväksy yli 120 merkkiä pitkiä otsikkoja', () => {
    // luodaan 121 merkkiä pitkä teksti
    const longTitle = 'a'.repeat(121);

    // yritetään kirjoittaa liian pitkä otsikko
    cy.get('#topic').type(longTitle);

    // tarkistetaan että kentässä on maksimissaan 120 merkkiä
    cy.get('#topic')
      .invoke('val')
      .then((value) => {
        expect(value.length).to.be.at.most(120);
      });

    // tarkistetaan että maxlength-attribuutti on asetettu
    cy.get('#topic').should('have.attr', 'maxlength', '120');

    // tyhjennetään kenttä ja kirjoitetaan tasan 120 merkkiä
    cy.get('#topic').clear();
    const validTitle = 'b'.repeat(120);
    cy.get('#topic').type(validTitle);

    // tallennetaan task
    cy.get('#save-btn').click();

    // varmistetaan että task tallentui
    cy.get('#task-list .task:first-child .title').should('exist');

    // tarkistetaan että title on täsmälleen 120 merkkiä
    cy.get('#task-list .task:first-child .title')
      .invoke('text')
      .then((text) => {
        expect(text.length).to.equal(120);
      });
  });
});
