import { createSelector } from 'reselect';
import * as perm from '../constants/permissions';
import _ from 'lodash';
const debug = require('debug')('app:selectors:index');  // eslint-disable-line no-unused-vars

const stateMessages = state => state.live.messages;

export const getSortedMessages = createSelector([stateMessages], sortedMessages);

function sortedMessages(messages) {
  return _.orderBy(messages, 'created', 'desc');
}

const statePerms = state => state.live.currentUser.perms;

export const permissionSelector = createSelector(statePerms, perms => new Can(perms));

function Can(perms = []) {
  const self = this;

  self.closeChannel = perms.includes(perm.CLOSE_CHANNEL);
  self.editContributors = perms.includes(perm.EDIT_CONTRIBUTORS);
  self.editSettings = perms.includes(perm.EDIT_SETTINGS);
  self.editMessage = perms.includes(perm.EDIT_MESSAGES);
  self.addMessage = perms.includes(perm.ADD_MESSAGES);
  return self;
}
