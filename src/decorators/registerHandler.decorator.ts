/**
 * File: /src/decorators/registerHandler.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 19-07-2021 18:42:26
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 19-07-2021 18:44:48
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

import { createMethodDecorator, ResolverData, NextFn } from 'type-graphql';
import { GraphqlCtx } from '../types';

export default function RegisterHandler(handlerTarget: any) {
  if (handlerTarget.prototype) return undefined;
  return createMethodDecorator(
    ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      if (!context.typegraphqlMeta) context.typegraphqlMeta = {};
      context.typegraphqlMeta.getHandler = () => handlerTarget;
      return next();
    }
  );
}
