import { google } from "googleapis";

const googleConfig = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  redirect: "https://localizamed.herokuapp.com/",
};

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}
