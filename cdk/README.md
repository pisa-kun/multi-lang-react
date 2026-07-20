# AWS CDK deployment for multi-lang-sample

This CDK app creates:
- ECR repository for the frontend container image
- App Runner service using that ECR image
- IAM role for App Runner build access
- IAM role for App Runner instance execution

## Deploy

1. Install dependencies
   ```bash
   cd cdk
   npm install
   ```
2. Build the CDK app
   ```bash
   npx tsc
   ```
3. Deploy
   ```bash
   npx cdk deploy --require-approval never
   ```

## Notes

Before deploying, build and push your app container image to ECR.
The App Runner service is configured for `latest` image auto-deploy.

If you want, you can deploy the CDK stack first to create the ECR repository and IAM roles, then push the Docker image after the repository exists.
