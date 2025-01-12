import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

export function data(scope: Construct) {
    const lambdaFunction = new lambda.Function(scope, 'RiskAnalysisLambda', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset('lambda'),
        timeout: cdk.Duration.seconds(60),
    });

    const api = new apiGateway.RestApi(scope, 'ChurchRiskApi', {
        restApiName: 'Church Risk Management API',
    });

    api.root.addMethod('POST', new apiGateway.LambdaIntegration(lambdaFunction));

    return {
        api,
    };
}
