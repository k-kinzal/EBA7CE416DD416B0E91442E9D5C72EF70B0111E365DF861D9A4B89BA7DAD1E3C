/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';

import _ from 'lodash';

export type LambdaEvent = number;
export type LambdaResult = Array<number>;

export function handler (
  event: LambdaEvent,
  context: LambdaContext,
  callback: LambdaCallback<LambdaResult>) {

  callback(null, _.range(1, event));
};
