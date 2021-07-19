/**
 * File: /src/types.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 17-07-2021 19:16:13
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 19-07-2021 18:25:57
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
import { ObjectType, Field, registerEnumType } from 'type-graphql';
import { Request } from 'express';
import { Type } from '@nestjs/common';

export interface HashMap<T = any> {
  [key: string]: T;
}

export interface TypeGraphqlMeta {
  getClass?(): Type<any>;
  getHandler?(): Function;
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

export enum GqlBufferType {
  Buffer = 'Buffer'
}
registerEnumType(GqlBufferType, { name: 'GqlBufferType' });

@ObjectType()
export class GqlBuffer {
  @ApiProperty()
  @Field((_type) => GqlBufferType)
  type!: GqlBufferType;

  @ApiProperty()
  @Field((_type) => [Number])
  data!: number[];
}

@ObjectType()
export class TokenContentRealmAccess {
  @ApiProperty()
  @Field((_type) => [String])
  roles!: string[];
}

@ObjectType()
export class TokenHeader {
  @ApiProperty()
  @Field((_type) => String)
  alg!: string;

  @ApiProperty()
  @Field((_type) => String)
  kid!: string;

  @ApiProperty()
  @Field((_type) => String)
  typ!: string;
}

@ObjectType()
export class TokenContent {
  // @ApiProperty()
  // @Field((_type) => [String])
  // 'allowed-origins': string[];

  @ApiProperty()
  @Field((_type) => String)
  acr!: string;

  @ApiProperty()
  @Field((_type) => String)
  azp!: string;

  @ApiProperty()
  @Field((_type) => Boolean)
  email_verified!: boolean;

  @ApiProperty()
  @Field((_type) => Number)
  exp!: number;

  @ApiProperty()
  @Field((_type) => Number)
  iat!: number;

  @ApiProperty()
  @Field((_type) => String)
  iss!: string;

  @ApiProperty()
  @Field((_type) => String)
  jti!: string;

  @ApiProperty()
  @Field((_type) => String)
  preferred_username!: string;

  @ApiProperty()
  @Field((_type) => TokenContentRealmAccess)
  realm_access!: TokenContentRealmAccess;

  @ApiProperty()
  @Field((_type) => String)
  scope!: string;

  @ApiProperty()
  @Field((_type) => String)
  session_state!: string;

  @ApiProperty()
  @Field((_type) => String)
  sub!: string;

  @ApiProperty()
  @Field((_type) => String)
  typ!: string;
}

@ObjectType()
export class TokenProperties {
  @ApiProperty()
  @Field((_type) => String)
  clientId!: string;

  @ApiProperty()
  @Field((_type) => String)
  signed!: string;

  @ApiProperty()
  @Field((_type) => String)
  token!: string;

  @ApiProperty()
  @Field((_type) => TokenContent)
  content!: TokenContent;

  @ApiProperty()
  @Field((_type) => TokenHeader)
  header!: TokenHeader;

  @ApiProperty()
  @Field((_type) => GqlBuffer)
  signature!: GqlBuffer;
}

@ObjectType()
export class GrantProperties {
  @ApiProperty()
  @Field((_type) => TokenProperties)
  access_token?: TokenProperties;

  @ApiProperty()
  @Field((_type) => TokenProperties)
  refresh_token?: TokenProperties;

  @ApiProperty()
  @Field((_type) => TokenProperties)
  id_token?: TokenProperties;

  @ApiProperty()
  @Field((_type) => String)
  expires_in?: string;

  @ApiProperty()
  @Field((_type) => String)
  token_type?: string;
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
