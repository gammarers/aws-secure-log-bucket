# AWS Secure Log Bucket

[![GitHub](https://img.shields.io/github/license/yicr/aws-secure-log-bucket?style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-secure-log-bucket?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-secure-log-bucket)
[![PyPI](https://img.shields.io/pypi/v/gammarers.aws-secure-log-bucket?style=flat-square)](https://pypi.org/project/gammarers.aws-secure-log-bucket/)
[![Nuget](https://img.shields.io/nuget/v/gammarers.CDK.AWS.SecureLogBucket?style=flat-square)](https://www.nuget.org/packages/gammarers.CDK.AWS.SecureLogBucket/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/yicr/aws-secure-log-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/yicr/aws-secure-log-bucket?sort=semver&style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/releases)

[![View on Construct Hub](https://constructs.dev/badge?package=@gammarers/aws-secure-log-bucket)](https://constructs.dev/packages/@gammarers/aws-secure-log-bucket)

secure multiple transition phases in a single lifecycle policy bucket.

## Lifecycle rule

The storage class will be changed with the following lifecycle configuration.

| Storage Class       | Defaul transition after days | 
| ------------------- |------------------------------| 
| INFREQUENT_ACCESS   | 60 days                      | 
| INTELLIGENT_TIERING | 120 days                     | 
| GLACIER             | 180 days                     | 
| DEEP_ARCHIVE        | 360 days                     |

## Install

### TypeScript

```shell
npm install @gammarers/aws-secure-log-bucket
# or
yarn add @gammarers/aws-secure-log-bucket
```

### Python

```shell
pip install gammarers.aws-secure-log-bucket
```

### C# / .NET

```shell
dotnet add package Gammarers.CDK.AWS.SecureLogBucket
```

## Example

```typescript
import { SecureLogBucket } from '@gammarers/aws-secure-log-bucket';

new SecureLogBucket(stack, 'SecureLogBucket');
```

## License

This project is licensed under the Apache-2.0 License.
