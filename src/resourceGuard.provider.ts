/**
 * File: /src/resourceGuard.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 18:57:09
 * Modified By: Clay Risser <clayrisser@gmail.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import { DiscoveryService, Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { Keycloak } from 'keycloak-connect';
import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import {
  FactoryProvider,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import {
  KEYCLOAK,
  KEYCLOAK_OPTIONS,
  KeycloakOptions,
  KeycloakService
} from 'nestjs-keycloak';
import { GraphqlCtx } from './types';

const logger = new Logger('ResourceGuard');
export const RESOURCE_GUARD = 'RESOURCE_GUARD';

const ResourceGuardProvider: FactoryProvider<MiddlewareFn<GraphqlCtx>> = {
  provide: RESOURCE_GUARD,
  inject: [
    KEYCLOAK_OPTIONS,
    KEYCLOAK,
    HttpService,
    DiscoveryService,
    Reflector
  ],
  useFactory: (
    options: KeycloakOptions,
    keycloak: Keycloak,
    httpService: HttpService,
    _discoveryService: DiscoveryService,
    _reflector: Reflector
  ) => {
    // TODO: use reflector to find decorators
    return async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      if (!(await canActivate(options, keycloak, httpService, context))) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return next();
    };
  }
};

async function canActivate(
  options: KeycloakOptions,
  keycloak: Keycloak,
  httpService: HttpService,
  context: GraphqlCtx
): Promise<boolean> {
  const keycloakService = new KeycloakService(
    options,
    keycloak,
    httpService,
    context
  );
  const resource = context.typegraphqlMeta?.resource;
  if (!resource) return true;
  const scopes = context.typegraphqlMeta?.scopes || [];
  if (!scopes.length) return true;
  const username = (await keycloakService.getUserInfo())?.preferredUsername;
  if (!username) return false;
  logger.verbose(
    `protecting resource '${resource}' with scopes [ ${scopes.join(', ')} ]`
  );
  const permissions = scopes.map((scope) => `${resource}:${scope}`);
  if (await keycloakService.enforce(permissions)) {
    logger.verbose(`resource '${resource}' granted to '${username}'`);
    return true;
  }
  logger.verbose(`resource '${resource}' denied to '${username}'`);
  return false;
}

export default ResourceGuardProvider;
