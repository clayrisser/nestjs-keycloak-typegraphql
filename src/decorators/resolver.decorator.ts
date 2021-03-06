/**
 * File: /src/decorators/resolver.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 19-07-2021 18:40:53
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 25-07-2021 04:49:46
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

import { ClassType, Resolver as TypeGraphqlResolver } from 'type-graphql';
import { applyDecorators } from '@nestjs/common';
import {
  ClassTypeResolver,
  AbstractClassOptions
} from 'type-graphql/dist/decorators/types';
import Guards from './guards.decorator';

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
    Guards(),
    TypeGraphqlResolver(objectTypeOrTypeFuncOrMaybeOptions, maybeOptions)
  );
}
