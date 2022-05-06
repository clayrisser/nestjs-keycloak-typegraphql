/**
 * File: /src/decorators/guards.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 19-07-2021 18:40:53
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 25-07-2021 04:49:06
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

import { applyDecorators } from "@nestjs/common";
import { NextFn, ResolverData, createMethodDecorator } from "type-graphql";
import DecorateAll from "./decorateAll.decorator";
import RegisterClass from "./registerClass.decorator";
import RegisterHandler from "./registerHandler.decorator";
import { GraphqlCtx } from "../types";
import { combineMiddlewares } from "../deferMiddleware";

export default function Guards(): ClassDecorator {
  return applyDecorators(
    DecorateAll(
      createMethodDecorator((data: ResolverData<GraphqlCtx>, next: NextFn) => {
        const { context } = data;
        if (!context.typegraphqlMeta?.deferredMiddlewares?.length) {
          return next();
        }
        return combineMiddlewares(context.typegraphqlMeta.deferredMiddlewares)(
          data,
          next
        );
      })
    ),
    DecorateAll(RegisterHandler),
    RegisterClass
  );
}
