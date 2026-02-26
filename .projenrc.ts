import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.189.1',
  typescriptVersion: '5.8.x',
  jsiiVersion: '5.8.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-secure-log-bucket',
  description: 'secure multiple transition phases in a single lifecycle policy bucket.',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'lifecycle', 'log'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-secure-log-bucket.git',
  majorVersion: 2,
  deps: [
    '@gammarers/aws-secure-bucket@^2.5.0',
  ],
  //  peerDeps: [
  //    '@gammarers/aws-secure-bucket@^2.3.6',
  //  ],
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '22.x',
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.NEVER, // // every sunday (JST/MON:03:00)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarers.aws-secure-log-bucket',
    module: 'gammarers.aws_secure_log_bucket',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarers.CDK.AWS',
    packageId: 'Gammarers.CDK.AWS.SecureLogBucket',
  },
});
project.synth();
