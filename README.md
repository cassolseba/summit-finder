# Summit Finder
Service Design and Engineering official course project. University of Trento.

## Response message
Since JSON:API and Swagger are much more complex for a project of this dimension,
this project adopts the JSend specification. 
(https://github.com/omniti-labs/jsend)[click here for additional info].  

## Password generation
Salt is not stored in the database because it is challenging to generate it for api testing.
https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/

## Authentication JWT
https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
https://medium.com/gen-y/custom-role-based-auth-mechanism-for-nodejs-d40e5efdd140