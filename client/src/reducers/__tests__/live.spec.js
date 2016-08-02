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
      expect(Object.keys(subject)).toEqual(['channel', 'activity', 'messages']);
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

  describe('STRIKE', () => {
    describe('valid index', () => {
      let subject;

      beforeEach(() => {
        const action = { type: types.STRIKE, payload: { id: '0' } };
        subject = liveReducer(undefined, action);
      });

      it('should set message stricken to true', () => {
        expect(subject.messages[0].stricken).toBe(true);
      });
    });

    describe('invalid index', () => {
      let subject;

      beforeEach(() => {
        const action = { type: types.STRIKE, payload: { id: '1' } };
        subject = liveReducer(undefined, action);
      });

      it('should not meltdown if message is not found', () => {
        expect(subject.messages[0].stricken).toBe(false);
      });
    });
  });

  describe('DELETE', () => {
    describe('valid index', () => {
      let subject;

      beforeEach(() => {
        const action = { type: types.DELETE, payload: { id: '0' } };
        subject = liveReducer(undefined, action);
      });

      it('should remove message', () => {
        expect(subject.messages.length).toBe(0);
      });
    });

    describe('invalid index', () => {
      let subject;

      beforeEach(() => {
        const action = { type: types.DELETE, payload: { id: '1' } };
        subject = liveReducer(undefined, action);
      });

      it('should not remove any messages', () => {
        expect(subject.messages.length).toBe(1);
      });
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
