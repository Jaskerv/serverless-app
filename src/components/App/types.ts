import { CognitoUser } from 'amazon-cognito-identity-js';

export interface User {
  cognitoUser: CognitoUser;
  name: string;
}
