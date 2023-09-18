/*
 *  File: /src/decorators/onlyOwner.decorator.ts
 *  Project: @bitspur/nestjs-keycloak-typegraphql
 *  File Created: 18-09-2023 15:06:59
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { ResolverData, NextFn } from 'type-graphql';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createMethodDecorator } from 'type-graphql';
import { isOwner } from '@risserlabs/nestjs-keycloak';
import type { GraphqlCtx } from '../types';

export function OnlyOwner(
  resultUserIdPath: string | string[] = 'userId',
  grantSubPath: string | string[] = 'content.sub',
  skipRoles: (string | string[])[] = ['realm:admin'],
) {
  return createMethodDecorator(async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
    const { keycloakService } = context;
    const result = await next();
    if (!keycloakService || !(await isOwner(keycloakService, result, resultUserIdPath, grantSubPath, skipRoles))) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return result;
  });
}
