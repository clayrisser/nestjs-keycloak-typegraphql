/*
 *  File: /src/types.ts
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

import { ApiProperty } from '@nestjs/swagger';
import type { KeycloakContext } from 'keycloak-connect-graphql';
import type { KeycloakService, KeycloakRequest } from '@risserlabs/nestjs-keycloak';
import type { ModuleMetadata } from '@nestjs/common/interfaces';
// import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import type { MiddlewareFn } from 'type-graphql';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import type { Request } from 'express';
import type { Type } from '@nestjs/common';

export interface TypeGraphqlMeta {
  deferredMiddlewares?: MiddlewareFn[];
  getClass?: () => Type<any>;
  getHandler?: () => Function;
  [key: string]: any;
}

export interface GraphqlCtx extends Record<string, any> {
  kauth?: KeycloakContext;
  keycloakService?: KeycloakService;
  req?: KeycloakRequest<Request>;
  typegraphqlMeta?: TypeGraphqlMeta;
}

export type KeycloakTypegraphqlOptions = Record<string, unknown>;

export interface KeycloakTypegraphqlAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<KeycloakTypegraphqlOptions> | KeycloakTypegraphqlOptions;
}

export enum GqlBufferType {
  Buffer = 'Buffer',
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
export class Token {
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
  @Field((_type) => Token)
  access_token?: Token;

  @ApiProperty()
  @Field((_type) => Token)
  refresh_token?: Token;

  @ApiProperty()
  @Field((_type) => Token)
  id_token?: Token;

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

  // eslint-disable-next-line no-undef
  [key: string]: any;
}

@ObjectType()
export class GrantTokensOptions {
  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  password?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  refreshToken?: string;

  @ApiProperty()
  @Field((_type) => [String], { nullable: true })
  scope?: string | string[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  username?: string;
}

@ObjectType()
export class RefreshTokenGrant {
  @ApiProperty()
  @Field((_type) => Token, { nullable: true })
  accessToken?: Token;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  expiresIn?: number;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  message!: string;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  refreshExpiresIn?: number;

  @ApiProperty()
  @Field((_type) => Token, { nullable: true })
  refreshToken?: Token;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  scope?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  tokenType?: string;
}

export class UserConsent {
  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  clientId?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  createDate?: string;

  @ApiProperty()
  @Field((_type) => [String], { nullable: true })
  grantedClientScopes?: string[];

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  lastUpdatedDate?: number;
}

export class Credential {
  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  algorithm?: string;

  @ApiProperty()
  config?: Record<string, any>;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  counter?: number;

  @ApiProperty()
  @Field((_type) => Number)
  createdDate?: number;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  device?: string;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  digits?: number;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  hashIterations?: number;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  hashedSaltedValue?: string;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  period?: number;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  salt?: string;

  @ApiProperty()
  @Field((_type) => Boolean, { nullable: true })
  temporary?: boolean;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  type?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  value?: string;
}

export class FederatedIdentityRepresentation {
  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  identityProvider?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  userId?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  userName?: string;
}

export class User {
  @ApiProperty()
  access?: Record<string, boolean>;

  @ApiProperty()
  attributes?: Record<string, any>;

  @ApiProperty()
  @Field((_type) => [UserConsent], { nullable: true })
  clientConsents?: UserConsent[];

  @ApiProperty()
  clientRoles?: Record<string, any>;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  createdTimestamp?: number;

  @ApiProperty()
  @Field((_type) => [Credential], { nullable: true })
  credentials?: Credential[];

  @ApiProperty()
  @Field((_type) => [String], { nullable: true })
  disableableCredentialTypes?: string[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  email?: string;

  @ApiProperty()
  @Field((_type) => Boolean, { nullable: true })
  emailVerified?: boolean;

  @ApiProperty()
  @Field((_type) => Boolean, { nullable: true })
  enabled?: boolean;

  @ApiProperty()
  @Field((_type) => [FederatedIdentityRepresentation], { nullable: true })
  federatedIdentities?: FederatedIdentityRepresentation[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  federationLink?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  firstName?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  groups?: string[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  id?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  lastName?: string;

  @ApiProperty()
  @Field((_type) => Number, { nullable: true })
  notBefore?: number;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  origin?: string;

  @ApiProperty()
  @Field((_type) => [String], { nullable: true })
  realmRoles?: string[];

  // @ApiProperty()
  // @Field((_type) => [RequiredActionAlias], { nullable: true })
  // requiredActions?: RequiredActionAlias[];

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  self?: string;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  serviceAccountClientId?: string;

  @ApiProperty()
  @Field((_type) => Boolean, { nullable: true })
  totp?: boolean;

  @ApiProperty()
  @Field((_type) => String, { nullable: true })
  username?: string;
}

export const KEYCLOAK_TYPEGRAPHQL_OPTIONS = 'KEYCLOAK_TYPEGRAPHQL_OPTIONS';

export interface Token {
  clientId: string;

  content: TokenContent;

  header: TokenHeader;

  signature: GqlBuffer;

  signed: string;

  token: string;
  isExpired: () => boolean;
  hasRole: (roleName: string) => boolean;
  hasApplicationRole: (appName: string, roleName: string) => boolean;
  hasRealmRole: (roleName: string) => boolean;
}

export interface TokenContentRealmAccess {
  roles: string[];
  [key: string]: any;
}

interface ResourceAccessItem {
  roles?: string[];
  [key: string]: any;
}

export type ResourceAccess = Record<string, ResourceAccessItem>;
