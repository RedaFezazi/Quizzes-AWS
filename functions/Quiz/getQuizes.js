const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const middy = require("@middy/core");

const client = new DynamoDBClient({ region: "eu-north-1" });

const getAllQuizzes = async (event) => {
  try {
    const params = {
      TableName: process.env.QUIZZES_TABLE,
    };

    const result = await client.send(new ScanCommand(params));
    const quizzes = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        quizzes: quizzes,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving quizzes",
        error: err.message,
      }),
    };
  }
};

exports.handler = middy(getAllQuizzes);
