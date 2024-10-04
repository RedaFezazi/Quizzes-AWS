const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const middy = require("@middy/core");
const jwtMiddleware = require("../../middleware/jwtMiddleware.js");

const client = new DynamoDBClient({ region: "eu-north-1" });

const addQuestion = async (event, context) => {
  const body = JSON.parse(event.body);
  const { quizId, newQuestion } = body;
  const userEmail = context.user.email;

  // Fetch the quiz from DynamoDB to ensure it exists and check ownership
  const params = {
    TableName: process.env.QUIZZES_TABLE,
    Key: { quizId },
  };

  try {
    const result = await client.send(new GetCommand(params));
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Quiz not found" }),
      };
    }

    // Check if the user is the owner of the quiz
    if (result.Item.email !== userEmail) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Unauthorized: You do not own this quiz",
        }),
      };
    }

    // Add the new question to the existing questions array
    const updatedQuestions = [...result.Item.questions, newQuestion];

    const updateParams = {
      TableName: process.env.QUIZZES_TABLE,
      Key: { quizId },
      UpdateExpression: "set questions = :questions",
      ExpressionAttributeValues: {
        ":questions": updatedQuestions,
      },
    };

    await client.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Question added successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error adding question",
        error: err.message,
      }),
    };
  }
};

exports.handler = middy(addQuestion).use(jwtMiddleware());
