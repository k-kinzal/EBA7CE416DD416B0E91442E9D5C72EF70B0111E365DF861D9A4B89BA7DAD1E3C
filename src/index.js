/* @flow */
'use strict';

/*::
type LambdaEvent = {
  key1?: ?string;
  key2?: ?string;
  key3?: ?string;
};
type LambdaContext = {

};
type LambdaCallback = (error: ?Error, result: ?Object) => void;
*/

exports.handler = (event/*: LambdaEvent */, context/*: LambdaContext */, callback/*: LambdaCallback */) => {
  callback(null, {success: true});
};
