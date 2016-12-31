/* @flow */
// https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/nodejs-prog-model-context.html
export type LambdaContext = {
  getRemainingTimeInMillis: () => number;
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion?: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logStreamName: string;
  identity?: {
    cognitoIdentityId: string;
    cognitoIdentityId: string;
  };
  clientContext?: {
    client: {
      installation_id: string;
      app_title: string;
      app_version_name: string;
      app_version_code: string;
      app_package_name: string;
      Custom: Object;
      platform_version: string;
      platform: any;
      env: {
        make: any;
        model: any;
        locale: any;
      };
    };
  };

};
// https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/nodejs-prog-model-handler.html#nodejs-prog-model-handler-callback
export type LambdaCallback<T> = (error: ?Error | ?mixed, result?: T) => void;
