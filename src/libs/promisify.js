/* @flow */
'use strict';

type AWSCallback<T> = (err: ?Error, data: T) => void;
type AWSFunction<T, U> = (params: T, callback: AWSCallback<U>) => void;
type AWSPromiseFunction<T, U> = (params: T) => Promise<U>;

export default function promisify<T, U>(fn: AWSFunction<T, U>): AWSPromiseFunction<T, U> {
  return (params: T) => {
    return new Promise((resolve, reject) => {
      fn(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}
