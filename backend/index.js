const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5001;
const JWT_SECRET = "super_secret_key"; // move to .env later

const corsOptions = {
  origin: "http://localhost:3000", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


// In-memory users (replace with DB later)
let users = [];

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});


// =======================
// 🔐 SIGNUP
// =======================
const crypto = require("crypto");
const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

function getSecretHash(username) {
  return crypto
    .createHmac(
      "sha256", 
      "137ntp5v4fh9vrl0p9v615fhlkf7b4eq4vo60jd52gmfhibhua1p" // client secret
    )
    .update(username + "1sadfircm82pq4rp2efpccb64k") // username + client id
    .digest("base64");
}


const client = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

app.post("/api/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    console.log("SecretHash:", getSecretHash(email));
    console.log(name.trim())
    const command = new SignUpCommand({
      ClientId: "1sadfircm82pq4rp2efpccb64k", // linked to your user pool
      Username: name.trim(),
      Password: password,
      SecretHash: getSecretHash(name),

      UserAttributes: [
        { Name: "name", Value: name },
        { Name: "email", Value: email },
        { Name: "phone_number", Value: phone }, // must be +92...
      ],
    });

    await client.send(command);

    res.status(201).json({
      message: "Signup successful. Check email/SMS to confirm account.",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


// =======================
// 🔑 LOGIN
// =======================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

// =======================
// 👥 USERS (Protected example)
// =======================
app.get("/api/users", (req, res) => {
  res.json(users.map(({ password, ...rest }) => rest)); // hide password
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
