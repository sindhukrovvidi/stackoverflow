describe("Cypress Tests repeated from React assignment", () => {
    beforeEach(() => {
      // Seed the database before each test
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      // Clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("Search for a question using text content that does not exist", () => {
        const searchText = "Web3";
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type(`${searchText}{enter}`);
        cy.get(".postTitle").should("have.length", 0);
      });

      it('Output of the search should show number of results found', () => {
        const qTitles = ["Programmatically navigate using React router", 
        'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.contains(qTitles.length + " questions");
      });    
    

      it("Search string in question text", () => {
        const qTitles = ["Object storage for a web application"];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("40 million{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });

      
      it("Search string with case-insensitive matching", () => {
        const qTitles = ['Object storage for a web application'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('ObJeCt{enter}');
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
          });
       });

      it("Search a question by tag (t1)", () => {
        const qTitles = ["Programmatically navigate using React router"];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[react]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("Search a question by tag (t2)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Programmatically navigate using React router",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[javascript]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("Search a question by tag (t3)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[android-studio]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("Search a question by tag (t4)", () => {
        const qTitles = [
          "Quick question about storage on android",
          "android studio save string shared preference, start activity and load the saved string",
        ];
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[shared-preferences]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("Search for a question using a tag that does not exist", () => {
        cy.visit("http://localhost:3000");
        cy.get("#searchBar").type("[nonExistentTag]{enter}");
        cy.get(".postTitle").should("have.length", 0);
      });

      it('Search string with non-existing tag and non-tag word', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
        cy.contains('No Questions Found');
    });
});