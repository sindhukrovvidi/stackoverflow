# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View Posts | This features allows a user to view all the posts. Simialr to stackoverflow, the user need not login to see the posts | - | -   | server/tests/question.test.js (lines 118 -184)  |
| Create New Posts | This is feature 2. | - | - | path/to/test   |
| Search for existing posts | This is feature 2. | - | - | path/to/test   |
| Commenting on posts | This is feature 2. | - | - | path/to/test   |
| Voting on posts | This is feature 2. | - | - | path/to/test   |
| Tagging on posts | This is feature 2. | - | - | path/to/test   |
| User profile | This is feature 2. | /path/to/test | path/to/test    | path/to/test   |
| Post moderation | This is feature 2. | /path/to/test | path/to/test    | path/to/test   |

Note: 1-3 test cases randomly fail while running cypress e2e. re-running them twice or restarting the application all over again and re-running will execute them successfully

The link to tests directs to the folder which has tests related to all the functions. The tests are written for the apis which are used in the feature. MONGO_URL = "mongodb://localhost:27017/fake_so" is used to run the tests.
. . .

## Instructions to generate and view coverage report 
`npm run test` in the server folder runs the jest tests and creates a coverage report in html. 
It can be accessed in server/coverage/index.html

## Extra Credit Section (if applicable)