/**
 * File: /src/decorators/decorateAll.decorator.ts
 * Project: nestjs-keycloak-typegraphql
 * File Created: 17-07-2021 20:14:37
 * Author: Clay Risser <clayrisser@gmail.com>
 * -----
 * Last Modified: 20-07-2021 00:40:32
 * Modified By: Clay Risser <clayrisser@gmail.com>
 * -----
 * https://github.com/Papooch/decorate-all/blob/main/src/lib/decorate-all.decorator.ts
 *
 * MIT License
 *
 * Copyright (c) 2021 Papooch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default function DecorateAll(
  decorator: MethodDecorator,
  options: { exclude?: string[]; deep?: boolean } = {}
) {
  return (target: any) => {
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    if (options.deep) {
      let base = Object.getPrototypeOf(target);
      while (base.prototype) {
        const baseDescriptors = Object.getOwnPropertyDescriptors(
          base.prototype
        );
        descriptors = { ...baseDescriptors, ...descriptors };
        base = Object.getPrototypeOf(base);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value === 'function' && propName !== 'constructor';
      // eslint-disable-next-line no-continue
      if (options.exclude?.includes(propName)) continue;
      // eslint-disable-next-line no-continue
      if (!isMethod) continue;
      decorator(target, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}
