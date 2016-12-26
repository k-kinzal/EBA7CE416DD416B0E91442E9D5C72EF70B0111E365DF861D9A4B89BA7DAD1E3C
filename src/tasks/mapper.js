
/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as RangeResult} from './range.js';

type ArrayMatch<T, U: Array<T>> = T;

export type LambdaEvent = ArrayMatch<*, RangeResult>;
export type LambdaResult = LambdaEvent;

exports.handler = (
  event: LambdaEvent,
  context: LambdaContext,
  callback: LambdaCallback<LambdaResult>) => {

  callback(null, event + 1);
};
