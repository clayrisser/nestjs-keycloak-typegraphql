/**
 * File: /src/resourceGuard.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-07-2021 02:39:28
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

import { HttpService } from '@nestjs/axios';
import { Keycloak } from 'keycloak-connect';
import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import { Reflector } from '@nestjs/core';
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
import deferMiddleware from './deferMiddleware';
import { GraphqlCtx } from './types';

const logger = new Logger('ResourceGuard');
export const RESOURCE_GUARD = 'RESOURCE_GUARD';

const ResourceGuardProvider: FactoryProvider<MiddlewareFn<GraphqlCtx>> = {
  provide: RESOURCE_GUARD,
  inject: [KEYCLOAK_OPTIONS, KEYCLOAK, HttpService, Reflector],
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
      console.log('getClass', getClass);
      console.log('getHandler', getHandler);
      let classTarget: Type<any> | null = null;
      let handlerTarget: Function | null = null;
      if (getClass) classTarget = getClass();
      if (getHandler) handlerTarget = getHandler();
      console.log('classTarget', classTarget);
      console.log('handlerTarget', handlerTarget);
      const handlerScopes = handlerTarget
        ? reflector.get<string[]>(SCOPES, handlerTarget) || []
        : [];
      console.log('handlerScopes', handlerScopes);
      const classScopes = classTarget
        ? reflector.get<string[]>(SCOPES, classTarget) || []
        : [];
      console.log('classScopes', classScopes);
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
      console.log('RResource', resource);
      if (!resource) return true;
      const scopes = getScopes(context);
      console.log('RScopes', scopes);
      if (!scopes?.length) return true;
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

    return ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      deferMiddleware(
        context,
        async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
          if (!(await canActivate(context))) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
          }
          return next();
        }
      );
      return next();
    };
  }
};

export default ResourceGuardProvider;
