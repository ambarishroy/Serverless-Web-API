#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthAppStack } from "../lib/rest-api-stack";


const app = new cdk.App();
new AuthAppStack(app, "RestAPIStack", { env: { region: "eu-west-1" } });
