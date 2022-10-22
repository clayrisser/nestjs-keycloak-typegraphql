# nestjs-keycloak-typegraphql

> nestjs module for authenticating typegraphql with keycloak

Please ★ this repo if you found it useful ★ ★ ★

## Installation

```sh
npm install --save nestjs-keycloak-typegraphql
```

## Notes

Must use AuthGuard instead of AuthChecker because getHandler() is not available to the auth checker.  The reason it is available to the AuthGuard is because the middleware for the guard is deferred.

## Support

Submit an [issue](https://github.com/clayrisser/nestjs-keycloak-typegraphql/issues/new)

## License

[Apache-2.0 License](LICENSE)

[Silicon Hills LLC](https://clayrisser.com) © 2021

## Credits

- [Clay Risser](https://clayrisser.com) - Author
