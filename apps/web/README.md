# Web application

## Pre-requisites

- install planetscale cli
  - `brew install planetscale/tap/pscale`
- install mysql client
  - `brew install mysql-client`

## Get started

- run local server
  - `pnpm run start:db`
- run local web server
  - `pnpm run start:web`
- to view db, run `pnpm run start:studio`

## planetscale

- login `pscale auth login`
- run db locally `pnpm run db`
- create a branch `pscale branch create munch-api <BRANCH_NAME>`
- sync prisma.schema with PlanetScale schema via `pnpm run sync:schema`
- To verify that the database is in sync with the prisma schema, run mysql playground via `pscale shell munch-api dev`
  - Then run `describe <MODAL_NAME>;`
  - run `exit` to leave
- To promote a branch to production once in sync, run `pscale branch promote munch-api main`

## reference

- [PlanetScale Docs](https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale)
- [Youtube Video](https://www.youtube.com/watch?v=JtqdAn_wYzY)

## Maps

- [google maps api](https://mapsplatform.google.com/)

## classnames

- element position
- element behavior
- element styles
- children styles
