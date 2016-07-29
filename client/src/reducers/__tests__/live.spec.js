import expect, { createSpy, spyOn, isSpy } from 'expect';
import liveReducer from '../live';
import * as types from '../../constants/LiveActionTypes';

describe('live reducer', () => {
  let initialState;
  beforeEach(() => {initialState = getInitialState()});

  describe('init', () => {
    let subject;
    beforeEach(() => {subject = liveReducer()});

    it('should return the initial state', () => {
      expect(Object.keys(subject)).toEqual(['messages']);
    });

    it('should include messages', () => {
      expect(subject.messages.length).toEqual(1);
      expect(Object.keys(subject.messages[0]))
        .toEqual(['author', 'body', 'body_html', 'created', 'id', 'name', 'stricken']);
    });
  });

  describe('CREATE', () => {
    let subject;
    let action;

    beforeEach(() => {
      action = { type: types.CREATE, payload: messageFactory(...{ id: 1 }) };
      subject = liveReducer(undefined, action);
    });

    it('should add a new message', () => {
      expect(subject.messages.length).toEqual(2);
      expect(Object.keys(subject.messages[1]))
        .toEqual(['author', 'body', 'body_html', 'created', 'id', 'name', 'stricken']);
    });
  });

});

function messageFactory(id = 0, created = 1469766549, body = 'I like turtles', stricken = false) {
  return {
    author: 'admin',
    body,
    body_html: `<p>${body}</p>`,
    created,
    id,
    name: `LiveUpdate-${id}`,
    stricken,
  };
}

function getInitialState() {
  return { messages: [messageFactory()] };
}
