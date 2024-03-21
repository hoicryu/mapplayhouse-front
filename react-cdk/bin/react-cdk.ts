#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import { ReactCdkStack, Context } from '../lib/react-cdk-stack';

const nodeEnv = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `./.env.${nodeEnv}`,
});

const app = new cdk.App();

const env = {
  account: process.env.ACCOUNT,
  region: 'us-east-1',
};

function isContext(context: any): context is Context {
  return typeof context.appName === 'string';
}

const context = {
  appName: process.env.APP_NAME,
  domain: process.env.DOMAIN,
  url: process.env.URL,
};

if (isContext(context)) {
  new ReactCdkStack(app, `${context.appName}FrontEnd`, {
    env,
    context,
  });
}

console.log(context);
