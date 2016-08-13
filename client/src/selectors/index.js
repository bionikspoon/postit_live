import { createSelector } from 'reselect';
import _ from 'lodash';
const debug = require('debug')('app:selectors:index');  // eslint-disable-line no-unused-vars

const stateMessages = state => state.live.messages;
export const sortedMessages = createSelector(
  stateMessages,
  messages => _.orderBy(messages, 'created', 'desc')
);

const statePerms = state => state.live.currentUser.channel_permissions;
export const hasPerm = createSelector(
  statePerms,
  perms => ({
    closeChannel: perms.includes('change_channel_close'),
    editContributors: perms.includes('change_channel_contributors'),
    editSettings: perms.includes('change_channel_settings'),
    editMessage: perms.includes('change_channel_messages'),
    addMessage: perms.includes('add_channel_messages'),
    canContribute: !!perms.length,
  })
);

const stateContributors = state => state.live.contributors;
export const contributors = createSelector(
  stateContributors,
  _.values
);


