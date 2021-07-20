/**
 * File: /src/decorators/authorized.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 19-07-2021 18:40:53
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 20-07-2021 02:10:56
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

import { Authorized as TypeGraphqlAuthorized } from 'type-graphql';
import { Authorized as KeycloakAuthorized } from 'nestjs-keycloak';
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';
import { applyDecorators } from '@nestjs/common';
import RegisterHandler from './registerHandler.decorator';
import RegisterClass from './registerClass.decorator';

export function Authorized(): MethodAndPropDecorator;
export function Authorized<RoleType = string>(
  roles: RoleType[]
): MethodAndPropDecorator;
export function Authorized<RoleType = string>(
  ...roles: RoleType[]
): MethodAndPropDecorator;
export function Authorized(...roles: string[] | [string[]]): MethodDecorator {
  return applyDecorators(
    TypeGraphqlAuthorized(...roles),
    KeycloakAuthorized(...roles),
    RegisterClass,
    RegisterHandler
  );
}
