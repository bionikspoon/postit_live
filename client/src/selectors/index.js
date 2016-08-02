import { createSelector } from 'reselect';
import _ from 'lodash';

const getMessages = state => state.live.messages;

export const getSortedMessages = createSelector(
  [getMessages],
  messages => _.orderBy(messages, 'created', 'desc')
);
