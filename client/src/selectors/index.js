import { createSelector } from 'reselect';
import _ from 'lodash';
import * as user from '../utils/user';
const debug = require('debug')('app:selectors:index');  // eslint-disable-line no-unused-vars

const stateMessages = state => state.live.messages;
export const sortedMessagesSelector = createSelector(
  stateMessages,
  messages => _.orderBy(messages, 'created', 'desc')
);

const stateContributors = state => state.live.contributors;
export const contributorsSelector = createSelector(
  stateContributors,
  contributors => _.values(contributors).map(userFromStateUser)
);

const stateCurrentUser = state => state.live.currentUser;
export const currentUserSelector = createSelector(stateCurrentUser, userFromStateUser);

function userFromStateUser({ username, channel_permissions }) {
  return user.fromPermissionNames(username, channel_permissions);
}
