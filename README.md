# Node.js Password Reset Project with MongoDB

This project is a simple Node.js application that allows users to reset their passwords using a token-based approach. It uses MongoDB to store user data and tokens.

## Features

- User registration with email verification.
- Password reset functionality using tokens sent via email.
- MongoDB database integration for storing user data and tokens.
- Express.js for handling HTTP requests.
- JSON Web Tokens (JWT) for user authentication and authorization.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js and npm (Node Package Manager)
- MongoDB (make sure MongoDB is running locally or accessible)
- SMTP server for sending emails (e.g., Gmail SMTP)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
Usage
Register a new user account.
Verify your email address.
Forgot your password? Use the "Forgot Password" link to reset it.
Enter your email

for a password reset email containing a unique token.

Click on the password reset link in the email.
Enter a new password and submit the form.
Log in with your new password.
