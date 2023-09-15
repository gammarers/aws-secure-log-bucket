[![GitHub](https://img.shields.io/github/license/yicr/aws-secure-log-bucket?style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarer/aws-secure-log-bucket?style=flat-square)](https://www.npmjs.com/package/@gammarer/aws-secure-log-bucket)
[![PyPI](https://img.shields.io/pypi/v/gammarer.aws-secure-log-bucket?style=flat-square)](https://pypi.org/project/gammarer.aws-secure-log-bucket/)
[![Nuget](https://img.shields.io/nuget/v/Gammarer.CDK.AWS.SecureLogBucket?style=flat-square)](https://www.nuget.org/packages/Gammarer.CDK.AWS.SecureLogBucket/)
[![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.gammarer/aws-secure-log-bucket?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/gammarer/aws-secure-log-bucket/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/yicr/aws-secure-log-bucket/release.yml?branch=main&label=release&style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/yicr/aws-secure-log-bucket?sort=semver&style=flat-square)](https://github.com/yicr/aws-secure-log-bucket/releases)

# AWS Secure Log Bucket

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
npm install @gammarer/aws-secure-log-bucket
# or
yarn add @gammarer/aws-secure-log-bucket
```

### Python

```shell
pip install gammarer.aws-secure-log-bucket
```

### C# / .NET

```shell
dotnet add package Gammarer.CDK.AWS.SecureLogBucket
```

### Java

Add the following to pom.xml:

```xml
<dependency>
  <groupId>com.gammarer</groupId>
  <artifactId>aws-secure-log-bucket</artifactId>
</dependency>
```

## Example

```typescript
import { SecureLogBucket } from '@gammarer/aws-secure-log-bucket';

new SecureLogBucket(stack, 'SecureLogBucket');
```

## License

This project is licensed under the Apache-2.0 License.
