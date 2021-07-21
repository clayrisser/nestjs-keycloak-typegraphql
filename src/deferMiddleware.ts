/**
 * File: /src/deferMiddleware.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 20-07-2021 02:12:54
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 20-07-2021 02:29:51
 * Modified By: Clay Risser <clayrisser@gmail.com>
 * -----
 * Clay Risser (c) Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MiddlewareFn, ResolverData, NextFn } from 'type-graphql';
import { GraphqlCtx } from './types';

export default function deferMiddleware(
  context: GraphqlCtx,
  middleware: MiddlewareFn
) {
  if (!context.typegraphqlMeta) context.typegraphqlMeta = {};
  if (!context.typegraphqlMeta.deferredMiddlewares) {
    context.typegraphqlMeta.deferredMiddlewares = [];
  }
  console.log('added defered middleware');
  context.typegraphqlMeta.deferredMiddlewares.push(middleware);
}

export function combineMiddlewares(middlewares: MiddlewareFn[]) {
  const middleware = middlewares.pop();
  return (data: ResolverData<GraphqlCtx>, next: NextFn) => {
    console.log('going through defer chain');
    if (!middleware) return next();
    return middleware(
      data,
      (): Promise<any> => combineMiddlewares(middlewares)(data, next)!
    );
  };
}
