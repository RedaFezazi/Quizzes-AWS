# Quiz App

## Overview
The **Quiz App** is a serverless application built using AWS Lambda, API Gateway, DynamoDB, and JSON Web Token (JWT) for authentication. The app allows users to create, manage, and participate in quizzes through various endpoints.

## Features
- **User Authentication**: Secure signup and login using JWT. Users can create profiles, log in, and receive tokens for authenticated actions.
- **Create Quizzes**: Users can create quizzes by providing a title and a set of questions.
- **Retrieve Quizzes**: Users can view specific quizzes using their `quizId` or retrieve a list of all available quizzes.
- **Add Questions**: Users can add new questions to existing quizzes.
- **Delete Quizzes**: Users can delete a quiz they own by providing the `quizId`.

## API Endpoints
- **/signup**: Create a user profile.
- **/login**: Authenticate a user and return a JWT token.
- **/quizzes/create**: Create a new quiz.
- **/quizzes/get-quiz**: Retrieve a specific quiz by its ID.
- **/quizzes/get-quizes**: Retrieve all available quizzes.
- **/quizzes/add-question**: Add a question to a specific quiz.
- **/quizzes/delete-quiz**: Delete a quiz by its ID.

## Tech Stack
- **AWS Lambda**: To handle the backend logic for all API endpoints.
- **API Gateway**: To route and manage the HTTP requests.
- **DynamoDB**: To store user and quiz data.
- **Middy**: Middleware for handling JWT validation.
- **Serverless Framework**: To deploy the application as a fully serverless stack.
- **Postman**: Used for testing the API endpoints.

## Installation and Deployment
To deploy the app, use the Serverless Framework with the necessary AWS credentials configured. The API endpoints are secured, requiring JWT authentication for certain operations.

