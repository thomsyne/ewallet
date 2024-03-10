// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,
  apiUrl: 'https://k3aqefqgcp.us-east-2.awsapprunner.com/',
  //apiUrl: 'http://localhost:3000/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const HttpOptions = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json', 
    'x-source-code': 'ANP3WEB' ,
    'x-client-id': 'APPDEV_56666CDXGH8953EqUTY',
    'x-client-secret':'APPDEV_56666CDXGH8953EqUTY56666CDXGH8953EqUTY',
    'X-Content-Type-Options': 'nosniff',
    'cache-control':'max-age=3153600',
    'X-Frame-Options' : 'DENY',
    'X-XSS-Protection': '1',
    'Expect-CT': 'max-age=3600, enforce'
    })
};
