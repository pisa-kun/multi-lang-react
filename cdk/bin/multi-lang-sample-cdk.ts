#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MultiLangSampleStack } from '../lib/multi-lang-sample-stack';

const app = new cdk.App();
new MultiLangSampleStack(app, 'MultiLangSampleStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  },
});
