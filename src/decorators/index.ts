/*
 *  File: /src/decorators/index.ts
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

import Guards from './guards.decorator';
import RegisterClass from './registerClass.decorator';
import RegisterHandler from './registerHandler.decorator';
import { Resolver } from './resolver.decorator';
import { OnlyOwner } from './onlyOwner.decorator';

export { RegisterClass, RegisterHandler, Resolver, Guards, OnlyOwner };
