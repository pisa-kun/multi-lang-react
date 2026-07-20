variable "aws_region" {
  type        = string
  description = "AWS region to deploy to"
  default     = "ap-northeast-1"
}

variable "app_runner_role_name" {
  type        = string
  description = "Name of the App Runner access role"
  default     = "multi-lang-sample-apprunner-access-role"
}
