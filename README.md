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
- [ ] Implement & Write up documentation for all SocketIO events
  - [ ] SEND_MESSAGE
  - [ ] MESSAGE
  - [ ] CONNECT
  - [ ] DISCONNECT
  - [ ] LOGIN
  - [ ] LOGOUT
- [ ] Extract SocketIO logic out of `src/index.js`
