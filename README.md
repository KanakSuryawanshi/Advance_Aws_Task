# Advanced AWS Document Management System

# project Overview
This project is a Node.js based document management system where users can upload documents documents. The uploaded documents are stored in Amazon S3, document details are stored in MySQL, and AWS services are used for notifications, logging, monitoring, and metrics.

The application is deployed on an Amazon EC2 instance and runs using PM2.

# AWS Services Used
Amazon EC2 – Hosts and runs the Node.js application.
Amazon S3 – Stores uploaded documents.
Amazon SNS – Sends document upload notifications.
Amazon CloudWatch Logs – Stores application logs.
Amazon CloudWatch Metrics – Stores application metrics.
Amazon CloudWatch Alarm – Monitors document upload failures.
IAM – Provides permissions to access AWS services.
Application Load Balancer – Receives requests and forwards them to the EC2 application.
MySQL – Stores users and document information.

# Task Flow
When a user uploads a document, the application stores the document in Amazon S3 and stores its information in MySQL. After a successful upload, an SNS notification is sent and application activities are recorded in CloudWatch Logs and Metrics.

# Main Features

-Document upload using Node.js and Express.
-File storage using Amazon S3.
-Document details stored in MySQL.
-SNS notification after successful document upload.
-Application logging using CloudWatch Logs.
-Application metrics using CloudWatch.
-CloudWatch alarm for monitoring document upload failures.
-Application deployment on Amazon EC2.
-PM2 used to keep the Node.js application running.
-Application Load Balancer used to access the application.
-k6 used for load testing.

# Project Structure
The project code is inside the src folder.

config – AWS and database configuration
controllers – API logic
middleware – File upload validation
routes – API routes
services – AWS service related code
utils – Utility and testing files
index.js – Main server file

Other files like package.json manage dependencies, while .gitignore prevents sensitive files like .env from being pushed to GitHub.

# Installation & Run

First install the project dependencies:
npm install
Then start the application
node index.js
The application runs on port 5500

# Environment Variables

Create a .env file and add the required database and AWS configuration.

Required variables:
PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
AWS_REGION
AWS_BUCKET
SNS_TOPICARN
CLOUDWATCH_LOGGROUP
CLOUDWATCH_LOGSTREAM

# API Endpoints
Authentication
POST /auth/register – Register a new user
POST /auth/login – Login user
Users
GET /users – Get users
POST /users – Create a user
Documents
POST /documents/upload – Upload a document
GET /documents – Get user documents
GET /documents/:id – Get a document by ID
DELETE /documents/:id – Delete a document
GET /documents/:id/download – Download a document
Health Check
GET /health – Check application health
GET /ready – Check application readiness

# Testing

The APIs were tested using Postman and the health endpoints were checked using the browserr.
Load testing was performed using k6.

-k6 run loadTest.js