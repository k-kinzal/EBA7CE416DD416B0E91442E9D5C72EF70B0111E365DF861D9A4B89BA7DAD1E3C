# EBA7CE416DD416B0E91442E9D5C72EF70B0111E365DF861D9A4B89BA7DAD1E3C

Example for AWS Lambda + SAM.

## Get Started

```
$ npm install
$ npm run init
Please input prefix of resources[]:test-            # Prefix for S3 bukect and cloudformation stack
Please input bucket name[test-eba7ce4]:test-eba7ce4 # S3 bucket name for uploading AWS lambda
Please input stack name[test-eba7ce4]:test-eba7ce4  # Cloudformation stack name for deploy Serverless Application Model
$ npm run prepare # Create S3 bucket and KSM key and IAM role for AWS lambda execution
$ npm run deploy  # Deploy Lambda Application
```

## Remove Project

```
$ npm run destroy         # remove for run deploy
$ npm run prepare-destroy # remove for run prepare
$ npm run clean           # remove for run init
```

## Tips

### Using AWS Environment Variables

```
$ export AWS_ACCESS_KEY_ID=xxx
$ export AWS_SECRET_ACCESS_KEY=xxx
$ npm run deploy
```

### Using AWS Default Profile

```
$ ~/.aws/credentials <<<EOS
[default]
aws_access_key_id = xxx
aws_secret_access_key = xxx
EOS
$ npm run deploy
```

### Using AWS Profile

```
$ ~/.aws/credentials <<<EOS
[user]
aws_access_key_id = xxx
aws_secret_access_key = xxx
EOS
$ npm run deploy --profile=user
```

### Using AWS Region

```
$ npm run deploy --region=ap-northeast-1
```
