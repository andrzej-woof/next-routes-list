# next-routes-list
Easy generate all available routes in Next.js

## Support
- [x] App routes
- [ ] Page routes

## Install
```bash
npm install --save-dev next-routes-list@latest
```

## Usage

1. Run script

package.json
```json
{
  "script": {
    "generate-next-routes-list": "generate-next-routes-list"
  }
}
```
```shell
npm run generate-next-routes-list
```

2. Import routes
```ts
import { routes } from 'next-routes-list'

console.log(routes)
/**
[
  '/',
  '/about',
  '/posts/[id]',
  ...
]
*/
```

