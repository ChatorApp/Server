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
  - [x] CONNECT _(This is being listened to and just being logged in the console for now)_
  - [x] ~~DISCONNECT~~ _(Not needed as first thought)_
  - [x] ~~LOGIN~~ _(Not needed as this is detected via /api/auth/login)_
  - [x] ~~LOGOUT~~ _(Not needed as this is detected via /api/auth/login)_
- [x] Extract SocketIO logic out of `src/index.js`

## API Endpoints

### /api/auth

| Endpoint                         | Request Type | Endpoint Description                                |
| -------------------------------- | ------------ | --------------------------------------------------- |
| /api/auth/verify                 | GET          | Handles verification of whether a user is logged in |
| /api/auth/signup                 | POST         | Handles registering a user up for the system        |
| /api/auth/login                  | POST         | Handles logging in for the system                   |
| /api/auth/email/verify           | POST         | Handles verification of emails                      |
| /api/auth/email/verify/request   | POST         | Handles generation of an email request token        |
| /api/auth/password/reset         | POST         | Handles password resets                             |
| /api/auth/password/reset/request | POST         | Handles generation of password reset tokens         |

### /api/servers

| Endpoint            | Request Type | Endpoint Description                                 |
| ------------------- | ------------ | ---------------------------------------------------- |
| /api/servers/me     | GET          | Gets all servers that the current user has access to |
| /api/servers/:id    | GET          | Gets information about a specific server             |
| /api/servers/create | POST         | Creates a server                                     |
| /api/servers/update | PUT          | Updates a server                                     |
| /api/servers/delete | DELETE       | Deletes a server                                     |

### /api/users

| Endpoint      | Request Type | Endpoint Description                     |
| ------------- | ------------ | ---------------------------------------- |
| /api/users/me | GET          | Gets information about the specific user |
