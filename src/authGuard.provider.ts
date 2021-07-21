/**
 * File: /src/authGuard.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-07-2021 02:02:45
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
  AUTHORIZED,
  KEYCLOAK,
  KEYCLOAK_OPTIONS,
  KeycloakOptions,
  KeycloakService,
  RESOURCE
} from 'nestjs-keycloak';
import deferMiddleware from './deferMiddleware';
import { GraphqlCtx } from './types';

const logger = new Logger('AuthGuard');
export const AUTH_GUARD = 'AUTH_GUARD';

const AuthGuardProvider: FactoryProvider<MiddlewareFn<GraphqlCtx>> = {
  provide: AUTH_GUARD,
  inject: [KEYCLOAK_OPTIONS, KEYCLOAK, HttpService, Reflector],
  useFactory: (
    options: KeycloakOptions,
    keycloak: Keycloak,
    httpService: HttpService,
    reflector: Reflector
  ) => {
    function getResource(context: GraphqlCtx): string | null {
      const { getClass } = context.typegraphqlMeta || {};
      console.log('getClass', getClass);
      if (!getClass) return null;
      const classTarget = getClass();
      console.log('classTarget', classTarget);
      if (!classTarget) return null;
      return reflector.get<string>(RESOURCE, classTarget);
    }

    function getRoles(context: GraphqlCtx): (string | string[])[] | void {
      const { getClass, getHandler } = context.typegraphqlMeta || {};
      let classTarget: Type<any> | null = null;
      let handlerTarget: Function | null = null;
      if (getClass) classTarget = getClass();
      if (getHandler) handlerTarget = getHandler();
      const handlerRoles = handlerTarget
        ? reflector.get<(string | string[])[]>(AUTHORIZED, handlerTarget)
        : [];
      const classRoles = classTarget
        ? reflector.get<(string | string[])[]>(AUTHORIZED, classTarget)
        : [];
      if (
        (typeof classRoles === 'undefined' || classRoles === null) &&
        (typeof handlerRoles === 'undefined' || handlerRoles === null)
      ) {
        return undefined;
      }
      return [...new Set([...(handlerRoles || []), ...(classRoles || [])])];
    }

    async function canActivate(context: GraphqlCtx): Promise<boolean> {
      const keycloakService = new KeycloakService(
        options,
        keycloak,
        httpService,
        context
      );
      const roles = getRoles(context);
      if (typeof roles === 'undefined') return true;
      const username = (await keycloakService.getUserInfo())?.preferredUsername;
      console.log('Ausername', username);
      if (!username) return false;
      const resource = getResource(context);
      console.log('Aresource', resource);
      logger.verbose(
        `resource${
          resource ? ` '${resource}'` : ''
        } for '${username}' requires ${
          roles.length ? `roles [ ${roles.join(' | ')} ]` : 'authentication'
        }`
      );
      if (await keycloakService.isAuthorizedByRoles(roles)) {
        logger.verbose(`authorization for '${username}' granted`);
        return true;
      }
      logger.verbose(`authorization for '${username}' denied`);
      return false;
    }

    return ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      deferMiddleware(
        context,
        async ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
          if (!(await canActivate(context))) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
          }
          return next();
        }
      );
      return next();
    };
  }
};

export default AuthGuardProvider;
