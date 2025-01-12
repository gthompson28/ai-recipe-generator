import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Data } from './data/resource'; 
import { Auth } from './auth/resource';

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Initialize the data and authentication resources
        const data = new Data(this, 'Data');
        const auth = new Auth(this, 'Auth');

        // Ensure API Gateway and Lambda integration
        new cdk.CfnOutput(this, 'APIEndpoint', {
            value: data.api.url ?? 'API URL Not Found'
        });
    }
}
