/**
 * File: /src/types.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 17-07-2021 19:16:13
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 18-07-2021 03:21:43
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

import { ApiProperty } from '@nestjs/swagger';
import { KeycloakContext } from 'keycloak-connect-graphql';
import { KeycloakService, KeycloakRequest } from 'nestjs-keycloak';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ObjectType, Field } from 'type-graphql';
import { Request } from 'express';

export interface HashMap<T = any> {
  [key: string]: T;
}

export interface TypeGraphqlMeta {
  resource?: string;
  scopes?: string[];
  [key: string]: any;
}

export interface GraphqlCtx extends HashMap {
  kauth?: KeycloakContext;
  keycloakService?: KeycloakService;
  req?: KeycloakRequest<Request>;
  typegraphqlMeta?: TypeGraphqlMeta;
}

export interface KeycloakTypegraphqlOptions {}

export interface KeycloakTypegraphqlAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<KeycloakTypegraphqlOptions> | KeycloakTypegraphqlOptions;
}

@ObjectType()
export class UserInfo {
  @ApiProperty()
  @Field((_type) => Boolean)
  emailVerified!: boolean;

  @ApiProperty()
  @Field((_type) => String)
  preferredUsername!: string;

  @ApiProperty()
  @Field((_type) => String)
  sub!: string;

  [key: string]: any;
}

export const KEYCLOAK_TYPEGRAPHQL_OPTIONS = 'KEYCLOAK_TYPEGRAPHQL_OPTIONS';
