/**
 * File: /src/decorators/resolver.decorator.ts
 * Project: @risserlabs/nestjs-keycloak-typegraphql
 * File Created: 24-10-2022 09:51:36
 * Author: Clay Risser
 * -----
 * Last Modified: 25-10-2022 14:22:17
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import type { ClassType } from 'type-graphql';
import { Resolver as TypeGraphqlResolver } from 'type-graphql';
import { applyDecorators } from '@nestjs/common';
import type { ClassTypeResolver, AbstractClassOptions } from 'type-graphql/dist/decorators/types';
import Guards from './guards.decorator';

export function Resolver(options?: AbstractClassOptions): ClassDecorator;
export function Resolver(
  typeFuncOrObjectType: ClassTypeResolver | ClassType,
  options?: AbstractClassOptions,
): ClassDecorator;
export function Resolver(
  objectTypeOrTypeFuncOrMaybeOptions?: any,
  maybeOptions?: AbstractClassOptions,
): ClassDecorator {
  return applyDecorators(Guards(), TypeGraphqlResolver(objectTypeOrTypeFuncOrMaybeOptions, maybeOptions));
}
