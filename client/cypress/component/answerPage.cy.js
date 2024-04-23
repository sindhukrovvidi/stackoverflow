import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import AnswerHeader from '../../src/components/AnswerPage/header';
import QuestionBody from '../../src/components/AnswerPage/questionBody';
import Answer from '../../src/components/AnswerPage/answer';
import AnswerPage from '../../src/components/AnswerPage';
import { AuthContext } from '../../src/AuthContextProvider';

const Wrapper = ({ user, children }) => {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

describe('AnswerPage', () => {
  it('Answer Header component shows question title, answer count and onclick function', () => {
    const answerCount = 3;
    const title = 'android studio save string shared preference, start activity and load the saved string';
    const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');

    cy.mount(
      <AnswerHeader
        ansCount={answerCount}
        title={title}
        handleNewQuestion={handleNewQuestion}
      />
    );
    cy.get('.bold_title').contains(answerCount + ' answers');
    cy.get('.answer_question_title').contains(title);
    cy.get('.bluebtn').click();
    cy.get('@handleNewQuestionSpy').should('have.been.called');
  });
});