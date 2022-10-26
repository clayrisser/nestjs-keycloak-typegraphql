/**
 * File: /src/decorators/decorateAll.decorator.ts
 * Project: @risserlabs/nestjs-keycloak-typegraphql
 * File Created: 24-10-2022 09:51:36
 * Author: Clay Risser
 * -----
 * Last Modified: 26-10-2022 11:12:55
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

export default function DecorateAll(decorator: MethodDecorator, options: { exclude?: string[]; deep?: boolean } = {}) {
  return (target: any) => {
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    if (options.deep) {
      let base = Object.getPrototypeOf(target);
      while (base.prototype) {
        const baseDescriptors = Object.getOwnPropertyDescriptors(base.prototype);
        descriptors = { ...baseDescriptors, ...descriptors };
        base = Object.getPrototypeOf(base);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod = typeof descriptor.value === 'function' && propName !== 'constructor';
      // eslint-disable-next-line no-continue
      if (options.exclude?.includes(propName)) continue;
      // eslint-disable-next-line no-continue
      if (!isMethod) continue;
      decorator(target.prototype, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}
