import { createSelector } from 'reselect';
import * as perm from '../constants/permissions';
import _ from 'lodash';
const debug = require('debug')('app:selectors:index');  // eslint-disable-line no-unused-vars

const stateMessages = state => state.live.messages;

export const sortedMessagesSelector = createSelector(stateMessages, sortedMessages);

function sortedMessages(messages) {
  return _.orderBy(messages, 'created', 'desc');
}

const statePerms = state => state.live.currentUser.perms;
const stateUsername = state => state.live.currentUser.username;

export const permissionSelector = createSelector(
  [statePerms, stateUsername],
  (perms, username) => new Can(perms, username)
);

function Can(perms = [], username = null) {
  const can = this;

  can.closeChannel = perms.includes(perm.CLOSE_CHANNEL);
  can.editContributors = perms.includes(perm.EDIT_CONTRIBUTORS);
  can.editSettings = perms.includes(perm.EDIT_SETTINGS);
  can.editMessage = perms.includes(perm.EDIT_MESSAGES);
  can.addMessage = perms.includes(perm.ADD_MESSAGES);
  can.login = username === null;
  can.logout = username !== null;
  return can;
}
