import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class Data extends Construct {
    public readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Lambda function for risk analysis
        const riskAnalysisLambda = new lambda.Function(this, 'RiskAnalysisLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'bedrock.handler',
            code: lambda.Code.fromAsset('amplify/data'), 
            environment: {
                ANALYSIS_MODEL: 'anthropic.claude-3-sonnet-20240229-v1:0'
            }
        });

        // API Gateway integration
        this.api = new apigateway.RestApi(this, 'ChurchRiskApi', {
            restApiName: 'ChurchRiskManagementAPI',
        });

        const riskResource = this.api.root.addResource('analyze');
        riskResource.addMethod('POST', new apigateway.LambdaIntegration(riskAnalysisLambda));
    }
}
