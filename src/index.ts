/*
 *  File: /src/index.ts
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

import type { DynamicModule } from '@nestjs/common';
import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import AuthCheckerProvider from './authChecker.provider';
import AuthGuardProvider from './authGuard.provider';
import MiddlewaresProvider from './middlewares.provider';
import ResourceGuardProvider from './resourceGuard.provider';
import WrapContextProvider from './wrapContext.provider';
import type { KeycloakTypegraphqlOptions, KeycloakTypegraphqlAsyncOptions } from './types';
import { KEYCLOAK_TYPEGRAPHQL_OPTIONS } from './types';

@Global()
@Module({})
export default class KeycloakModule {
  private readonly logger = new Logger(KeycloakModule.name);

  private static imports = [HttpModule];

  public static register(options: KeycloakTypegraphqlOptions): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: KeycloakModule.imports,
      providers: [
        AuthCheckerProvider,
        AuthGuardProvider,
        MiddlewaresProvider,
        ResourceGuardProvider,
        WrapContextProvider,
        {
          provide: KEYCLOAK_TYPEGRAPHQL_OPTIONS,
          useValue: options,
        },
      ],
      exports: [
        AuthCheckerProvider,
        AuthGuardProvider,
        KEYCLOAK_TYPEGRAPHQL_OPTIONS,
        MiddlewaresProvider,
        ResourceGuardProvider,
        WrapContextProvider,
      ],
    };
  }

  public static registerAsync(asyncOptions: KeycloakTypegraphqlAsyncOptions): DynamicModule {
    return {
      module: KeycloakModule,
      global: true,
      imports: [...KeycloakModule.imports, ...(asyncOptions.imports || [])],
      providers: [
        AuthCheckerProvider,
        AuthGuardProvider,
        KeycloakModule.createOptionsProvider(asyncOptions),
        MiddlewaresProvider,
        ResourceGuardProvider,
        WrapContextProvider,
      ],
      exports: [
        AuthCheckerProvider,
        AuthGuardProvider,
        KEYCLOAK_TYPEGRAPHQL_OPTIONS,
        MiddlewaresProvider,
        ResourceGuardProvider,
        WrapContextProvider,
      ],
    };
  }

  private static createOptionsProvider(asyncOptions: KeycloakTypegraphqlAsyncOptions) {
    if (!asyncOptions.useFactory) {
      throw new Error("registerAsync must have 'useFactory'");
    }
    return {
      inject: asyncOptions.inject || [],
      provide: KEYCLOAK_TYPEGRAPHQL_OPTIONS,
      useFactory: asyncOptions.useFactory,
    };
  }
}

export { AuthCheckerProvider, ResourceGuardProvider, WrapContextProvider };

export * from './authChecker.provider';
export * from './authGuard.provider';
export * from './decorators';
export * from './deferMiddleware';
export * from './middlewares.provider';
export * from './resourceGuard.provider';
export * from './types';
export * from './wrapContext.provider';
