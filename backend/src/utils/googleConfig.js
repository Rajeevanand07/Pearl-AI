const {google} = require("googleapis")

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// Scopes needed for Google Calendar access
exports.SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',

];

exports.oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET,
   'postmessage'
);