/**
 * File: /src/middlewares.provider.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 21:45:29
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-07-2021 03:09:36
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

import { FactoryProvider } from "@nestjs/common";
import { MiddlewareFn, NextFn, ResolverData } from "type-graphql";
import { AUTH_GUARD } from "./authGuard.provider";
import { GraphqlCtx } from "./types";
import { RESOURCE_GUARD } from "./resourceGuard.provider";

export const MIDDLEWARES = "NESTJS_KEYCLOAK_TYPEGRAPHQL_MIDDLEWARES";

const MiddlewaresProvider: FactoryProvider<MiddlewareFn<GraphqlCtx>[]> = {
  provide: MIDDLEWARES,
  inject: [RESOURCE_GUARD, AUTH_GUARD],
  useFactory: (ResourceGuard: MiddlewareFn, AuthGuard: MiddlewareFn) => [
    (data: ResolverData, next: NextFn) => {
      return ResourceGuard(data, next);
    },
    (data: ResolverData, next: NextFn) => {
      return AuthGuard(data, next);
    },
  ],
};

export default MiddlewaresProvider;
