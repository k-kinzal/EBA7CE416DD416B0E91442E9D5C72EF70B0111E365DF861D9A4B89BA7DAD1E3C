/* @flow */
'use strict';

let _ = require('lodash');

exports.handler = (
  event/*: mixed */,
  context/*: LambdaContext */,
  callback/*: LambdaCallback */) => {

  if (typeof event !== 'number') {
    throw new TypeError(`Invalid arguments: '${JSON.stringify(event)}' is not a number.`);
  }

  callback(null, _.range(1, event));
};
