/* @flow */
'use strict';

exports.handler = (
  event/*: mixed */,
  context/*: LambdaContext */,
  callback/*: LambdaCallback */) => {

  if (typeof event !== 'number') {
    throw new TypeError(`Invalid arguments: '${JSON.stringify(event)}' is not a number.`);
  }

  callback(null, event + 1);
};
