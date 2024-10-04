const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const middy = require("@middy/core");
const jwtMiddleware = require("../../middleware/jwtMiddleware.js");

const client = new DynamoDBClient({ region: "eu-north-1" });

const deleteQuiz = async (event) => {
  const { quizId } = JSON.parse(event.body); // Get quizId from request body

  // Define parameters to check if the quiz exists
  const getParams = {
    TableName: process.env.QUIZZES_TABLE,
    Key: { quizId },
  };

  try {
    // Check if the quiz exists
    const getResult = await client.send(new GetCommand(getParams));
    const quiz = getResult.Item;

    // If the quiz does not exist
    if (!quiz) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Quiz not found" }),
      };
    }

    // Proceed to delete the quiz
    await client.send(new DeleteCommand(getParams));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Quiz deleted successfully",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting quiz",
        error: err.message,
      }),
    };
  }
};

// Export the handler with JWT middleware
exports.handler = middy(deleteQuiz).use(jwtMiddleware());
