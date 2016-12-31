/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as LambdaEvent} from './parallel-map-prepare.js';

import AWS from 'aws-sdk';
import promisify from '../libs/promisify.js';

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
    console.log('StateFunctions::StartExecution', params);
    return promisify(sf.startExecution.bind(sf))(params);
  }).then((response) => {
    callback(null, response.executionArn);
  }).catch((err: mixed) => {
    callback(err);
  });
};
