# OAuth and OIDC Demo Application

This is a demo application designed to support a presentation on **OAuth 2.0** and **OpenID Connect (OIDC)**. It implements the **Authorization Code Flow** with both **front-channel** and **back-channel** communications, showcasing the way modern applications handle user authentication and authorization using third-party identity providers.

## Purpose

The goal of this application is to provide a practical example of implementing OAuth 2.0 and OIDC concepts for:

1. **Authentication** - Proving the identity of a user.
2. **Authorization** - Allowing controlled access to resources on behalf of users.

This demo is ideal for explaining how secure flows are designed and executed while leveraging OAuth 2.0 and OIDC standards.

---

## Features

- **Authorization Code Flow**:
   - Demonstrates both the **front-channel** (browser-to-identity-provider communication) and **back-channel** (server-to-server communication).
- OAuth and OIDC flows with detailed logging for showcasing token requests and exchanges.
- Integration with third-party Identity Providers (e.g., Google, Auth0, or Okta).
- Demonstrates secure storage and usage of access tokens and ID tokens.
- Client-side (frontend) and server-side (backend) examples included.

---

## Technologies Used

- **Frontend**: Vue.js 3.5.13
- **Backend**: Express.js 4.21.2
- **Build Tools**: Vite 6.2.1 with Vue DevTools
- **HTTP Communication**: Axios 1.8.4
- **Package Manager**: npm

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js (version 16 or higher).
2. **npm**: Install Node.js which includes the npm package manager.
3. **Identity Provider Credentials**:
   - Register your application with an Identity Provider (e.g., Google, Auth0, or Okta) to obtain:
      - **Client ID**
      - **Client Secret**
      - **Redirect URI**

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:
```env
CLIENT_ID=<Your_OAuth_Client_ID>
CLIENT_SECRET=<Your_OAuth_Client_Secret>
REDIRECT_URI=http://localhost:3000/callback
PROVIDER_DISCOVERY_URL=<Provider_Discovery_Endpoint>
```

- Replace `<Your_OAuth_Client_ID>` and `<Your_OAuth_Client_Secret>` with the values from your Identity Provider.
- Set `<Provider_Discovery_Endpoint>` with the Issuer URL (e.g., `https://accounts.google.com/.well-known/openid-configuration`).

### 4. Start the Development Server

#### Backend:
```bash
npm run server
```

#### Frontend:
```bash
npm run dev
```

This will start the backend server on `http://localhost:3000` and the frontend application on `http://localhost:5173`.

---

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Click on **Login** to start the OAuth 2.0 Authorization Code Flow.
3. Authenticate with the identity provider's authorization page.
4. Observe the exchange of authorization code for access tokens in the backend.
5. After successful login, explore the user profile fetched via OIDC.

---

## Explanation of Authorization Code Flow

1. **Authorization Request**:
   - The browser (front-channel) redirects the user to the Authorization Server for authentication using the Client ID and Redirect URI.
2. **Authorization Response**:
   - After the user authenticates, the Authorization Server redirects the user back to the application along with an **authorization code**.
3. **Token Exchange**:
   - The backend (back-channel) exchanges the authorization code for an **access token** using the Client Secret.
4. **Token Usage**:
   - The access token is used to fetch user data from protected APIs.