import { withLambda } from '@netlify/aws-lambda-compat';
import { netlifyHandler } from '../../backend/netlify-dist/serverless-handler';

export default withLambda(netlifyHandler);
