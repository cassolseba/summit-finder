# Summit Finder
This project is to devise,
design and develop a service-oriented application that applies technologies and techniques learned 
during the Service Design and Engineering lectures and laboratories. 
In particular, it is required to develop a project that consists of multiple services.
The idea is an application where the 
user can search for mountain peaks and alpine refuges to reach and save the result in a personal wishlist. 
Since the wishlist is private, the user is required to create an account and authenticate to access the application.

## Architecture
![Summit Finder Architecture](https://github.com/cassolseba/summit-finder/blob/main/assets/scheme-summit-finder.png "Summit Finder Architecture")

# JSend
Since JSON:API and Swagger are too complex for a project of this scale,
this project adopts the JSend specification.
For additional information, please visit the [official page](https://github.com/omniti-labs/jsend).

## How to run the project
This application is composed of several services that run each one in its own docker container.
To run the project, launch the following command from the root project directory.
```Bash
  docker-compose up
```
Please make sure that your`.env` file is present in the base directory.
Required variables are specified in the `docker-compose.yml` file. 

## How to create an admin
To create an admin user, send a `POST` request to user service endpoint specifying `admin: true` in the body.
```json
    {
      "username": "user",
      "name": "pretty",
      "lastName": "name",
      "email": "pretty.name@studenti.unitn.it",
      "password": "sde-project-24",
      "admin": true
    }
```

## Testing
Testing operation could be done using the postman collection contained in this repository.

## Acknowledgment
- [How to use jwt tokens to authorize users](https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e)
- [Custom role-based authentication in Node.js](https://medium.com/gen-y/custom-role-based-auth-mechanism-for-nodejs-d40e5efdd140)
- [Password hashing](https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/)