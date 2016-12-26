/* @flow */
'use strict';

import type {LambdaContext, LambdaCallback} from '../typed/lambda.js';
import type {LambdaResult as LambdaEvent} from './range.js';

import _ from 'lodash';
import AWS from 'aws-sdk';
import uuid from 'node-uuid';

export type LambdaResult = {
  values: LambdaEvent;
  stateMachineArn: string;
};

let sf = new AWS.StepFunctions();

export function handler(
  event: LambdaEvent,
  context: LambdaContext,
  callback: LambdaCallback<LambdaResult>) {

  Promise.resolve().then(() => {
    if (typeof process.env.MAPPER_FUNCTION_ARN !== 'string') {
      throw new TypeError(`Undefined environment: 'MAPPER_FUNCTION_ARN'`);
    }
    return {
      mapperFunctionArn: process.env.MAPPER_FUNCTION_ARN,
      values: event
    };
  }).then((data) => {
    return {
      name: `pm-${uuid.v4()}`,
      roleArn: 'arn:aws:iam::125043710017:role/service-role/StatesExecutionRole-us-east-1',
      definition: JSON.stringify({
        Comment: `Pallarel map for ${context.functionName}`,
        StartAt: `Parallel`,
        States: {
          Parallel: {
            Type: `Parallel`,
            Branches: _.range(0, data.values.length).map((i) => {
              var branch = {StartAt: `Mapper${i}`, States: {}};
              branch.States[`Mapper${i}`] = {
                Type: 'Task',
                InputPath: `$[${i}]`,
                Resource: data.mapperFunctionArn,
                End: true
              };
              return branch;
            }),
            End: true
          }
        }
      })
    }
  }).then((params) => {
    return new Promise((resolve, reject) => {
      console.log('StateFunctions::CreateStateMachine', params);
      sf.createStateMachine(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }).then((response) => {
    callback(null, {values: event, stateMachineArn: response.stateMachineArn});
  }).catch((err) => {
    callback(err);
  });
};
