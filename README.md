# Backend INCIT Test

## Get Started

- Clone repository with command `git clone <alamat_repo>`
- Move to directory traveloka-ocr-api `cd backend-incit-test`
- Install dependencies using command `npm install`
- Rename .env-example to .env  
  Make sure that .env has content like this:

  ```
  # server configuration (dev)
  HOST=localhost
  PORT=3300

  # node-postgres configuration (prod)
  PGUSER=
  PGHOST=
  PGPASSWORD=
  PGDATABASE=
  PGPORT=

  # JWT token
  SECRET=

  # Google Auth
  GOOGLE_CLIENT_ID  
  GOOGLE_CLIENT_SECRET=

  # Facebook Auth
  CLIENT_ID=
  CLIENT_SECRET=

  BASE_URL=
  ```
  

- migrate to the db `npm run migrate up`
- Running the server `npm run dev`