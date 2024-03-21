import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';

export interface Context {
  appName: string;
  domain?: string;
  url?: string;
}

interface ReactStackProps extends cdk.StackProps {
  context: Context;
}

export class ReactCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ReactStackProps) {
    super(scope, id, props);

    const { context } = props;

    // 테스트서버 배포할 경우에
    let hostedZone: route53.IHostedZone | undefined;
    let certificate: acm.ICertificate;
    let viewerCertificate;

    if (context.domain && context.url) {
      hostedZone = route53.HostedZone.fromLookup(this, `${context.appName}HostZone`, {
        domainName: context.domain!,
      });

      certificate = new acm.Certificate(this, `${context.appName}-acm`, {
        domainName: context.url!,
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });

      viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [context.url!],
      });
    }

    // S3
    const bucket = new s3.Bucket(this, `${context.appName}-CreateReactAppBucket`, {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    // Cloudfront
    const cf = new cloudfront.CloudFrontWebDistribution(this, `${context.appName}-CDKCRAStaticDistribution`, {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerCertificate,
    });

    // Deployment
    const src = new s3Deploy.BucketDeployment(this, `${context.appName}-DeployCRA`, {
      sources: [s3Deploy.Source.asset('../www')],
      destinationBucket: bucket,
      distributionPaths: ['/*'],
      distribution: cf,
    });

    if (viewerCertificate) {
      const aRecord = new route53.ARecord(this, `${context.appName}AliasRecord`, {
        recordName: context.url,
        zone: hostedZone!, // not sure why ! is needed here
        target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cf)),
      });
    }
  }
}
