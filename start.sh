
export GOOGLE_CLIENT_ID=$(head -n 1 creds.txt)
export GOOGLE_CLIENT_SECRET=$(tail -n 2 creds.txt | head -n 1)
export ALLOWLIST=$(tail -n 1 creds.txt)
export SESSION_SECRET=localonly
export PORT=3001
export HOST=localhost
export INMEM_SESSION=true
export PGUSER=admin
export PGDATABASE=dominion
export PGPASSWORD=$(cat dbpwd.txt)

yarn dev