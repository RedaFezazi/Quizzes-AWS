const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const JWT_SECRET = process.env.JWT_SECRET;
const USER_TABLE = process.env.USER_TABLE;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

async function login(event) {
  const { email, password } = JSON.parse(event.body);

  // Get user from DynamoDB
  const user = await ddbClient.send(
    new GetCommand({
      TableName: USER_TABLE,
      Key: { email: email.trim() },
    })
  );

  if (!user.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid email or password" }),
    };
  }

  // Compare password
  const validPassword = await bcrypt.compare(password, user.Item.password);
  if (!validPassword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid email or password" }),
    };
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.Item.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
}

module.exports = {
  main: middy(login),
};
