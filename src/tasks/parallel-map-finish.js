/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as LambdaEvent} from './parallel-map-execute.js';
import type {LambdaResult as MapperLambdaResult} from './mapper.js';

import AWS from 'aws-sdk';
import promisify from '../libs/promisify.js';

export type LambdaResult = {
  status: $PropertyType<StepFunctions_DescribeExecution_Result, 'status'>;
  values: ?Array<MapperLambdaResult>;
  executionArn: LambdaEvent;
};

let sf = new AWS.StepFunctions();

export function handler(
  event: LambdaEvent,
  context: LambdaContext,
  callback: LambdaCallback<LambdaResult>) {

  Promise.resolve().then(() => {
    return {
      executionArn: event
    }
  }).then((params) => {
    console.log('StateFunctions::DescribeExecution', params);
    return promisify(sf.describeExecution.bind(sf))(params);
  }).then((response) => {
    if (response.status !== 'SUCCEEDED') {
      return Promise.resolve(response);
    } else {
      let params = {
        stateMachineArn: response.stateMachineArn
      };
      console.log('StateFunctions::DeleteStateMachine', params);
      return promisify(sf.deleteStateMachine.bind(sf))(params).then(() => response);
    };
  }).then((response) => {
    callback(null, {status: response.status, values: response.output ? JSON.parse(response.output) : null, executionArn: event});
  }).catch((err: mixed) => {
    callback(err);
  });
};
