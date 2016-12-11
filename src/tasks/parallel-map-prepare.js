/* @flow */
'use strict';

let _ = require('lodash');
let AWS = require('aws-sdk');
let uuid = require('node-uuid');

let sf = new AWS.StepFunctions();

exports.handler = (
  event/*: mixed */,
  context/*: LambdaContext */,
  callback/*: LambdaCallback */) => {

  Promise.resolve().then(() => {
    if (typeof process.env.MAPPER_FUNCTION_ARN !== 'string') {
      throw new TypeError(`Undefined environment: 'MAPPER_FUNCTION_ARN'`);
    }
    if (!Array.isArray(event)) {
      throw new TypeError(`Input values is not array`);
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
              var branch = {StartAt: `Mapper${i}]`, States: {}};
              branch.States[`Mapper${i}]`] = {
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
  }).catch((err/*: Error | mixed */) => {
    if (err instanceof Error) {
      callback(err);
    } else {
      callback(new Error(err));
    }
  });
};
