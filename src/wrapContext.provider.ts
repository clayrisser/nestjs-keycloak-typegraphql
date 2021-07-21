/**
 * File: /src/wrapContext.provider.ts
 * Project: nestjs-keycloak
 * File Created: 16-07-2021 19:45:17
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-07-2021 03:05:29
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

import { FactoryProvider } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Keycloak } from 'keycloak-connect';
import { KeycloakContext } from 'keycloak-connect-graphql';
import {
  KEYCLOAK,
  KEYCLOAK_OPTIONS,
  KeycloakOptions,
  KeycloakService
} from 'nestjs-keycloak';
import { GraphqlCtx, HashMap } from './types';

export const WRAP_CONTEXT = 'NESTJS_KEYCLOAK_TYPEGRAPHQL_WRAP_CONTEXT';

const WrapContextProvider: FactoryProvider<GraphqlCtx> = {
  provide: WRAP_CONTEXT,
  inject: [KEYCLOAK_OPTIONS, KEYCLOAK, HttpService],
  useFactory: (
    options: KeycloakOptions,
    keycloak: Keycloak,
    httpService: HttpService
  ) => {
    return (context: HashMap) => {
      const graphqlContext: GraphqlCtx = context;
      graphqlContext.kauth = new KeycloakContext(
        { req: context.req },
        keycloak
      );
      graphqlContext.typegraphqlMeta = {};
      graphqlContext.keycloakService = new KeycloakService(
        options,
        keycloak,
        httpService,
        graphqlContext
      );
      return graphqlContext;
    };
  }
};

export default WrapContextProvider;
