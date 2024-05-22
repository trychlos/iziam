# izIAM maintainer/README

## Run in development mode

```
    APP_ENV=dev:0 meteor run --port 3003
```

Port 3003 is not absolutely required. What MUST actually be set is another port than 3000. This is because it is expected that the client applications runs itself on port 3000, which is also the target of the local nginx which redirect https://xps13.trychlos.lan to localhost:3000.

## Software architecture

An APP_ADMIN account is created at the first startup in standard (local) Accounts collection.
