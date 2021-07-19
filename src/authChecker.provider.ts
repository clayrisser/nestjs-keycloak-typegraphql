/**
 * File: /src/authChecker.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 18:55:57
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

import { AuthChecker, ResolverData } from 'type-graphql';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { Keycloak } from 'keycloak-connect';
import { Logger, FactoryProvider } from '@nestjs/common';
import {
  KEYCLOAK,
  KEYCLOAK_OPTIONS,
  KeycloakOptions,
  KeycloakService
} from 'nestjs-keycloak';
import { GraphqlCtx } from './types';

const logger = new Logger('AuthChecker');
export const AUTH_CHECKER = 'AUTH_CHECKER';

const AuthCheckerProvider: FactoryProvider<AuthChecker> = {
  provide: AUTH_CHECKER,
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
    return async (
      { context }: ResolverData<GraphqlCtx>,
      roles: (string | string[])[] = []
    ) => {
      const keycloakService = new KeycloakService(
        options,
        keycloak,
        httpService,
        context
      );
      const username = (await keycloakService.getUserInfo())?.preferredUsername;
      if (!username) return false;
      const resource = context.typegraphqlMeta?.resource;
      logger.verbose(
        `resource${
          resource ? ` '${resource}'` : ''
        } for '${username}' requires roles [ ${roles.join(' | ')} ]`
      );
      if (await keycloakService.isAuthorizedByRoles(roles)) {
        logger.verbose(`authorization for '${username}' granted`);
        return true;
      }
      logger.verbose(`authorization for '${username}' denied`);
      return false;
    };
  }
};

export default AuthCheckerProvider;
