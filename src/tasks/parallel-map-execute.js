/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as LambdaEvent} from './parallel-map-prepare.js';

import AWS from 'aws-sdk';

export type LambdaResult = string;

let sf = new AWS.StepFunctions();

export function handler(
  event: LambdaEvent,
  context: LambdaContext,
  callback: LambdaCallback<LambdaResult>) {

  Promise.resolve().then(() => {
    return {
      stateMachineArn: event.stateMachineArn,
      input: JSON.stringify(event.values)
    };
  }).then((params) => {
    return new Promise((resolve, reject) => {
      console.log('StateFunctions::StartExecution', params);
      sf.startExecution(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }).then((response) => {
    callback(null, response.executionArn);
  }).catch((err) => {
    callback(err);
  });
};
