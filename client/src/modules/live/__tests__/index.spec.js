import expect, { createSpy, spyOn, isSpy } from 'expect';
import liveReducer from '../';
import * as actions from '../';

describe('live reducer', () => {
  let reducer;

  const INIT = Object.freeze({ type: '@@INIT' });
  beforeEach(() => {
    // state = liveReducer(undefined, );
    reducer = (...args) => [INIT, ...args].reduce(liveReducer, undefined);
  });

  describe('init', () => {
    let subject;
    beforeEach(() => {subject = reducer()});

    it('should have initial state', () => {
      expect(Object.keys(subject)).toEqual(['meta', 'channel', 'contributors', 'messages', 'currentUser']);
    });
  });

  describe('live/messages', () => {
    const CREATE_MESSAGE = Object.freeze(actions.createMessage({ message: { id: 'a', body: 'hello world' } }));
    xdescribe('CREATE_MESSAGE', () => {
      let subject;

      beforeEach(() => {
        subject = reducer(CREATE_MESSAGE);
      });

      it('should have the message', () => {
        expect(subject.messages.a.body).toEqual('hello world');
      });
    });

    // xdescribe('STRIKE_MESSAGE', () => {
    //   let subject;
    //   const STRIKE_MESSAGE = actions.strikeMessage({ id: 'a' });
    //   beforeEach(() => {
    //     subject = reducer(CREATE_MESSAGE, STRIKE_MESSAGE);
    //   });
    //   it('should strike the message', () => {
    //     expect(subject.messages.a.status).toEqual('stricken');
    //   });
    // });

    describe('DELETE_MESSAGE', () => {
      let subject;
      const DELETE_MESSAGE = actions.deleteMessage({ id: 'a' });

      beforeEach(() => {subject = reducer(CREATE_MESSAGE, DELETE_MESSAGE) });

      it('should remove the message', () => {
        expect(subject.messages).toEqual({})
      });
    });
  });

  describe('live/channel', () => {
    xdescribe('UPDATE_CHANNEL', () => {
      let subject;
      const UPDATE_CHANNEL = actions.updateChannel({
        title: 'test title',
        resources: 'test resources',
        resources_html: '<p>test resources</p>',
        description: 'test description',
        description_html: '<p>test description</p>',
        contributors_html: '<ul><li>/u/test</li></ul>',
      });
      beforeEach(() => {subject = reducer(UPDATE_CHANNEL)});
      it('should merge channel ojbects', () => {
        expect(subject.channel).toEqual({
          subscribers: 0,
          title: 'test title',
          resources: 'test resources',
          resources_html: '<p>test resources</p>',
          description: 'test description',
          description_html: '<p>test description</p>',
          contributors_html: '<ul><li>/u/test</li></ul>',
          discussions: 'no discussions yet. [start one](#)',
          discussions_html: '<p>no discussions yet. <a href="#">start one</a></p>',
          status: 'OPENED',
        })
      });
    });

    describe('FETCH_CHANNEL', () => {
      //  TODO
    });
  });

  describe('live/currentUser', () => {
    describe('FETCH_CURRENT_USER', () => {
      //  TODO
    });
  });

  describe('live/meta', () => {
    describe('UPDATE_CONNECTION_STATUS', () => {
      const UPDATE_CONNECTION_STATUS = actions.updateConnectionStatus({ connectionStatus: 'CONNECTION_RECONNECTING' });
      let subject;
      beforeEach(() => {subject = reducer(UPDATE_CONNECTION_STATUS)});

      it('should update connection status', () => {
        expect(subject.meta.connectionStatus).toEqual('CONNECTION_RECONNECTING');
      });
    });
  });

  describe('live/contributors', () => {
    const ADD_CONTRIBUTOR = Object.freeze(actions.addContributor({
      id: 5,
      username: 'testUser',
      channel_permissions: ['change_channel_close', 'add_channel_messages']
    }));
    describe('ADD_CONTRIBUTOR', () => {

      let subject;
      beforeEach(() => {subject = reducer(ADD_CONTRIBUTOR)});

      it('should add the contributor', () => {
        expect(subject.contributors.testUser).toEqual({
          id: 5,
          username: 'testUser',
          channel_permissions: ['change_channel_close', 'add_channel_messages']
        })
      });
    });

    describe('UPDATE_CONTRIBUTOR', () => {
      const UPDATE_CONTRIBUTOR = actions.updateContributor({
        username: 'testUser',
        channel_permissions: ['change_channel_messages']
      });

      let subject;
      beforeEach(() => {subject = reducer(ADD_CONTRIBUTOR, UPDATE_CONTRIBUTOR)});

      it('should update contributor', () => {
        expect(subject.contributors.testUser).toEqual({
          id: 5,
          username: 'testUser',
          channel_permissions: ['change_channel_messages']
        });
      });
    });

    describe('DELETE_CONTRIBUTOR', () => {
      const DELETE_CONTRIBUTOR = actions.deleteContributor({ username: 'testUser' });
      let subject;
      beforeEach(() => {subject = reducer(ADD_CONTRIBUTOR, DELETE_CONTRIBUTOR)});

      it('should remove contributor', () => {
        expect(subject.contributors).toEqual({});
      });
    });
  });

});
