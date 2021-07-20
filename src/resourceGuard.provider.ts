/**
 * File: /src/resourceGuard.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 19-07-2021 23:14:39
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
  Logger,
  Type
} from '@nestjs/common';
import {
  KEYCLOAK,
  KEYCLOAK_OPTIONS,
  KeycloakOptions,
  KeycloakService,
  RESOURCE,
  SCOPES
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
    reflector: Reflector
  ) => {
    function getResource(context: GraphqlCtx): string | null {
      const { getClass } = context.typegraphqlMeta || {};
      if (!getClass) return null;
      const classTarget = getClass();
      if (!classTarget) return null;
      return reflector.get<string>(RESOURCE, classTarget);
    }

    function getScopes(context: GraphqlCtx) {
      const { getClass, getHandler } = context.typegraphqlMeta || {};
      let classTarget: Type<any> | null = null;
      let handlerTarget: Function | null = null;
      if (getClass) classTarget = getClass();
      if (getHandler) handlerTarget = getHandler();
      const handlerScopes = handlerTarget
        ? reflector.get<string[]>(SCOPES, handlerTarget) || []
        : [];
      const classScopes = classTarget
        ? reflector.get<string[]>(SCOPES, classTarget) || []
        : [];
      return [...new Set([...handlerScopes, ...classScopes])];
    }

    async function canActivate(context: GraphqlCtx): Promise<boolean> {
      const keycloakService = new KeycloakService(
        options,
        keycloak,
        httpService,
        context
      );
      const resource = getResource(context);
      if (!resource) return true;
      const scopes = getScopes(context) || [];
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

    return async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      if (!(await canActivate(context))) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return next();
    };
  }
};

export default ResourceGuardProvider;
