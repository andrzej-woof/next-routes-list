# next-routes-list
Forked from https://github.com/Emiyaaaaa/next-routes-list

Generate list of routes based on Next.js source code

## Support
- [x] App routes
- [x] Page routes

## Install
```bash
pnpm add next-routes-list -D
```

## Usage

### 1. Run script

add script to `package.json`:
```json
{
  "script": {
    "generate-next-routes-list": "generate-next-routes-list"
  }
}
```
If you use `src` directory:
```json
{
  "script": {
    "generate-next-routes-list": "cd src && npx generate-next-routes-list"
  }
}
```

then run npm script:
```shell
npm run generate-next-routes-list
```

### 2. Import routes
TODO: incomplete readme, but basically you can call `getNextRoutesWithMatchers` and have a list of all routes + regular expression that you can use to test URL.pathname

```ts
import { getNextRoutesWithMatchers } from 'next-routes-list'

console.log(getNextRoutesWithMatchers())
/**
[
  '/',
  '/about',
  '/posts/[id]',
  ...
]
*/
```

## Example
next projct is [here](./test/next-project/), generate result is: [here](./test/routes.js).

## Contribute
feel free to contribute anything or report any issues.
