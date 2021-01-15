# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.29](https://github.com/jogold/cloudstructs/compare/v0.1.28...v0.1.29) (2021-01-15)


### Bug Fixes

* **static-website:** document requires 'TrustedScriptURL' assignment ([#114](https://github.com/jogold/cloudstructs/issues/114)) ([85aec7e](https://github.com/jogold/cloudstructs/commit/85aec7e3fa8ef7f1808112dcc068c262a1d9f991))

### [0.1.28](https://github.com/jogold/cloudstructs/compare/v0.1.27...v0.1.28) (2021-01-15)


### Features

* **static-website:** HTTP security headers ([#113](https://github.com/jogold/cloudstructs/issues/113)) ([beff06e](https://github.com/jogold/cloudstructs/commit/beff06e06bd6ccc82e9ffe8a7f85e550e0948ba9))

### [0.1.27](https://github.com/jogold/cloudstructs/compare/v0.1.26...v0.1.27) (2021-01-15)


### Features

* **static-website:** SPA redirect with origin request Lambda@Edge ([#112](https://github.com/jogold/cloudstructs/issues/112)) ([34829b7](https://github.com/jogold/cloudstructs/commit/34829b7972817091d92039f4b1c11fca705c6286))

### [0.1.26](https://github.com/jogold/cloudstructs/compare/v0.1.25...v0.1.26) (2021-01-07)

### [0.1.25](https://github.com/jogold/cloudstructs/compare/v0.1.24...v0.1.25) (2021-01-07)


### Features

* **saml-identity-provider:** SAML federated principal ([#110](https://github.com/jogold/cloudstructs/issues/110)) ([60b9fa4](https://github.com/jogold/cloudstructs/commit/60b9fa44d1390fd6cd560b86c3dd03d1e4ffed8b))

### [0.1.24](https://github.com/jogold/cloudstructs/compare/v0.1.23...v0.1.24) (2021-01-06)


### Bug Fixes

* **saml-identity-provider:** IdentityProvider cannot contain region information ([#109](https://github.com/jogold/cloudstructs/issues/109)) ([dc76f1e](https://github.com/jogold/cloudstructs/commit/dc76f1e217707562487ddb83985d84f32f5a6ebe))

### [0.1.23](https://github.com/jogold/cloudstructs/compare/v0.1.22...v0.1.23) (2021-01-02)

### [0.1.22](https://github.com/jogold/cloudstructs/compare/v0.1.21...v0.1.22) (2021-01-02)


### Features

* **codecommit-mirror:** mirror a repository to AWS CodeCommit on schedule ([#104](https://github.com/jogold/cloudstructs/issues/104)) ([c7dd0e6](https://github.com/jogold/cloudstructs/commit/c7dd0e662be2df72333f637aa2bf67861dec2efd)), closes [#103](https://github.com/jogold/cloudstructs/issues/103)

### [0.1.21](https://github.com/jogold/cloudstructs/compare/v0.1.20...v0.1.21) (2020-12-31)


### Features

* **static-website:** redirect to HTTPS ([#95](https://github.com/jogold/cloudstructs/issues/95)) ([9357afc](https://github.com/jogold/cloudstructs/commit/9357afce0fedc4f279cbc2dd9096c0e3505faf00))

### [0.1.20](https://github.com/jogold/cloudstructs/compare/v0.1.19...v0.1.20) (2020-12-30)

### [0.1.19](https://github.com/jogold/cloudstructs/compare/v0.1.18...v0.1.19) (2020-12-29)

### 0.1.18 (2020-12-24)

### 0.1.17 (2020-12-24)


### Features

* **saml-identity-provider:** custom resource to create a SAML identity provider ([#80](https://github.com/jogold/cloudstructs/issues/80)) ([6a1a1bc](https://github.com/jogold/cloudstructs/commit/6a1a1bc8b04d5bfc7e0913ae1c05dc577e193018))

### 0.1.16 (2020-12-24)

### 0.1.15 (2020-12-24)


### Features

* **url-shortener:** URL shortener API ([#64](https://github.com/jogold/cloudstructs/issues/64)) ([350a705](https://github.com/jogold/cloudstructs/commit/350a705293ac02c9605b8bb99decfdf4a9878664))

### 0.1.14 (2020-12-23)

### 0.1.13 (2020-12-22)

### 0.1.12 (2020-12-21)

### 0.1.11 (2020-12-18)

### 0.1.10 (2020-12-14)

### 0.1.9 (2020-12-11)

### 0.1.8 (2020-12-10)

### 0.1.7 (2020-12-09)


### Features

* **ecs-service-roller:** easily roll ECS service tasks ([#45](https://github.com/jogold/cloudstructs/issues/45)) ([774bc8f](https://github.com/jogold/cloudstructs/commit/774bc8f994004a34bb2d6bbf732f40c2e12bf702))

### 0.1.6 (2020-12-09)

### 0.1.5 (2020-12-09)


### Features

* **email-receiver:** easily receive and process emails with a Lambda function ([#13](https://github.com/jogold/cloudstructs/issues/13)) ([f8044e0](https://github.com/jogold/cloudstructs/commit/f8044e0a6caad208cca51f05bc619e3402d53532))

### 0.1.4 (2020-12-09)

### 0.1.3 (2020-12-08)

### 0.1.2 (2020-12-07)

### 0.1.1 (2020-12-07)

## 0.1.0 (2020-12-07)


### ⚠ BREAKING CHANGES

* **slack-events:** Event subscriptions of existing Slack apps must be reconnected to the new endpoint.
* **slack-events**: `SlackEventsProps.restApiName` is now `SlackEventsProps.apiName`

### Features

* **slack-events:** use a HTTP API ([#23](https://github.com/jogold/cloudstructs/issues/23)) ([95e1ed3](https://github.com/jogold/cloudstructs/commit/95e1ed3008a70ec347f12bc2ad9eb103149647f1))

### 0.0.12 (2020-12-07)

### 0.0.11 (2020-12-01)

### 0.0.10 (2020-11-30)


### Features

* **state-machine-cr-provider:** custom resources with state machines ([#22](https://github.com/jogold/cloudstructs/issues/22)) ([ba4a814](https://github.com/jogold/cloudstructs/commit/ba4a814687f86e582c6362babcbce09547521be7))

### 0.0.9 (2020-11-30)

### 0.0.8 (2020-11-29)


### Features

* **static-website:** static website with backend configuration ([#18](https://github.com/jogold/cloudstructs/issues/18)) ([2a7a429](https://github.com/jogold/cloudstructs/commit/2a7a42915316117ba4505e00b9b49ea39dc176e5))

### 0.0.7 (2020-11-29)

### 0.0.6 (2020-11-27)

### 0.0.5 (2020-11-26)

### 0.0.4 (2020-11-26)

### 0.0.3 (2020-11-25)

### 0.0.2 (2020-11-25)


### Features

* **slack-textract:** extract text from images posted to Slack ([#7](https://github.com/jogold/cloudstructs/issues/7)) ([ab6afb7](https://github.com/jogold/cloudstructs/commit/ab6afb736da6539132c6b1596f22836c8e11e903))

### 0.0.1 (2020-11-25)
