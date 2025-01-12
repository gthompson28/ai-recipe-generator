import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export function auth(scope: Construct) {
    const userPool = new cognito.UserPool(scope, 'UserPool', {
        selfSignUpEnabled: true,
        userVerification: {
            emailSubject: 'Verify your email for our app!',
            emailBody: 'Thanks for signing up! Your verification code is {####}',
            emailStyle: cognito.VerificationEmailStyle.CODE,
        },
        signInAliases: { email: true },
    });

    return {
        userPool,
    };
}
