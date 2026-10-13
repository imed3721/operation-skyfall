# Operation Skyfall

**A Secure CI/CD Deployment Pipeline Using GitHub Actions, AWS OIDC, IAM, and Amazon S3**

## Overview

Operation Skyfall is a fictional intelligence mission portal built to demonstrate fundamental DevOps practices, secure cloud deployment, and CI/CD automation.

The project uses GitHub Actions to validate website files, scan for potential exposed credentials, and deploy approved changes to an Amazon S3 static website. AWS authentication is handled through OpenID Connect (OIDC), avoiding the need to store long-lived AWS access keys in GitHub.

The project emphasizes automation, least-privilege access, deployment validation, security controls, and documented recovery procedures.

## Project Objectives

- Build and host a static website using Amazon S3.
- Automate validation and deployment with GitHub Actions.
- Authenticate to AWS using GitHub OIDC federation.
- Apply least-privilege IAM permissions.
- Prevent deployment when validation or secret scanning fails.
- Protect the production branch and control changes.
- Document deployment evidence, limitations, and recovery procedures.

## Architecture

The deployment pipeline follows this sequence:

1. **Source control:** GitHub stores the website source code and tracks changes through version control.
2. **Continuous integration:** GitHub Actions checks out the repository and validates the required website files and basic HTML structure.
3. **Secret scanning:** A secret-scanning step checks the repository for potential exposed credentials.
4. **Deployment gate:** The deployment job depends on successful validation and scanning.
5. **Identity federation:** GitHub Actions requests temporary AWS credentials through OpenID Connect (OIDC).
6. **Access control:** AWS IAM evaluates the role's trust policy, including the permitted repository and branch conditions.
7. **Least-privilege deployment:** A dedicated IAM role grants the permissions required to upload the approved website files to the intended S3 bucket.
8. **Website hosting:** Amazon S3 serves the static website content.
9. **Deployment evidence:** GitHub Actions run history, commit identifiers, and generated deployment version information help track releases.

## Security Controls

The project incorporates the following security measures:

- **OIDC authentication:** Avoids storing long-lived AWS access keys in GitHub repository secrets.
- **Restricted IAM trust policy:** Limits role assumption to the intended GitHub repository and permitted branch or workflow context.
- **Least-privilege IAM permissions:** Restricts deployment permissions to the intended S3 resources where practical.
- **Pre-deployment validation:** Checks required files and basic HTML structure before deployment.
- **Secret scanning:** Uses a dedicated scanning tool to identify potential exposed credentials.
- **Deployment gating:** Prevents the deployment job from proceeding when the validation job fails.
- **Explicit file uploads:** Uploads only the intended website files instead of indiscriminately copying the repository.
- **Branch protection:** Helps prevent unreviewed or unauthorized changes to the production branch.
- **Recovery procedures:** Documents how to restore a previous version through GitHub and verify the resulting deployment.
- **Deployment traceability:** Uses workflow logs, commit SHAs, and deployment version information to support troubleshooting and review.

## Limitations and Risks

This project is a learning environment and is not intended to represent a fully production-hardened hosting platform.

- **Secret-scanning coverage:** Secret scanners can produce false positives and may not detect every type of credential. Scanning configuration and repository-history coverage should be verified.
- **Transport security:** The standard Amazon S3 static website endpoint uses HTTP, not HTTPS.
- **Public access:** The website is publicly accessible and must contain fictional, non-sensitive content only.
- **Deployment consistency:** Uploading multiple files individually is not an atomic release. Visitors may briefly encounter files from different deployment versions during an update.
- **Audit limitations:** GitHub Actions logs and deployment identifiers provide useful evidence but are not, by themselves, a complete tamper-resistant audit system.
- **Rollback verification:** The recovery procedure must be tested and documented before rollback can be considered verified.
- **Cloud costs:** AWS resources may incur charges depending on usage and configuration.

## Testing and Evidence

The following tests demonstrate the validation and basic credential-detection controls implemented in the Operation Skyfall CI/CD pipeline.

### Test 1 — Deliberately Break Validation

**Objective:** Verify that the pipeline detects invalid website content and prevents deployment when validation fails.

**Procedure:**
1. Introduce a deliberate error into the website's HTML to cause the validation step to fail.
2. Commit the change and allow the GitHub Actions workflow to run.
3. Inspect the workflow results and confirm that the validation job fails.
4. Verify that the deployment job is skipped because the validation job did not succeed.
5. Restore the original HTML and confirm that the workflow passes again.

**Expected result:** The pipeline rejects the invalid website content and prevents the deployment job from running.

**Evidence:**

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0ec00ff0f963b40fcb480ff62a9332166baee4f2/screenshots/Screenshot%202026-10-13%20at%2009.02.53.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0ec00ff0f963b40fcb480ff62a9332166baee4f2/screenshots/Screenshot%202026-10-13%20at%2009.02.56.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0ec00ff0f963b40fcb480ff62a9332166baee4f2/screenshots/Screenshot%202026-10-13%20at%2009.03.00.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0ec00ff0f963b40fcb480ff62a9332166baee4f2/screenshots/Screenshot%202026-10-13%20at%2009.03.03.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0ec00ff0f963b40fcb480ff62a9332166baee4f2/screenshots/Screenshot%202026-10-13%20at%2009.03.07.png)

### Test 2 — Test the Basic Credential Detector

**Objective:** Verify that the basic credential-pattern check identifies a matching test string and blocks the deployment pipeline.

**Procedure:**
1. Use a harmless, clearly fake test string that matches one of the detector's configured patterns.
2. Introduce the test string into one of the website source files checked by the workflow.
3. Commit the change on a temporary test branch and run the GitHub Actions workflow.
4. Inspect the workflow logs and confirm that the detector reports a potential exposed credential.
5. Verify that validation fails and deployment does not proceed.
6. Remove the test string and confirm that the workflow passes again.

**Expected result:** The detector identifies the matching test pattern and prevents deployment until the test string is removed.

**Evidence:**

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0c3736603822c1300ef1b844ad1b1e74da7c6f3e/screenshots/Screenshot%202026-10-13%20at%2009.13.11.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0c3736603822c1300ef1b844ad1b1e74da7c6f3e/screenshots/Screenshot%202026-10-13%20at%2009.13.29.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0c3736603822c1300ef1b844ad1b1e74da7c6f3e/screenshots/Screenshot%202026-10-13%20at%2009.13.42.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0c3736603822c1300ef1b844ad1b1e74da7c6f3e/screenshots/Screenshot%202026-10-13%20at%2009.13.52.png)

![Image Alt](https://github.com/imed3721/operation-skyfall/blob/0c3736603822c1300ef1b844ad1b1e74da7c6f3e/screenshots/Screenshot%202026-10-13%20at%2009.13.56.png)

**Security note:** This detector uses predefined text patterns and is intended as a basic safeguard. It is not a comprehensive secret-scanning solution and may miss credentials that do not match its configured patterns.

## Project Structure

The repository contains the website source, deployment workflow, and project documentation.

- `index.html` — Website structure and mission portal content.
- `style.css` — Website styling and layout.
- `script.js` — Client-side interactions.
- `version.json` — Generated deployment version information.
- `.github/workflows/deploy.yml` — Validation, secret scanning, and AWS deployment workflow.
- `README.md` — Project overview, architecture, security controls, limitations, and test evidence.

## Key Learning Outcomes

This project demonstrates practical experience with:

- Git and GitHub version control.
- GitHub Actions and CI/CD pipeline design.
- Automated validation and secret scanning.
- AWS IAM roles and least-privilege permissions.
- GitHub OIDC federation and temporary AWS credentials.
- Amazon S3 static website hosting.
- Deployment gating and failure handling.
- Branch protection, rollback procedures, and deployment verification.
- Security documentation and evidence collection.

## Conclusion

Operation Skyfall demonstrates how a basic static website can be deployed through an automated pipeline with cloud identity federation, scoped permissions, validation gates, and documented recovery procedures.

The project also highlights important trade-offs in static website hosting, secret detection, deployment consistency, and auditability. Testing and documenting these controls is an essential part of evaluating the security and reliability of the pipeline.
