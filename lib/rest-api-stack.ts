import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { generateBatch } from "../shared/util";
import { movies, movieCasts, movieReviews } from "../seed/movies";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";


export class RestAPIStack extends cdk.Stack {
  private auth: apig.IResource;
  private userPoolId: string;
  private userPoolClientId: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tables 
    const moviesTable = new dynamodb.Table(this, "MoviesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Movies",
    });
    const movieCastsTable = new dynamodb.Table(this, "MovieCastTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "actorName", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieCast",
    });
    const movieReviewsTable = new dynamodb.Table(this, "MovieReviewsTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "reviewId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieReviews",
    });

    movieCastsTable.addLocalSecondaryIndex({
      indexName: "roleIx",
      sortKey: { name: "roleName", type: dynamodb.AttributeType.STRING },
    });
    //authentications
    const userPool = new UserPool(this, "UserPool", {
      signInAliases: { username: true, email: true },
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userPoolId = userPool.userPoolId;

    const appClient = userPool.addClient("AppClient", {
      authFlows: { userPassword: true },
    });

    this.userPoolClientId = appClient.userPoolClientId;

    const authApi = new apig.RestApi(this, "AuthServiceApi", {
      description: "Authentication Service RestApi",
      endpointTypes: [apig.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowOrigins: apig.Cors.ALL_ORIGINS,
      },
    });

    this.auth = authApi.root.addResource("auth");

    
    // Functions 
    const getMovieByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetMovieByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/getMovieById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: moviesTable.tableName,
          REGION: 'eu-west-1',
        },
      }
      );
      
      const getAllMoviesFn = new lambdanode.NodejsFunction(
        this,
        "GetAllMoviesFn",
        {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_18_X,
          entry: `${__dirname}/../lambdas/getAllMovies.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: 'eu-west-1',
          },
        }
        );

        const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_22_X,
          entry: `${__dirname}/../lambdas/addMovie.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: "eu-west-1",
          },
        });

      const getMovieCastMembersFn = new lambdanode.NodejsFunction(
      this,
      "GetCastMemberFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: `${__dirname}/../lambdas/getMovieCastMember.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: movieCastsTable.tableName,
          REGION: "eu-west-1",
        },
      }
    );
    //Reviews functions
    const getReviewsFn = new lambdanode.NodejsFunction
    (this, "GetReviewsFn", 
    {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/getReviews.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });

    const postReviewFn = new lambdanode.NodejsFunction(this, "PostReviewFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/postReview.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });
    
    const updateReviewFn = new lambdanode.NodejsFunction(this, "UpdateReviewFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/updateReview.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });
    const translateReviewFn = new lambdanode.NodejsFunction(this, "TranslateReviewFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      entry: `${__dirname}/../lambdas/translateReview.ts`,
      environment: {
        TABLE_NAME: movieReviewsTable.tableName,
        REGION: "eu-west-1",
      },
      timeout: cdk.Duration.seconds(10),
    });
        
        new custom.AwsCustomResource(this, "moviesddbInitData", {
          onCreate: {
            service: "DynamoDB",
            action: "batchWriteItem",
            parameters: {
              RequestItems: {
                [moviesTable.tableName]: generateBatch(movies),
                [movieCastsTable.tableName]: generateBatch(movieCasts),
                [movieReviewsTable.tableName]: generateBatch(movieReviews),  
              },
            },
            physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"),
          },
          policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
            resources: [moviesTable.tableArn, movieCastsTable.tableArn,  movieReviewsTable.tableArn], //Added policy for reviews table
          }),
        });
        console.log("Seeding Reviews:", generateBatch(movieReviews).length);
        console.log("Review seed preview:", movieReviews);

        
        // Permissions 
        moviesTable.grantReadData(getMovieByIdFn)
        moviesTable.grantReadData(getAllMoviesFn)
        moviesTable.grantReadWriteData(newMovieFn)
        movieCastsTable.grantReadData(getMovieCastMembersFn);

        //Reviews Premissions
        movieReviewsTable.grantReadWriteData(getReviewsFn);
        movieReviewsTable.grantReadWriteData(postReviewFn);
        movieReviewsTable.grantReadWriteData(updateReviewFn);
        movieReviewsTable.grantReadData(translateReviewFn);
        translateReviewFn.addToRolePolicy(
          new cdk.aws_iam.PolicyStatement({
            actions: ["translate:TranslateText"],
            resources: ["*"],
          })
        );
        
        //REST api
        const api = new apig.RestApi(this, "RestAPI", {
          description: "demo api",
          deployOptions: {
            stageName: "dev",
          },
          defaultCorsPreflightOptions: {
            allowHeaders: ["Content-Type", "X-Amz-Date"],
            allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
            allowCredentials: true,
            allowOrigins: ["*"],
          },
        });
    
        // Movies endpoint
        const moviesEndpoint = api.root.addResource("movies");
        moviesEndpoint.addMethod(
          "GET",
          new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
        );
        // Detail movie endpoint
        const specificMovieEndpoint = moviesEndpoint.addResource("{movieId}");
        specificMovieEndpoint.addMethod(
          "GET",
          new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
        );
        moviesEndpoint.addMethod(
          "POST",
          new apig.LambdaIntegration(newMovieFn, { proxy: true })
        );
        const movieCastEndpoint = moviesEndpoint.addResource("cast");

        movieCastEndpoint.addMethod(
            "GET",
            new apig.LambdaIntegration(getMovieCastMembersFn, { proxy: true })
        );
        //Reviews endpoints
        const movieReviewsEndpoint = moviesEndpoint.addResource("reviews");
        //GET
        const reviewsByMovieId = movieReviewsEndpoint.addResource("{movieId}");
        reviewsByMovieId.addMethod("GET", new apig.LambdaIntegration(getReviewsFn, { proxy: true }));
        //POST
        movieReviewsEndpoint.addMethod("POST", new apig.LambdaIntegration(postReviewFn, { proxy: true }));
        //PUT      
        const reviewsPath = specificMovieEndpoint.addResource("reviews");
        const reviewIdPath = reviewsPath.addResource("{reviewId}");
        reviewIdPath.addMethod("PUT", new apig.LambdaIntegration(updateReviewFn));
        //GET review translation
        const reviewsRoot = api.root.addResource("reviews");
        const reviewPath = reviewsRoot.addResource("{reviewId}");
        const moviePath = reviewPath.addResource("{movieId}");
        const translationPath = moviePath.addResource("translation");
        translationPath.addMethod("GET", new apig.LambdaIntegration(translateReviewFn));
      }
      private addAuthRoute(
        resourceName: string,
        method: string,
        fnName: string,
        fnEntry: string,
        allowCognitoAccess?: boolean
      ): void {
        const commonFnProps = {
          architecture: lambda.Architecture.ARM_64,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          runtime: lambda.Runtime.NODEJS_22_X,
          handler: "handler",
          environment: {
            USER_POOL_ID: this.userPoolId,
            CLIENT_ID: this.userPoolClientId,
            REGION: cdk.Aws.REGION
          },
        };
        
        const resource = this.auth.addResource(resourceName);
        
        const fn = new lambdanode.NodejsFunction(this, fnName, {
          ...commonFnProps,
          entry: `${__dirname}/../lambda/auth/${fnEntry}`,
        });
    
        resource.addMethod(method, new apig.LambdaIntegration(fn));
      }  // end private method
    // end class
    }
    