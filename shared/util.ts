import { marshall } from "@aws-sdk/util-dynamodb";
import { Movie, MovieCast, Review } from "./types";

type Entity = Movie | MovieCast | Review;  
export const generateItem = (entity: Entity) => {
  return {
    PutRequest: {
      Item: marshall(entity),
    },
  };
};

export const generateBatch = (data: Entity[]) => {
  return data.map((e) => {
    return generateItem(e);
  });
};
