.PHONY: init prepare deploy destroy prepare-destroy clean echo

PROFILE = $${npm_config_profile:+--profile $${npm_config_profile}};
REGION = $${npm_config_region:+--region $${npm_config_region}}

init:
	@mkdirp .dist;
	@read -p "Please input prefix of resources[]:" prefix; \
	 read -p "Please input bucket name[$${prefix}$${npm_package_config_s3_bucket}]:" s3_bucket; \
	 read -p "Please input stack name[$${prefix}$${npm_package_config_stack_name}]:" stack_name; \
		npm config set $${npm_package_name}:resource_prefix "$${prefix}"; \
		npm config set $${npm_package_name}:s3_bucket "$${prefix}$${s3_bucket:-$${npm_package_config_s3_bucket}}"; \
		npm config set $${npm_package_name}:stack_name "$${prefix}$${stack_name:-$${npm_package_config_stack_name}}";

prepare:
	@aws $${PROFILE} $${REGION} cloudformation create-stack \
		--stack-name $${npm_package_config_stack_name}-prepare \
		--template-body file://resources.yml \
		--parameters ParameterKey=BucketName,ParameterValue=$${npm_package_config_s3_bucket} \
		--capabilities CAPABILITY_IAM;
	@aws $${PROFILE} $${REGION} cloudformation wait stack-create-complete \
		--stack-name $${npm_package_config_stack_name}-prepare;
	@JSON=`aws $${PROFILE} $${REGION} cloudformation describe-stacks --stack-name $${npm_package_config_stack_name}-prepare`; \
		npm config set $${npm_package_name}:key_id `echo $${JSON} | jq -r '.Stacks[].Outputs | map(select(.OutputKey == "KeyId")) | .[].OutputValue'`; \
		npm config set $${npm_package_name}:custom_resource_arn `echo $${JSON} | jq -r '.Stacks[].Outputs | map(select(.OutputKey == "StepFunctionsCustomResourceArn")) | .[].OutputValue'`; \
		npm config set $${npm_package_name}:iam_role_arn `echo $${JSON} | jq -r '.Stacks[].Outputs | map(select(.OutputKey == "LambdaExectionRoleArn")) | .[].OutputValue'`;

deploy:
	@cp yarn.lock .dist;
	@cp template.yml .dist;
	@cp -r src .dist;
	@sed -e 's/"postinstall".*$$/ /g' -e 's/"aws-sdk".*$$/ /g' package.json > .dist/package.json;
	@cd .dist; \
	if which yarn >/dev/null; then \
		yarn install --production; \
	else \
		npm install --production; \
	fi;
	@cd .dist && aws $${PROFILE} $${REGION} cloudformation package \
		--template-file template.yml \
		--output-template-file template.yml \
		--s3-bucket $${npm_package_config_s3_bucket};
	@aws $${PROFILE} $${REGION} cloudformation deploy \
		--template-file .dist/template.yml \
		--stack-name $${npm_package_config_stack_name} \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides \
			LambdaExectionRoleArn=$${npm_package_config_iam_role_arn} \
			StepFunctionsCustomResourceArn=$${npm_package_config_custom_resource_arn};

destroy:
	@aws $${PROFILE} $${REGION} cloudformation delete-stack --stack-name $${npm_package_config_stack_name};
	@aws $${PROFILE} $${REGION} cloudformation wait stack-delete-complete --stack-name $${npm_package_config_stack_name};

prepare-destroy:
	@aws $${PROFILE} $${region} s3 rm s3://$${npm_package_config_s3_bucket} --recursive;
	@aws $${PROFILE} $${region} cloudformation delete-stack --stack-name $${npm_package_config_stack_name}-prepare;
	@aws $${PROFILE} $${region} cloudformation wait stack-delete-complete --stack-name $${npm_package_config_stack_name}-prepare;
	@npm config delete $${npm_package_name}:iam_role_arn;
	@npm config delete $${npm_package_name}:custom_resource_arn;
	@npm config delete $${npm_package_name}:key_id;

clean:
	@npm config delete ${npm_package_name}:resource_prefix;
	@npm config delete ${npm_package_name}:s3_bucket;
	@npm config delete ${npm_package_name}:stack_name;
	@rimraf .dist;
