/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as LambdaEvent} from './parallel-map-execute.js';
import type {LambdaResult as MapperLambdaResult} from './mapper.js';

import AWS from 'aws-sdk';

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
    return new Promise((resolve, reject) => {
      console.log('StateFunctions::DescribeExecution', params);
      sf.describeExecution(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }).then((response) => {
    if (response.status !== 'SUCCEEDED') {
      return Promise.resolve(response);
    }
    return new Promise((resolve, reject) => {
      let params = {
        stateMachineArn: response.stateMachineArn
      };
      console.log('StateFunctions::DeleteStateMachine', params);
      sf.deleteStateMachine(params, (err) => err ? reject(err) : resolve(response));
    });
  }).then((response) => {
    callback(null, {status: response.status, values: response.output ? JSON.parse(response.output) : null, executionArn: event});
  }).catch((err) => {
    callback(err);
  });
};
