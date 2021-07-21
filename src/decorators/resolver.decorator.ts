/**
 * File: /src/decorators/resolver.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 19-07-2021 18:40:53
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 21-07-2021 02:52:05
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

import { applyDecorators } from '@nestjs/common';
import {
  ClassType,
  NextFn,
  Resolver as TypeGraphqlResolver,
  ResolverData,
  createMethodDecorator
} from 'type-graphql';
import {
  ClassTypeResolver,
  AbstractClassOptions
} from 'type-graphql/dist/decorators/types';
import DecorateAll from './decorateAll.decorator';
import RegisterHandler from './registerHandler.decorator';
import { GraphqlCtx } from '../types';
import { combineMiddlewares } from '../deferMiddleware';

export function Resolver(): ClassDecorator;
export function Resolver(options: AbstractClassOptions): ClassDecorator;
export function Resolver(
  typeFunc: ClassTypeResolver,
  options?: AbstractClassOptions
): ClassDecorator;
export function Resolver(
  objectType: ClassType,
  options?: AbstractClassOptions
): ClassDecorator;
export function Resolver(
  objectTypeOrTypeFuncOrMaybeOptions?: any,
  maybeOptions?: AbstractClassOptions
): ClassDecorator {
  return applyDecorators(
    RegisterHandler,
    TypeGraphqlResolver(objectTypeOrTypeFuncOrMaybeOptions, maybeOptions),
    DecorateAll(
      createMethodDecorator((data: ResolverData<GraphqlCtx>, next: NextFn) => {
        const { context } = data;
        if (!context.typegraphqlMeta?.deferredMiddlewares?.length) {
          return next();
        }
        console.log('combining middlewares');
        return combineMiddlewares(context.typegraphqlMeta.deferredMiddlewares)(
          data,
          next
        );
      })
    )
  );
}
