import { createSelector } from 'reselect';
import * as perm from '../constants/permissions';
import _ from 'lodash';
const debug = require('debug')('app:selectors:index');  // eslint-disable-line no-unused-vars

const stateMessages = state => state.live.messages;
export const sortedMessagesSelector = createSelector(
  stateMessages,
  messages => _.orderBy(messages, 'created', 'desc')
);

const stateContributors = state => state.live.contributors;
export const contributorsSelector = createSelector(
  stateContributors,
  contributors => _.values(contributors).map(userFactory)
);

const stateCurrentUser = state => state.live.currentUser;
export const currentUserSelector = createSelector(stateCurrentUser, userFactory);

function userFactory(user) { return new User(user); }
function User({ channel_permissions, username }) {
  const user = this;
  user.username = username;
  user.can = new Can();
  return user;

  function Can() {
    const can = this;
    can.closeChannel = channel_permissions.includes(perm.CLOSE_CHANNEL);
    can.editContributors = channel_permissions.includes(perm.EDIT_CONTRIBUTORS);
    can.editSettings = channel_permissions.includes(perm.EDIT_SETTINGS);
    can.editMessage = channel_permissions.includes(perm.EDIT_MESSAGES);
    can.addMessage = channel_permissions.includes(perm.ADD_MESSAGES);
    can.logout = !!(username && username.length);
    can.login = !can.logout;
    can.contribute = !!channel_permissions.length;
    return can;
  }
}
