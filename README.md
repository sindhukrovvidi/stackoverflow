# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View Posts | Allows users to browse all posts without needing to log in, similar to Stack Overflow's public viewing feature. | client/cypress/e2e/home.cy.js | - | server/tests/question.test.js (lines 118 -184)  |
| Create New Posts | Enables users to create new posts including title, text, and tags; requires user authentication. | client/cypress/e2e/home.cy.js | - | server/tests/question.test.js (lines 186 - 260)   |
| Search for existing posts | Users can search for posts, and tags should be enclosed within square brackets for better organization. | client/cypress/e2e/home.cy.js | - | server/tests/question.test.js (lines 118 -184, call the same api which is used for viewing posts.)   |
| Commenting on posts | Authenticated users can comment on existing posts to provide answers or additional insights. | client/cypress/e2e/home.cy.js | client/cypress/component/answerPage.cy.js | server/tests/answers.test.js, server/tests/newAnswer.test.js   |
| Voting on posts | Authenticated users can upvote or downvote posts, with the total number of votes displayed for each post. | - | - | server/tests/vote.test.js   |
| Tagging on posts | Allows users to add or modify tags when creating or editing a post, linking questions with relevant topics.  | client/cypress/e2e/home.cy.js | - | server/tests/tags.test.js   |
| User profile | Upon registration, users have a customizable profile; they can edit their profiles as needed. | - | client/cypress/component/login.cy.js, client/cypress/component/signup.cy.js| server/tests/userProfile.test.js   |
| Post moderation | Users can edit or delete their own questions and answers; however, they cannot delete a question if it has answers. | client/cypress/e2e/home.cy.js | path/to/test    | server/tests/question.test.js (lines 210 - 310), server/tests/answers.test.js   |

Note: 1-3 test cases randomly fail while running cypress e2e. re-running them twice or restarting the application all over again and re-running will execute them successfully

All the endpoints in the server are tested thorougly and are added in the respective files. All the controller files have respective test files which cover all the endpoints.

The link to tests directs to the folder which has tests related to all the functions. The tests are written for the apis which are used in the feature. MONGO_URL = "mongodb://localhost:27017/fake_so" is used to run the tests.
. . .

## Instructions to generate and view coverage report 
`npm run test` in the server folder runs the jest tests and creates a coverage report in html. 
It can be accessed in server/coverage/index.html

## Instructions to run docker
I already made the changes but make sure the mongo url is updated to mongodb://mongodb:27017/fake_so in init.js, destroy.js and config.js. To run the application on local the mongo url has to be updated to mongodb://localhost:27017/fake_so

## Extra Credit Section (if applicable)