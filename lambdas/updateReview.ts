import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

const ajv = new Ajv();
const isValidUpdate = ajv.compile({
  type: "object",
  additionalProperties: false,
  properties: {
    ReviewDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    Content: { type: "string" },
    ReviewerId: { type: "string", format: "email" }
  },
  required: ["ReviewDate", "Content", "ReviewerId"]
});

const ddbDocClient = createDdbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const movieId = event.pathParameters?.movieId;
    const reviewIdPath = event.pathParameters?.reviewId;
    const body = event.body ? JSON.parse(event.body) : undefined;

    if (!movieId || !reviewIdPath) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Missing path parameters" }),
      };
    }

    if (!body || !isValidUpdate(body)) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "Invalid input. Must match update schema.",
          errors: isValidUpdate.errors,
        }),
      };
    }

    await ddbDocClient.send(
      new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          movieId: Number(movieId),
          reviewId: Number(reviewIdPath),
        },
        UpdateExpression: "SET ReviewDate = :date, Content = :content, ReviewerId = :reviewer",
        ExpressionAttributeValues: {
          ":date": body.ReviewDate,
          ":content": body.Content,
          ":reviewer": body.ReviewerId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Review updated successfully" }),
    };
  } catch (error: any) {
    console.error("Update error:", error.message);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDdbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: { wrapNumbers: false },
  });
}
