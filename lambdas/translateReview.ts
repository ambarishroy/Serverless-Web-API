import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.REGION }));
const translate = new TranslateClient({ region: process.env.REGION });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const reviewId = event.pathParameters?.reviewId;
    const movieId = event.pathParameters?.movieId;
    const languageCode = event.queryStringParameters?.language;

    if (!reviewId || !movieId || !languageCode) {
      return response(400, { message: "Missing path or query parameters." });
    }

    const data = await ddb.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          movieId: Number(movieId),
          reviewId: Number(reviewId),
        },
      })
    );

    if (!data.Item) {
      return response(404, { message: "Review not found." });
    }

    const translateCommand = new TranslateTextCommand({
      SourceLanguageCode: "en",
      TargetLanguageCode: languageCode,
      Text: data.Item.Content,
    });

    const translated = await translate.send(translateCommand);

    return response(200, {
      translatedText: translated.TranslatedText,
      originalText: data.Item.Content,
      languageCode,
    });
  } catch (error: any) {
    console.error("Translate error:", error.message);
    return response(500, { error: error.message });
  }
};

function response(statusCode: number, body: any) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
