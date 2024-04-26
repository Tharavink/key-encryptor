# Key Encryptor (NodeJS)
This project does the following
- Extract certificate based on *s3-key* value provided from the event invocation
- Extract CommonName(CN) from the certificate
- Extract public key from the certificate
- Then, sign the public key with a newly generated private key
- Save the CommonName and signed content to DynamoDB

# Prerequisite
---
### Using LocalStack (Preferred)
##### Installation
- You need to have Docker installed. The easiest method to install Docker is by using [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [LocalStack CLI](https://docs.localstack.cloud/getting-started/installation/)
- Install [LocalStack AWS CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal)
  ```bash
    pip install awscli-local
  ```
- Optionally, you can download [LocalStack Desktop](https://app.localstack.cloud/download)

##### Running LocalStack
Start LocalStack
```bash
localstack start
```
Optionally, you can open LocalStack Desktop to view the resources

### Using AWS (Impacts costing)
- You need have an AWS account
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) need to be configured with profile with atleast the following permissions
  ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "CloudFormationTemplate",
                "Effect": "Allow",
                "Action": [
                    "cloudformation:CreateChangeSet"
                ],
                "Resource": [
                    "arn:aws:cloudformation:*:aws:transform/Serverless-2016-10-31"
                ]
            },
            {
                "Sid": "CloudFormationStack",
                "Effect": "Allow",
                "Action": [
                    "cloudformation:CreateChangeSet",
                    "cloudformation:CreateStack",
                    "cloudformation:DeleteStack",
                    "cloudformation:DescribeChangeSet",
                    "cloudformation:DescribeStackEvents",
                    "cloudformation:DescribeStacks",
                    "cloudformation:ExecuteChangeSet",
                    "cloudformation:GetTemplateSummary",
                    "cloudformation:ListStackResources",
                    "cloudformation:UpdateStack"
                ],
                "Resource": [
                    "arn:aws:cloudformation:*:111122223333:stack/*"
                ]
            },
            {
                "Sid": "S3",
                "Effect": "Allow",
                "Action": [
                    "s3:CreateBucket",
                    "s3:GetObject",
                    "s3:PutObject"
                ],
                "Resource": [
                    "arn:aws:s3:::*/*"
                ]
            },
            {
                "Sid": "Lambda",
                "Effect": "Allow",
                "Action": [
                    "lambda:AddPermission",
                    "lambda:CreateFunction",
                    "lambda:DeleteFunction",
                    "lambda:GetFunction",
                    "lambda:GetFunctionConfiguration",
                    "lambda:ListTags",
                    "lambda:RemovePermission",
                    "lambda:TagResource",
                    "lambda:UntagResource",
                    "lambda:UpdateFunctionCode",
                    "lambda:UpdateFunctionConfiguration"
                ],
                "Resource": [
                    "arn:aws:lambda:*:111122223333:function:*"
                ]
            },
            {
                "Sid": "IAM",
                "Effect": "Allow",
                "Action": [
                    "iam:CreateRole",
                    "iam:AttachRolePolicy",
                    "iam:DeleteRole",
                    "iam:DetachRolePolicy",
                    "iam:GetRole",
                    "iam:TagRole"
                ],
                "Resource": [
                    "arn:aws:iam::111122223333:role/*"
                ]
            },
            {
                "Sid": "IAMPassRole",
                "Effect": "Allow",
                "Action": "iam:PassRole",
                "Resource": "*",
                "Condition": {
                    "StringEquals": {
                        "iam:PassedToService": "lambda.amazonaws.com"
                    }
                }
            },
            {
                "Sid": "DynamoDB",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:CreateTable",
                    "dynamodb:DeleteTable",
                    "dynamodb:DescribeTable",
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "dynamodb:UpdateItem"
                ],
                "Resource": [
                    "arn:aws:dynamodb:*:111122223333:table/*"
                ]
            }
        ]
    }
  ```

# Running in Local
---
- Create **.env** at root of the project folder
  ```env
	AWS_ENDPOINT=http://localhost:4566
	AWS_REGION=

	S3_ENDPOINT=http://s3.localhost.localstack.cloud:4566
	S3_BUCKET_NAME=

	DYNAMODB_TABLE_NAME=
  ```
  - For LocalStack, assuming using default port, endpoints should look as follow
	```env
	AWS_ENDPOINT=http://localhost:4566
	S3_ENDPOINT=http://s3.localhost.localstack.cloud:4566
  	```
  - For AWS, endpoint should look as follow
     ```env
	AWS_ENDPOINT=https://[AWS_REGION].amazonaws.com
	S3_ENDPOINT=http://s3.[AWS_REGION].amazonaws.com
  	```
- Installing Dependencies
  ```
    npm install
  ```
- Deploying stack
  ```bash
    npm run deploy:local
  ```
  This command will create necessary resources such as Lambda function, S3 bucket and DynamoDB table
- Invoking local function with valid data
  ```bash
	npm run invoke:local
  ```
  This will invoke the handler with a valid data specified in `/src/test-data/valid-data.json`
  The function is expected to create the signed content and store the information in DynamoDB table
- Invoking local function with invalid data
  ```bash
	npm run invoke:local:invalid
  ```
  This will invoke the handler with an invalid data specified in `/src/test-data/invalid-data.json`
  The function is expected to return with a failure response
- Removing previously created resources
  ```bash
	npm run remove:local
  ```

# Testing
---
- Running unit test for all services
  ```bash
	npm run test
  ```

# Support
---
Do not hesitate to contact me at tharavink619@gmail.com.
