var fs = require("fs");
var str = `
export const environment = {
    production: true,
    refresh_uri: '${process.env.REFRESH_URI}',
    share_uri: '${process.env.SHARE_URI}',
    get_auth_uri: '${process.env.GET_AUTH_URI}',
    server_graph_uri: '${process.env.SERVER_GRAPH_URI}',
    validate_uri: '${process.env.VALIDATE_URI}',
    auth_redirect_uri: '${process.env.AUTH_REDIRECT_URI}',
    change_password_uri: '${process.env.CHANGE_PASSWORD_URI}',
    fetch_shared_user_emails: '${process.env.FETCH_SHARED_USER_EMAILS}',
    image_upload_uri: '${process.env.IMAGE_UPLOAD_URI}',
    extender_uri: '${process.env.Q_EXTENDER_URI}',
    update_password_uri: '${process.env.UPDATE_PWD_URI}',
    mixpanel_uri: '${process.env.MIXPANEL_TRACK_URI}'
};
`;

if (process.env.ENV == "staging") {
  fs.writeFile("./src/environments/environment.staging.ts", str, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
} else if (process.env.ENV == "production") {
  fs.writeFile("./src/environments/environment.prod.ts", str, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved! True!!");
  });
}
