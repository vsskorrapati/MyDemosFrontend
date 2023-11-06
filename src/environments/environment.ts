// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  refresh_uri: "http://localhost:4001/refreshOrgData",
  share_uri: "http://localhost:4001/share",
  get_auth_uri: "http://localhost:4001/check-auth",
  server_graph_uri: "http://localhost:4001/graphql",
  validate_uri: "http://localhost:4001/validate",
  auth_redirect_uri: "https://localhost/auth/alohaauth?app=q-stockpile",
  change_password_uri: "http://localhost:4001/setPassword",
  fetch_shared_user_emails:"http://localhost:4001/fetchSharedUserEmails",
  image_upload_uri: "http://localhost:4001/image-upload",
  extender_uri: "http://localhost:4001/extendOrgExpiry",
  update_password_uri: "http://localhost:4001/updatePassword",
  mixpanel_uri: "http://localhost:4001/track",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
