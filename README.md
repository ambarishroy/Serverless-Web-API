## Enterprise Web Development module - Serverless REST Assignment.

__Name:__ Ambarish Roy

__Demo:__ https://www.youtube.com/watch?v=42A9sjITjoE

### Overview.

The repository contains a project that demonstrates serverless web API for managing movie reviews using aws cdk. API gateway is used for exposing the API endpoints, lambda functions for logic and dynamodb for storing the data. It also has IAM based access control where a registered user can post and update their reviews. The API is capable of posting, updating, translating and fetching the reviews by movieId.

### App API endpoints.

     • GET- 
     https://ch6jkxytkd.execute-api.eu-west-1.amazonaws.com/dev/movies/reviews/848326

     • GET with optional query string

     https://ch6jkxytkd.execute-api.eu-west-1.amazonaws.com/dev/movies/reviews/848326?ReviewerId=ambarishroy1996@gmail.com&reviewId=1742558239507

     • POST-
     https://ch6jkxytkd.execute-api.eu-west-1.amazonaws.com/dev/movies/reviews


      {
                 "movieId": 848326,
                 "ReviewerId": "ambarishroy1996@gmail.com",
                 "Content": "A very nice movie",
                 "ReviewDate": "2025-03-21"
     }

     • PUT- 
     https://ch6jkxytkd.execute-api.eu-west-1.amazonaws.com/dev/movies/848326/reviews/1742390340537

     {
       "Content": "Just updated this review via Postman2!"
     }

     • GET call for translation-
     https://ch6jkxytkd.execute-api.eu-west-1.amazonaws.com/dev/reviews/1002/848326/translation?language=fr


### Features.
1. The API can translate any review
2. Additional query parameters can be used for fetching a review
3. Unauthorized users cannot post or update a review
4. API validators are in place that will throw error and the reason for cause when improper url or json schema is used

#### Custom L2 Construct (if completed)

The app-api has 3 tables- Movies, MovieCast and MovieReviews. It has multiple lambda functions for getting, creating and updating movie reviews. The auth API has a base path /auth for sign-up, sign-in, confirm sign-up, and sign-out functionalities. Cognito integration is done via userPoolId and userPoolClientId.

Construct Input props object:
~~~
type AuthApiProps = {
  userPoolId: string;
  userPoolClientId: string;
};
type AppApiProps = {
  userPoolId: string;
  userPoolClientId: string;
};
~~~
Construct public properties
~~~
export class AuthApi extends Construct {
  private auth: apig.IResource;
  private userPoolId: string;
  private userPoolClientId: string;
export class AuthApi extends Construct {
  private auth: apig.IResource;
  private userPoolId: string;
  private userPoolClientId: string;
~~~


#### Restricted review updates (if completed)

Reviews can only be posted and updated by authorized user. The user must be signedup first and later on signed in to perform these actions. Cookies are used at the time of signin which is user-specific. If any other user tries to update a review, he will be greeted with unauthorized error.


#### API Gateway validators. (if completed)

The api has validations. They are as follows:
getReviews.ts-->
~~~
 if (!movieId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Missing path parameter: movieId" }),
      };
    }
~~~
postReview.ts-->
~~~
 if (!cookies) {
      return {
        statusCode: 200,
        body: "Unauthorised request!!",
      };
    }
 if (!body) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

if (!isValidReview(body)) {
      return {
        statusCode: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: "Invalid review. Must match Review schema.",
          errors: isValidReview.errors,
        }),
      };
    }
~~~
translateReview.ts-->
~~~
if (!reviewId || !movieId || !languageCode) {
      return response(400, { message: "Missing path or query parameters." });
    }
~~~
updateReview.ts-->
~~~
if (!movieId || !reviewId) {
      return response(400, { message: "Missing path parameters" });
    }

if (!body || !isValidUpdate(body)) {
      return response(400, {
        message: "Invalid input. Only 'Content' is updatable.",
        errors: isValidUpdate.errors,
      });
    }
~~~


