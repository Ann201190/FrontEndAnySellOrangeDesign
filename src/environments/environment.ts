// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//ЛОКАЛЬНО
export const environment = {
  production: false,
  authApi: 'http://192.168.58.213/',
  storeApi: 'https://localhost:44350/',
  tokenWhiteListedDomains: ['localhost:44350', '192.168.58.213']
};

//ХОСТИНГ
/*export const environment = {
  production: false,
  authApi: 'http://auth.user21741.realhost-free.net/',
  storeApi: 'http://user21741.realhost-free.net/',
  tokenWhiteListedDomains: ['user21741.realhost-free.net', 'auth.user21741.realhost-free.net']
};*/


/*export const environment = {
  production: false,
  authApi: 'https://localhost:44327/',
  storeApi: 'https://localhost:44350/',
  tokenWhiteListedDomains: ['localhost:44350']
};*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
