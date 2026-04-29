# Tyler Rosnett
Platform Engineer · Developer Experience · Cloud Native Architecture

Los Angeles, CA · [LinkedIn](https://linkedin.com/in/tylerrosnett) · [GitHub](https://github.com/tylerrosnett)

Platform engineer with 7 years at State Farm building, operating, and rearchitecting Kubernetes platforms at enterprise scale. Shaped every major inflection point of State Farm's cloud-native journey from standing up GitOps on the original on-prem Kubernetes platform, to driving Red Hat OpenShift on AWS adoption, and architecting the current enterprise platform transformation.

## Experience

### Lead Software Engineer, Platform Engineering
**State Farm Insurance** • Remote · Los Angeles, CA • Feb 2026 – Present

- Leading State Farm's next-generation platform engineering transformation after an executive PoC I delivered was approved for enterprise rollout. The platform is the architectural foundation for rebuilding all State Farm insurance capabilities into a unified enterprise system.
- Designed the golden path onboarding experience: teams onboard once and automatically receive identity access groups, application registration, cluster workload identity (secretless), enterprise SCM with managed access, and fully managed CI/CD.
- Built fully managed CI/CD pipelines with SLSA compliance, OCI image signing, DSSE attestations, SBOM generation, and code scan attestations; CD uses ArgoCD with zero developer-managed infrastructure.
- Delivered a working MVP in 6 weeks; first production teams onboarding within 60 days of project start.
- Leading and mentoring a cross-functional team of Senior, Staff, and Principal engineers on platform patterns, Kubernetes-native infrastructure, and supply chain security.
- Built an artifact-based deployment configuration model eliminating config repos entirely, plus a GitHub-native approval UI in production within 2 months. (2025 Innovation Days winner.)
- Led the innovation PoC proving Crossplane as the enterprise platform control plane. (2025 Innovation Days winner.)

### Lead Software Engineer, Delivery Engineering / GitOps
**State Farm Insurance** • Bloomington, IL → Remote • Mar 2023 – Feb 2026

- Built and owned the enterprise CI/CD pipeline adopted by over 2,500 projects, over 2,500 users, and over 1,000 teams, with over 300,000 pipeline runs.
- Built a real-time eventing and observability layer feeding an OpenSearch dashboard tracking adoption, pipeline health, and usage trends enterprise-wide.
- Eliminated nearly all manual onboarding prerequisites; teams could ship from day one with no ticket-driven setup.
- Eliminated all static CI/CD credentials enterprise-wide through automated workload identity and credential lifecycle management.
- Led zero-downtime FluxCD major version migration across State Farm's entire on-prem Kubernetes fleet.
- Integrated ITSM change automation into every platform system; deployments automatically open, track, and close change records.
- Rebuilt the enterprise evidence-of-test recording system as a Go API and Backstage plugin. (2024 Innovation Days winner.)
- Implemented least-privilege binary storage for PCF CLI deployments using AWS S3 with scoped GitLab CI tokens.
- Built a Go REST API and Backstage UI replacing Terraform-based GitLab repo governance.

### Software Engineer, Delivery Engineering / GitOps
**State Farm Insurance** • Bloomington, IL • Jul 2022 – Mar 2023

- Stepped into ownership of Flux operations across State Farm's enterprise on-prem Kubernetes fleet.
- Deepened expertise in GitOps patterns, Kubernetes controllers, and multi-cluster fleet management.

### Infrastructure Analyst, Mainframe as a Service
**State Farm Insurance** • Bloomington, IL • Jan 2020 – Jul 2022

- Enabled Git-based SCM migration for mainframe workflows; built Jenkins CI/CD pipelines for mainframe environments.
- Developed REST APIs in Python and Java; built React UIs for configuration and asset management on z/OS.
- Enabled deployment of modern languages (Java, Python) onto z/OS via Unix System Services (USS).

### Enterprise Technology Intern, Mainframe as a Service
**State Farm Insurance** • Bloomington, IL • May 2019 – Dec 2019

- Built a CI/CD pipeline replacing State Farm's legacy mainframe deployment tooling.

## Skills & Technologies

**Platform & GitOps:** Crossplane (custom providers & compositions), ArgoCD, FluxCD, Kubernetes, OpenShift, Kubernetes Operators & Controllers (Go)

**CI/CD & Supply Chain:** GitLab CI, GitHub Actions, JFrog Artifactory, SLSA, OCI image signing, DSSE attestations, SBOM, provenance

**Infrastructure as Code:** Terraform (custom providers in Go), Kubernetes-native infrastructure

**AWS:** EKS, IAM (IRSA, workload identity, least-privilege automation), S3, ECR

**Languages:** Go (operators, Terraform/Crossplane providers, REST APIs), Python, Java, TypeScript/React

**Developer Experience:** Internal developer portals (Backstage), golden path design, platform onboarding automation, enterprise identity

## Education & Certifications

**B.S. Computer Science, Magna Cum Laude (3.85 GPA)**
Illinois State University • Dec 2019

**Kubernetes and Cloud Native Associate (KCNA)**
CNCF • Jun 2024

**Secure Code Warrior: Gold Medalist**
2023 – 2025
