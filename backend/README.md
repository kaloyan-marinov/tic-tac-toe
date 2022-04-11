```
backend $ cp \
    .env.template \
    .env

# Provide values for the variables in `backend/.env`.

backend $ npm install

backend $ npm run test -- \
    --watchAll \
    --coverage

backend $ npm run migration:run -- \
    -c connection-to-db-for-dev
# Note that the previous command has created a `backend/database.sqlite` file;
# its contents can be inspected in an interactive SQLite shell session
# by issuing `backend $ sqlite3 database.sqlite`.

backend $ npm run dev
```