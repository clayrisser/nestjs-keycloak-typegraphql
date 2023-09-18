/*
 *  File: /src/resourceGuard.provider.ts
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

import deferMiddleware from './deferMiddleware';
import type { FactoryProvider, Type } from '@nestjs/common';
import type { GraphqlCtx } from './types';
import type { Keycloak } from 'keycloak-connect';
import type { KeycloakOptions } from '@risserlabs/nestjs-keycloak';
import type { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { KEYCLOAK, KEYCLOAK_OPTIONS, KeycloakService, RESOURCE, SCOPES } from '@risserlabs/nestjs-keycloak';
import { Reflector } from '@nestjs/core';

const logger = new Logger('ResourceGuard');
export const RESOURCE_GUARD = 'NESTJS_KEYCLOAK_TYPEGRAPHQL_RESOURCE_GUARD';

const ResourceGuardProvider: FactoryProvider<MiddlewareFn<GraphqlCtx>> = {
  provide: RESOURCE_GUARD,
  inject: [KEYCLOAK_OPTIONS, KEYCLOAK, HttpService, Reflector],
  useFactory: (options: KeycloakOptions, keycloak: Keycloak, httpService: HttpService, reflector: Reflector) => {
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
      const handlerScopes = handlerTarget ? reflector.get<string[]>(SCOPES, handlerTarget) || [] : [];
      const classScopes = classTarget ? reflector.get<string[]>(SCOPES, classTarget) || [] : [];
      return [...new Set([...handlerScopes, ...classScopes])];
    }

    async function canActivate(context: GraphqlCtx): Promise<boolean> {
      const keycloakService = new KeycloakService(options, keycloak, httpService, context);
      const resource = getResource(context);
      if (!resource) return true;
      const scopes = getScopes(context);
      if (!scopes?.length) return true;
      const username = (await keycloakService.getUserInfo())?.preferredUsername;
      if (!username) return false;
      logger.verbose(`protecting resource '${resource}' with scopes [ ${scopes.join(', ')} ]`);
      const permissions = scopes.map((scope) => `${resource}:${scope}`);
      if (await keycloakService.enforce(permissions)) {
        logger.verbose(`resource '${resource}' granted to '${username}'`);
        return true;
      }
      logger.verbose(`resource '${resource}' denied to '${username}'`);
      return false;
    }

    return ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      deferMiddleware(context, async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
        if (!(await canActivate(context))) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return next();
      });
      return next();
    };
  },
};

export default ResourceGuardProvider;
