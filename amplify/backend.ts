import * as cdk from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Construct } from 'constructs';

export class Backend extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const authResource = auth(this);
        const dataResource = data(this);
    }
}
