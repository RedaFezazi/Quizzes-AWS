const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const middy = require("@middy/core");
const jwtMiddleware = require("../../middleware/jwtMiddleware.js");

const client = new DynamoDBClient({ region: "eu-north-1" });

const getQuiz = async (event) => {
  const { quizId, email } = JSON.parse(event.body); // Get quizId and email from request body

  // Define parameters to fetch the quiz
  const params = {
    TableName: process.env.QUIZZES_TABLE,
    Key: { quizId },
  };

  try {
    const result = await client.send(new GetCommand(params));
    const quiz = result.Item;

    // Check if the quiz exists
    if (!quiz) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Quiz not found" }),
      };
    }

    // Verify if the owner's email matches
    if (quiz.email !== email) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message:
            "Unauthorized: This quiz does not belong to the specified owner",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        quiz: quiz,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving quiz",
        error: err.message,
      }),
    };
  }
};

exports.handler = middy(getQuiz).use(jwtMiddleware());
