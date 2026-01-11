const {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const { getSecretHash } = require("../utils/secretHash");

const cognitoClient = new CognitoIdentityProviderClient({
region: process.env.AWS_REGION,
});

class CognitoService {
    static async signUp({ name, email, phone, password }) {
        const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: name,
        Password: password,
        SecretHash: getSecretHash(name),
        UserAttributes: [
            { Name: "name", Value: name },
            { Name: "email", Value: email },
            { Name: "phone_number", Value: phone },
        ],
        });

        return cognitoClient.send(command);
    }

    static async confirmSignUp(name, code) {
        const command = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: name,
        ConfirmationCode: code,
        SecretHash: getSecretHash(name),
        });

        return cognitoClient.send(command);
    }

    static async resendCode(name) {
        const command = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: name,
        SecretHash: getSecretHash(name),
        });

        return cognitoClient.send(command);
    }

    static async login(username, password) {
        const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: getSecretHash(username),
        },
        });

        return cognitoClient.send(command);
    }
}

module.exports = CognitoService;
