data "aws_iam_policy_document" "apprunner_access_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "apprunner_access_role" {
  name               = var.app_runner_role_name
  assume_role_policy = data.aws_iam_policy_document.apprunner_access_assume_role.json
}

resource "aws_iam_role_policy_attachment" "apprunner_access_policy" {
  role       = aws_iam_role.apprunner_access_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}
