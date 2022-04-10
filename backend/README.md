```
backend $ cp \
    .env.template \
    .env

# Provide values for the variables in `backend/.env`.

backend $ npm run install

backend $ npm run test -- \
    --watchAll \
    --coverage

backend $ npm run migration:run -- \
    -c connection-to-db-for-dev

backend $ npm run dev
```