# Chator

Chator is a chat system which relies on complete transparency

## Roadmap

Below is a list of tasks that need be completed to produce a MVP (Minimum Viable Product)

- [x] Add Authentication Endpoints
  - [x] Signup
  - [x] Login
  - [x] Password Reset
    - [x] Request a Reset Key
    - [x] Reset & Change Password
- [x] Add Bearer Authentication to all endpoints
  - Exceptions:
    - `/auth/signup`
    - `/auth/login`
    - `/auth/password/reset/request`
    - `/auth/password/reset`
    - `/auth/email/verify/request`
    - `/auth/email/verify`
- [x] Add server models & objects
  - [x] Create Server
    - [x] Add Icons - ~~cdn?~~ For now we're just using existing Icon URLs
    - [x] Add Privacy Filter - It is defaulted to Private for now, until Update server is created
  - [x] Update Server
    - [x] Change Privacy
    - [x] Change Name
    - [x] Change Description
    - [x] Change Icons
  - [x] Delete Server
- [x] Implement & Write up documentation for all SocketIO events
  - [x] SEND_MESSAGE
  - [x] MESSAGE
  - [x] CONNECT *(This is being listened to and just being logged in the console for now)*
  - [x] ~~DISCONNECT~~ *(Not needed as first thought)*
  - [x] ~~LOGIN~~ *(Not needed as this is detected via /api/auth/login)*
  - [x] ~~LOGOUT~~ *(Not needed as this is detected via /api/auth/login)*
- [x] Extract SocketIO logic out of `src/index.js`
