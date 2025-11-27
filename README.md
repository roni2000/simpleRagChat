# simpleRagChat - Authenticated Chat Application

This is a simple Node.js application that demonstrates user authentication using Google OAuth and a chat interface that communicates with an external API.

## Features

*   **User Authentication**: Users can log in using their Google account. The application uses Passport.js with the `passport-google-oauth20` strategy.
*   **Protected Routes**: The main chat interface is only accessible to authenticated users.
*   **Chat Interface**: A simple, floating chat widget on the main page.
*   **API Proxy**: The chat interface communicates with a backend proxy, which in turn communicates with an external chat/bot API.
*   **Containerization**: The application includes a `Dockerfile` for easy containerization and deployment.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd simpleRagChat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add the following environment variables:
    ```
    # Application Port
    CHAT_APP_PORT=3001

    # Session Secret
    SESSION_SECRET=your-very-secret-key

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

    # External API Credentials and URL
    EXTERNAL_API_URL=your-external-api-url
    API_USER=your-api-user
    API_PASSWORD=your-api-password
    ```

4.  **Run the application:**
    *   For development (with auto-restarting):
        ```bash
        npm run dev
        ```
    *   For production:
        ```bash
        npm start
        ```

    The application will be running at `http://localhost:3001`.

## Usage

1.  Navigate to `http://localhost:3001`.
2.  You will be redirected to the login page.
3.  Click the "Login with Google" button to authenticate.
4.  After successful authentication, you will be redirected to the main page.
5.  Click on the chat icon in the bottom right corner to open the chat window.
6.  You can now send messages to the chat bot.

## API Endpoints

*   `GET /login`: The login page.
*   `GET /auth/google`: Initiates the Google OAuth authentication flow.
*   `GET /auth/google/callback`: The callback URL for Google OAuth.
*   `GET /logout`: Logs the user out.
*   `GET /api/user`: Returns information about the currently logged-in user.
*   `POST /api/chat-proxy`: The proxy endpoint for the chat functionality.

## Containerization

The application can be containerized using the provided `Dockerfile`.

*   **Build the Docker image:**
    ```bash
    ./build_image.sh
    ```
*   The `prep_image_to_nas.sh` script is an example of how you might push the image to a private registry. You will need to modify it for your own needs.
