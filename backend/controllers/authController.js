const CognitoService = require("../services/cognitoService.js");

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await CognitoService.signUp({ name, email, phone, password });
    res.status(201).json({
      message: "Signup successful. Check your email for verification code.",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.confirm = async (req, res) => {
  const { name, code } = req.body;

  try {
    await CognitoService.confirmSignUp(name, code);
    res.json({ message: "Account confirmed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resendCode = async (req, res) => {
  const { name } = req.body;

  try {
    await CognitoService.resendCode(name);
    res.json({ message: "Verification code resent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await CognitoService.login(username, password);

    res.json({
      message: "Login successful",
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    });
  } catch (err) {
    if (err.name === "UserNotConfirmedException") {
      return res.status(403).json({
        message: "User not confirmed. Please verify your email.",
      });
    }

    res.status(401).json({ message: err.message });
  }
};
