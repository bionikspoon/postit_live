import { PropTypes } from 'react';
import _ from 'lodash';
const debug = require('debug')('app:utils:user');  // eslint-disable-line no-unused-vars


const CLOSE_CHANNEL = 'change_channel_close';
const EDIT_CONTRIBUTORS = 'change_channel_contributors';
const EDIT_SETTINGS = 'change_channel_settings';
const EDIT_MESSAGES = 'change_channel_messages';
const ADD_MESSAGES = 'add_channel_messages';

const PERMISSION_ATTR_TO_NAME = {
  addMessage: ADD_MESSAGES,
  closeChannel: CLOSE_CHANNEL,
  editContributors: EDIT_CONTRIBUTORS,
  editMessage: EDIT_MESSAGES,
  editSettings: EDIT_SETTINGS,
};

const PERMISSION_ATTR_TO_SHORT_NAME = {
  addMessage: 'add message',
  closeChannel: 'close channel',
  editContributors: 'edit contributors',
  editMessage: 'edit message',
  editSettings: 'edit settings',
};
const PERMISSION_ATTR_TO_LABEL = {
  addMessage: 'message ← add',
  closeChannel: 'channel ← close',
  editContributors: 'contributors ← edit',
  editMessage: 'message ← edit',
  editSettings: 'settings ← edit',
};
export function fromPermissionNames(username = '', names = []) {
  const user = { username, can: {} };
  user.can.closeChannel = names.includes(CLOSE_CHANNEL);
  user.can.editContributors = names.includes(EDIT_CONTRIBUTORS);
  user.can.editSettings = names.includes(EDIT_SETTINGS);
  user.can.editMessage = names.includes(EDIT_MESSAGES);
  user.can.addMessage = names.includes(ADD_MESSAGES);

  user.can.logout = !!username.length;
  user.can.login = !user.can.logout;
  user.can.contribute = !!names.length;
  return user;
}

export function fromForm(form) {
  const user = {};
  user.username = form.username.value;
  user.can = _.mapValues(form.can, 'value');
  debug('user.can', user.can);
  return user;
}

export function toPermissionNames(user) {
  return _
    .toPairs(PERMISSION_ATTR_TO_NAME)
    .reduce((names, [attr, name]) => (user.can[attr] ? names.concat(name) : names), []);
}

export function toPermissionShortNames(user) {
  return _
    .toPairs(PERMISSION_ATTR_TO_SHORT_NAME)
    .reduce((names, [attr, name]) => (user.can[attr] ? names.concat(name) : names), []);
}

export function withFullPermissions(username = '') {
  const names = _.values(PERMISSION_ATTR_TO_NAME);
  return fromPermissionNames(username, names);
}

export function permissionSummary(user) {
  if (_.values(user.can).every(_.identity)) return 'full permissions';

  return toPermissionShortNames(user).join(', ');
}

export function mapField(user) {
  return _
    .toPairs(PERMISSION_ATTR_TO_LABEL)
    .map(([attr, label], index) => ({ permission: user.can[attr], label, index }));
}

export function propTypes() {
  return PropTypes.shape({
    can: PropTypes.shape({
      closeChannel: PropTypes.bool.isRequired,
      editContributors: PropTypes.bool.isRequired,
      editSettings: PropTypes.bool.isRequired,
      editMessage: PropTypes.bool.isRequired,
      addMessage: PropTypes.bool.isRequired,
      logout: PropTypes.bool,
      login: PropTypes.bool,
      contribute: PropTypes.bool,
    }),
  }).isRequired;
}

