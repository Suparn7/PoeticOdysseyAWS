import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { setUserData } from "../store/authSlice"; // Import your action here
import awsConf from "./awsConf";

export class AWSAuthService {
    userPool;

    constructor() {
        this.userPool = new CognitoUserPool({
            UserPoolId: awsConf.userPoolId,
            ClientId: awsConf.clientId,
        });
    }

    // Sign up a new user
    async createAccount({ email, password, name }) {
        return new Promise((resolve, reject) => {
            this.userPool.signUp(email, password, [{ Name: "name", Value: name }], null, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        user: result.user,
                        userSub: result.userSub
                    });
                }
            });
        });
    }

    async confirmEmail({ email, confirmationCode }) {
        if (!email || !confirmationCode) {
            console.error("Email and confirmation code are required", email, confirmationCode);
            return Promise.reject(new Error("Email and confirmation code are required"));
        }
    
        // Initialize CognitoUser with email and userPool
        const user = new CognitoUser({
            Username: email,  // Ensure the email is correctly passed here
            Pool: this.userPool, // Ensure the userPool is properly initialized
        });
    
        return new Promise((resolve, reject) => {
            user.confirmRegistration(confirmationCode, true, (err, result) => {
                if (err) {
                    console.error("Error confirming email:", err);
                    reject(err); // Return error if confirmation fails
                } else {
                    console.log("Email confirmed successfully:", result);
                    resolve(result); // Resolve with the result of confirmation
                }
            });
        });
    }

    async resendConfirmationCode(email) {
        if (!email) {
            console.error("Email is required to resend confirmation code");
            return Promise.reject(new Error("Email is required to resend confirmation code"));
        }
    
        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool,
        });
    
        return new Promise((resolve, reject) => {
            user.resendConfirmationCode((err, result) => {
                if (err) {
                    console.error("Error resending confirmation code:", err);
                    reject(err);
                } else {
                    console.log("Confirmation code resent successfully:", result);
                    resolve(result);
                }
            });
        });
    }

    // Log in a user
    async login({ email, password }) {
        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool,
        });

        return new Promise((resolve, reject) => {
            user.authenticateUser(authDetails, {
                onSuccess: (session) => {
                    resolve({
                        idToken: session.getIdToken().getJwtToken(),
                        accessToken: session.getAccessToken().getJwtToken(),
                        refreshToken: session.getRefreshToken().getToken(),
                        email: session.getIdToken().payload.email
                    });
                },
                onFailure: (err) => reject(err),
            });
        });
    }

    // Get the current authenticated user
    async getCurrentUser() {
        const user = this.userPool.getCurrentUser();

        if (!user) {
            return null;
        }

        return new Promise((resolve, reject) => {
            user.getSession((err, session) => {
                if (err || !session.isValid()) {
                    reject(err || new Error("Session is invalid"));
                } else {
                    resolve({
                        username: user.getUsername(),
                        idToken: session.getIdToken().getJwtToken(),
                        accessToken: session.getAccessToken().getJwtToken(),
                        refreshToken: session.getRefreshToken().getToken(),
                        email: session.getIdToken().payload.email
                    });
                }
            });
        });
    }

    // Log out the current user
    async logout() {
        const user = this.userPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
    }

    // Fetch user details by ID (requires admin credentials or specific APIs)
    async fetchUserById(userId) {
        // Cognito doesn't allow fetching user data by ID directly from the client-side.
        // This needs to be implemented server-side using AWS SDK or via an API Gateway.
        throw new Error("fetchUserById requires server-side implementation.");
    }

    // Update user attributes (like name and email)
    async updateUserData(newEmail, newName, password, dispatch) {
        const user = this.userPool.getCurrentUser();
        if (!user) {
            throw new Error("User is not authenticated");
        }

        return new Promise((resolve, reject) => {
            user.getSession((err, session) => {
                if (err || !session.isValid()) {
                    reject(err || new Error("Session is invalid"));
                    return;
                }

                const attributes = [];
                if (newEmail) {
                    attributes.push({ Name: "email", Value: newEmail });
                }
                if (newName) {
                    attributes.push({ Name: "name", Value: newName });
                }

                user.updateAttributes(attributes, (attrErr, result) => {
                    if (attrErr) {
                        reject(attrErr);
                    } else {
                        // Dispatch updated data to Redux
                        this.getCurrentUser().then((updatedUser) => {
                            dispatch(setUserData(updatedUser));
                            resolve({ message: "User data updated successfully!" });
                        });
                    }
                });
            });
        });
    }
}

// Initialize the AuthService instance
const awsAuthService = new AWSAuthService();

export default awsAuthService;
