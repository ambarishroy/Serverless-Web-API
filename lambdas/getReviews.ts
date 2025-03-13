import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDdbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("Event: ", JSON.stringify(event));

    const movieId = event.pathParameters?.movieId;
    const queryParams = event.queryStringParameters || {};
    const { reviewId, ReviewerId } = queryParams;

    if (!movieId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Missing path parameter: movieId" }),
      };
    }

    const commandOutput = await ddbDocClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "movieId = :movieId",
        ExpressionAttributeValues: {
          ":movieId": Number(movieId),
        },
      })
    );

    let reviews = commandOutput.Items || [];

    if (reviewId) {
      reviews = reviews.filter((review) => review.reviewId === Number(reviewId));
    }

    if (ReviewerId) {
      reviews = reviews.filter((review) => review.ReviewerId === ReviewerId);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: reviews }),
    };
  } catch (error: any) {
    console.error("Error fetching reviews:", error.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDdbDocClient() {
  const client = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });
}
