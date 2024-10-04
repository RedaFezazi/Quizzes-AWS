const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const middy = require("@middy/core");
const jwtMiddleware = require("../../middleware/jwtMiddleware.js");

const client = new DynamoDBClient({ region: "eu-north-1" });

const createQuiz = async (event, context) => {
  const body = JSON.parse(event.body);
  const { title, questions } = body;
  const userEmail = context.user.email;

  const params = {
    TableName: process.env.QUIZZES_TABLE,
    Item: {
      quizId: uuidv4(),
      email: userEmail,
      quizTitle: title,
      questions: questions,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await client.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Quiz created",
        quizId: params.Item.quizId,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating quiz",
        error: err.message,
      }),
    };
  }
};

exports.handler = middy(createQuiz).use(jwtMiddleware());
