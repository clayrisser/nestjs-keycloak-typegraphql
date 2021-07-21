/**
 * File: /src/decorators/index.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 22:27:15
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 21-07-2021 03:10:02
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

import DecorateAll from './decorateAll.decorator';
import RegisterClass from './registerClass.decorator';
import RegisterHandler from './registerHandler.decorator';
import { Resolver } from './resolver.decorator';

export { DecorateAll, RegisterClass, RegisterHandler, Resolver };
