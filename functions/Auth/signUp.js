const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const middy = require("@middy/core");

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const USER_TABLE = process.env.USER_TABLE;

async function signUp(event) {
  try {
    // Parse the body directly, assuming it's JSON
    const { email, password } = JSON.parse(event.body);

    // Check if the user already exists
    const userExists = await ddbClient.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: { email },
      })
    );

    if (userExists.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User already exists" }),
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DynamoDB
    const params = {
      TableName: USER_TABLE,
      Item: {
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      },
    };

    await ddbClient.send(new PutCommand(params));

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

module.exports = {
  main: middy(signUp),
};
