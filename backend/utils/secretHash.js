const crypto = require("crypto");

module.exports.getSecretHash = (username) => {
  return crypto
    .createHmac("sha256", process.env.COGNITO_CLIENT_SECRET)
    .update(username + process.env.COGNITO_CLIENT_ID)
    .digest("base64");
};
