import {
  LiveStatus,
  PersonalMetrics,
  Project,
  WriteUp,
  DailyLog,
  Skill,
  TimelineItem,
  CertificationItem,
  EducationItem,
  LabExperiment,
  SiteSettings,
  User,
  AuditLog,
} from '../types';

export const initialSiteSettings: SiteSettings = {
  name: 'Ram',
  brandName: 'RAM.SEC',
  tagline: 'offensive mindset. defensive results. meet ram.',
  headlineMain: 'offensive mindset. defensive results.',
  headlineSub: 'meet ram.',
  positioning: 'Cybersecurity Professional • Security Researcher • Builder • Linux • Python • Web Security',
  location: 'India',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  socialHandle: '@RAM_56688',
  twitterUrl: 'https://x.com/RAM_56688',
  githubUrl: 'https://github.com/ram-sec',
  linkedinUrl: 'https://linkedin.com/in/ram-sec',
  telegramUrl: 'https://t.me/ram_sec',
  discordHandle: 'ram_sec#0001',
  email: 'ram.security@proton.me',
  phone: '+91 (Encrypted Comms)',
  pgpPublicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.10.1
Comment: https://ram.sec/pgp-key

mQGNBF+v49cBDADb7yS4s9x9cK...RAM.SEC.KEY...
fp4V12D8xK7yW2a9B9e0E5k4p9z1...
=f89x
-----END PGP PUBLIC KEY BLOCK-----`,
  audioEffects: false,
};

export const initialLiveStatus: LiveStatus = {
  systemStatus: 'OPERATIONAL',
  threatLevel: 'LOW',
  labStatus: 'ONLINE',
  currentFocus: 'Web Application Security & Linux Kernel Hardening',
  lastUpdate: 'Just now',
  uptime: '99.98%',
  activeProbesCount: 4,
};

export const initialMetrics: PersonalMetrics = {
  securityProjects: 8,
  writeups: 12,
  labHours: 650,
  tools: 24,
  certifications: 3,
  githubProjects: 14,
};

export const initialSkills: Skill[] = [
  // OFFENSIVE SECURITY
  {
    id: 'off-1',
    name: 'Penetration Testing',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    description: 'Black-box and grey-box assessments, scoping, vulnerability discovery, controlled exploitation and remediation reporting.',
    projectsUsingIt: ['SentinelForge', 'AuthShield'],
    iconName: 'ShieldAlert',
    proficiencyPercent: 88,
  },
  {
    id: 'off-2',
    name: 'Web Application Security',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Expert',
    description: 'OWASP Top 10, IDOR, SSRF, BOLA/BFLA API vulnerabilities, authentication bypass flaws, and business logic analysis.',
    projectsUsingIt: ['SentinelForge', 'AuthShield', 'ShadowCTF'],
    iconName: 'Globe',
    proficiencyPercent: 92,
  },
  {
    id: 'off-3',
    name: 'Reconnaissance & Footprinting',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    description: 'Subdomain enumeration, ASN routing mapping, DNS brute-forcing, cloud storage bucket discovery, and attack surface tracking.',
    projectsUsingIt: ['TraceHound', 'NetSpecter'],
    iconName: 'Radar',
    proficiencyPercent: 85,
  },
  {
    id: 'off-4',
    name: 'Vulnerability Research',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Intermediate',
    description: 'Auditing open-source codebases, tracking CVE advisories, patch diffing, and verifying zero-day/N-day proof-of-concepts.',
    projectsUsingIt: ['KernelGuard'],
    iconName: 'Bug',
    proficiencyPercent: 78,
  },

  // DEFENSIVE SECURITY
  {
    id: 'def-1',
    name: 'Linux Hardening',
    category: 'DEFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    description: 'Kernel parameter tuning (sysctl), AppArmor/SELinux profiling, SecComp filters, PAM configuration, and SSH bastions.',
    projectsUsingIt: ['KernelGuard', 'ShadowCTF'],
    iconName: 'Terminal',
    proficiencyPercent: 90,
  },
  {
    id: 'def-2',
    name: 'Incident Response & Triage',
    category: 'DEFENSIVE SECURITY',
    experienceLevel: 'Intermediate',
    description: 'Log telemetry correlation, volatile memory forensics, lateral movement containment, and root cause analysis.',
    projectsUsingIt: ['NetSpecter'],
    iconName: 'Crosshair',
    proficiencyPercent: 80,
  },
  {
    id: 'def-3',
    name: 'Threat Detection & SIEM',
    category: 'DEFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    description: 'Sigma rule creation, auditd parsing, Zeek & Suricata IDS rule customization, and automated telemetry alerts.',
    projectsUsingIt: ['NetSpecter'],
    iconName: 'Activity',
    proficiencyPercent: 82,
  },
  {
    id: 'def-4',
    name: 'Security Monitoring',
    category: 'DEFENSIVE SECURITY',
    experienceLevel: 'Intermediate',
    description: 'Real-time telemetry ingestion, Grafana SOC alerting, anomaly scoring on access patterns and edge traffic.',
    projectsUsingIt: ['NetSpecter', 'RAM.SEC Portal'],
    iconName: 'Eye',
    proficiencyPercent: 84,
  },

  // NETWORKING
  {
    id: 'net-1',
    name: 'TCP/IP & Packet Analysis',
    category: 'NETWORKING',
    experienceLevel: 'Expert',
    description: 'Deep packet inspection, TCP 3-way handshake analysis, fragmentation attacks, window size manipulation, and PCAP dissection.',
    projectsUsingIt: ['NetSpecter', 'ShadowCTF'],
    iconName: 'Network',
    proficiencyPercent: 92,
  },
  {
    id: 'net-2',
    name: 'DNS Security & Tunneling',
    category: 'NETWORKING',
    experienceLevel: 'Advanced',
    description: 'DNSSEC, query exfiltration detection, DoH/DoT inspection, zone transfer auditing, and fast-flux domain tracking.',
    projectsUsingIt: ['TraceHound'],
    iconName: 'Server',
    proficiencyPercent: 86,
  },
  {
    id: 'net-3',
    name: 'HTTP/HTTPS Protocol Internals',
    category: 'NETWORKING',
    experienceLevel: 'Expert',
    description: 'HTTP/1.1 vs HTTP/2 multiplexing, request smuggling (CL.TE / TE.CL), TLS cipher negotiation, and HSTS/CSP policy enforcement.',
    projectsUsingIt: ['SentinelForge', 'AuthShield'],
    iconName: 'Cpu',
    proficiencyPercent: 94,
  },
  {
    id: 'net-4',
    name: 'Network Topology & Firewalls',
    category: 'NETWORKING',
    experienceLevel: 'Advanced',
    description: 'iptables, nftables, VLAN segmentation, DMZ architecture, NAT routing, and stateful packet inspection.',
    projectsUsingIt: ['ShadowCTF', 'KernelGuard'],
    iconName: 'Layers',
    proficiencyPercent: 85,
  },

  // PROGRAMMING
  {
    id: 'prog-1',
    name: 'Python for Security & Automation',
    category: 'PROGRAMMING',
    experienceLevel: 'Expert',
    description: 'Custom exploit PoCs, Scapy packet manipulation, automated reconnaissance tooling, async HTTP fuzzers, and log processors.',
    projectsUsingIt: ['SentinelForge', 'TraceHound', 'NetSpecter'],
    iconName: 'Code',
    proficiencyPercent: 95,
  },
  {
    id: 'prog-2',
    name: 'Bash & Shell Scripting',
    category: 'PROGRAMMING',
    experienceLevel: 'Expert',
    description: 'Linux pipeline automation, system audit scripts, log parsing with awk/sed, and unattended environment bootstrapping.',
    projectsUsingIt: ['KernelGuard', 'ShadowCTF'],
    iconName: 'Terminal',
    proficiencyPercent: 92,
  },
  {
    id: 'prog-3',
    name: 'JavaScript / TypeScript',
    category: 'PROGRAMMING',
    experienceLevel: 'Advanced',
    description: 'Full-stack tooling, DOM-based XSS analysis, Node.js secure API development, prototype pollution research.',
    projectsUsingIt: ['RAM.SEC Portal', 'AuthShield'],
    iconName: 'FileCode',
    proficiencyPercent: 88,
  },
  {
    id: 'prog-4',
    name: 'SQL & Database Security',
    category: 'PROGRAMMING',
    experienceLevel: 'Advanced',
    description: 'SQL injection variations (union-based, time-based blind, error-based), ORM leaky abstraction audits, and role partitioning.',
    projectsUsingIt: ['SentinelForge', 'AuthShield'],
    iconName: 'Database',
    proficiencyPercent: 84,
  },

  // OSINT
  {
    id: 'osint-1',
    name: 'Reconnaissance & Asset Discovery',
    category: 'OSINT',
    experienceLevel: 'Advanced',
    description: 'Shodan, Censys, Certificate Transparency logs (crt.sh), WHOIS historical graphs, and passive DNS mapping.',
    projectsUsingIt: ['TraceHound'],
    iconName: 'Search',
    proficiencyPercent: 89,
  },
  {
    id: 'osint-2',
    name: 'Intelligence Gathering',
    category: 'OSINT',
    experienceLevel: 'Advanced',
    description: 'Public code repository scanning, leaked credential pattern detection, metadata analysis (exiftool), and dark web leak scraping.',
    projectsUsingIt: ['TraceHound'],
    iconName: 'Compass',
    proficiencyPercent: 86,
  },
  {
    id: 'osint-3',
    name: 'Digital Footprinting',
    category: 'OSINT',
    experienceLevel: 'Advanced',
    description: 'Attack surface mapping for organizations, unindexed staging domains, exposed debug endpoints, and S3 permissions audits.',
    projectsUsingIt: ['TraceHound'],
    iconName: 'FileSearch',
    proficiencyPercent: 88,
  },

  // TOOLS
  {
    id: 'tool-1',
    name: 'Nmap',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'SYN scanning, custom NSE Lua script authoring, version detection, firewall evasion, and stealth timing policies.',
    projectsUsingIt: ['TraceHound', 'ShadowCTF'],
    iconName: 'Radio',
    proficiencyPercent: 95,
  },
  {
    id: 'tool-2',
    name: 'Burp Suite Professional',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'HTTP proxying, repeater workflows, intruder payloads, match & replace rules, Autorize plugin, and extension scripting.',
    projectsUsingIt: ['SentinelForge', 'AuthShield'],
    iconName: 'Shield',
    proficiencyPercent: 94,
  },
  {
    id: 'tool-3',
    name: 'Wireshark',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'Capture filter syntax, display filters, protocol dissectors, follow TCP/TLS stream, and VoIP/DNS artifact recovery.',
    projectsUsingIt: ['NetSpecter'],
    iconName: 'Activity',
    proficiencyPercent: 90,
  },
  {
    id: 'tool-4',
    name: 'Metasploit Framework',
    category: 'TOOLS',
    experienceLevel: 'Intermediate',
    description: 'Auxiliary scanning modules, multi-handler configuration, payload staging, post-exploitation enumeration, and meterpreter.',
    projectsUsingIt: ['ShadowCTF'],
    iconName: 'Zap',
    proficiencyPercent: 80,
  },
  {
    id: 'tool-5',
    name: 'Kali Linux',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'Primary penetration testing workstation, toolchain maintenance, custom automation aliases, and secure containerization.',
    projectsUsingIt: ['All Labs'],
    iconName: 'Command',
    proficiencyPercent: 96,
  },
  {
    id: 'tool-6',
    name: 'Gobuster & Ffuf',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'High-speed directory, DNS, and virtual host fuzzing with custom wordlists and status code/regex filtering.',
    projectsUsingIt: ['SentinelForge', 'TraceHound'],
    iconName: 'Search',
    proficiencyPercent: 93,
  },
  {
    id: 'tool-7',
    name: 'Nikto',
    category: 'TOOLS',
    experienceLevel: 'Intermediate',
    description: 'Web server misconfiguration scanning, default file detection, and insecure HTTP banner analysis.',
    projectsUsingIt: ['SentinelForge'],
    iconName: 'FileCheck',
    proficiencyPercent: 82,
  },
  {
    id: 'tool-8',
    name: 'Hashcat & John the Ripper',
    category: 'TOOLS',
    experienceLevel: 'Advanced',
    description: 'Offline password cracking, rule-based mutations, mask attacks, hash format identification, and dictionary tuning.',
    projectsUsingIt: ['ShadowCTF'],
    iconName: 'Key',
    proficiencyPercent: 85,
  },
  {
    id: 'tool-9',
    name: 'Git & GitHub Workflows',
    category: 'TOOLS',
    experienceLevel: 'Expert',
    description: 'Version control, automated security linting (Gitleaks, Semgrep, Trivy) in CI/CD pipelines, and secret detection.',
    projectsUsingIt: ['All Projects'],
    iconName: 'GitBranch',
    proficiencyPercent: 92,
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'SentinelForge - Web App Security Framework',
    slug: 'sentinelforge-web-security-framework',
    shortDescription: 'Modular security auditing engine designed for automated discovery of BOLA, broken access controls, and header misconfigurations in REST APIs.',
    problem: 'Modern microservices often suffer from authorization drift where API endpoints fail to validate object ownership, leaving sensitive client records vulnerable to mass IDOR exploitation.',
    solution: 'Engineered a multi-tenant test framework that parses OpenAPI/Swagger specifications, models user privilege matrices, and fires deterministic permission tests across authenticated roles.',
    technologies: ['Python 3.12', 'AsyncIO', 'HTTPX', 'FastAPI', 'Docker', 'SQLite'],
    securityConcepts: ['BOLA / IDOR Detection', 'RBAC Enforcement', 'JWT Claim Tampering', 'Rate Limit Stressing'],
    githubLink: 'https://github.com/ram-sec/sentinelforge',
    liveDemo: 'https://sentinelforge.ram-sec.demo',
    date: 'Jan 2026',
    status: 'ACTIVE',
    category: 'WEB SECURITY',
    featured: true,
  },
  {
    id: 'proj-2',
    name: 'NetSpecter - eBPF Packet Inspector',
    slug: 'netspecter-ebpf-packet-inspector',
    shortDescription: 'Real-time Linux network anomaly monitor and SYN flood detector utilizing eBPF and XDP drivers for sub-millisecond filtering.',
    problem: 'Traditional userspace packet captures (like raw sockets) induce significant CPU overhead and drop packets under high-throughput DDoS or port scan conditions.',
    solution: 'Implemented an XDP kernel hook program that inspects incoming TCP state flags right at the network interface driver level, flagging stealth scan patterns with minimal CPU impact.',
    technologies: ['C', 'Python (BCC/pyebpf)', 'Linux Kernel', 'Grafana', 'Prometheus'],
    securityConcepts: ['eBPF / XDP', 'SYN Flood Mitigation', 'Stealth Port Scan Detection', 'Kernel Space Filtering'],
    githubLink: 'https://github.com/ram-sec/netspecter',
    date: 'Nov 2025',
    status: 'ACTIVE',
    category: 'NETWORK',
    featured: true,
  },
  {
    id: 'proj-3',
    name: 'TraceHound - Passive OSINT & Recon Correlator',
    slug: 'tracehound-passive-recon-correlator',
    shortDescription: 'High-speed automated reconnaissance suite querying public certificate transparency logs, DNS records, and ASN IP allocations without touching target servers directly.',
    problem: 'Active reconnaissance alerts target blue teams prematurely and risks legal boundaries when scoping target attack surfaces.',
    solution: 'Constructed an asynchronous pipeline that pulls from 18+ passive data providers (crt.sh, AlienVault OTX, HackerTarget, Shodan cache), cross-validates records, and outputs graph visualizations.',
    technologies: ['Python', 'NetworkX', 'Asyncio', 'PostgreSQL', 'Tailwind/React'],
    securityConcepts: ['Passive Reconnaissance', 'Attack Surface Management', 'DNS Topology Mapping', 'OSINT Correlation'],
    githubLink: 'https://github.com/ram-sec/tracehound',
    liveDemo: 'https://tracehound.ram-sec.demo',
    date: 'Aug 2025',
    status: 'COMPLETED',
    category: 'OSINT',
    featured: true,
  },
  {
    id: 'proj-4',
    name: 'KernelGuard - Syscall Anomaly Blocker',
    slug: 'kernelguard-syscall-anomaly-blocker',
    shortDescription: 'Lightweight Linux daemon utilizing seccomp-bpf and auditd triggers to prevent container escape and privilege escalations via anomalous execve calls.',
    problem: 'Malicious actors exploiting container misconfigurations or vulnerable binaries frequently spawn unauthorized shells via `/bin/sh` or `/bin/bash` in read-only containers.',
    solution: 'Designed an execution whitelist policy that binds to container cgroups, intercepts unauthorized syscall branches, and isolates compromised namespaces immediately.',
    technologies: ['Bash', 'C', 'Linux Seccomp', 'Systemd', 'Auditd'],
    securityConcepts: ['Linux Hardening', 'Container Escape Mitigation', 'Syscall Whitelisting', 'Namespace Isolation'],
    githubLink: 'https://github.com/ram-sec/kernelguard',
    date: 'May 2025',
    status: 'RESEARCH',
    category: 'LINUX',
    featured: false,
  },
  {
    id: 'proj-5',
    name: 'AuthShield - MFA Bypass Testbed',
    slug: 'authshield-mfa-bypass-testbed',
    shortDescription: 'Intentionally vulnerable enterprise authentication simulator built for practicing session fixation, OTP race conditions, and OAuth token substitution exploits.',
    problem: 'Security teams frequently misunderstand OAuth 2.0 PKCE and OTP verification pitfalls due to lack of safe, isolated testing environments.',
    solution: 'Built a containerized multi-tier lab featuring 6 distinct authentication flaw scenarios alongside comprehensive mitigation guides and automated audit tests.',
    technologies: ['TypeScript', 'Node.js', 'Redis', 'Docker Compose', 'Tailwind CSS'],
    securityConcepts: ['OAuth 2.0 Security', 'MFA Race Conditions', 'Session Fixation', 'JWT None-Algorithm Exploit'],
    githubLink: 'https://github.com/ram-sec/authshield-lab',
    liveDemo: 'https://authshield.ram-sec.demo',
    date: 'Mar 2025',
    status: 'COMPLETED',
    category: 'WEB SECURITY',
    featured: false,
  },
  {
    id: 'proj-6',
    name: 'ShadowCTF - Dockerized Training Arena',
    slug: 'shadowctf-docker-training-arena',
    shortDescription: 'Reproducible Capture The Flag lab environment with orchestrated vulnerable Linux boxes and flag submission verification engine.',
    problem: 'Setting up isolated local CTF environments often breaks local host networking or risks inadvertent vulnerability leakage to local LAN networks.',
    solution: 'Created an automated Docker-in-Docker isolated network topology with automated scoreboards, dynamic flag generation, and instant container resets.',
    technologies: ['Python', 'Docker', 'Flask', 'SQLite', 'Bash'],
    securityConcepts: ['CTF Architecture', 'Privilege Escalation Paths', 'Network Sandboxing', 'Flag Integrity'],
    githubLink: 'https://github.com/ram-sec/shadowctf',
    date: 'Dec 2024',
    status: 'ARCHIVED',
    category: 'RESEARCH',
    featured: false,
  },
];

export const initialWriteUps: WriteUp[] = [
  {
    id: 'wu-1',
    title: 'Deconstructing Broken Object Level Authorization (BOLA) in Modern APIs',
    slug: 'deconstructing-broken-object-level-authorization-bola-apis',
    excerpt: 'An in-depth security analysis of why BOLA remains the #1 vulnerability in the OWASP API Security Top 10, how privilege boundaries crumble, and practical prevention with context-aware access controls.',
    author: 'Ram',
    date: 'Feb 18, 2026',
    readingTime: '9 min read',
    difficulty: 'ADVANCED',
    category: 'Web Security',
    tags: ['BOLA', 'API Security', 'OWASP Top 10', 'Authorization', 'IDOR'],
    featured: true,
    published: true,
    views: 1420,
    references: [
      'OWASP API Security Project 2023 - API1:2023 Broken Object Level Authorization',
      'RFC 6749: The OAuth 2.0 Authorization Framework',
      'NIST SP 800-162: Guide to Attribute Based Access Control (ABAC)',
    ],
    content: `
### Overview

Broken Object Level Authorization (BOLA), historically known as Insecure Direct Object Reference (IDOR), consistently dominates vulnerability statistics across modern API ecosystems. At its root, BOLA occurs when an endpoint receives an object identifier (e.g., \`/api/v1/invoices/9481\`) from the client and retrieves the record directly without verifying whether the authenticated user possesses legitimate authorization to access that specific entity.

In monolithic architectures with server-rendered HTML, authorization checks were frequently bundled into page controllers. In API-first decoupled microservice architectures, however, developers often mistake **Authentication** (who the user is) for **Authorization** (what the user is permitted to do).

\`\`\`http
GET /api/v2/users/1042/billing-profile HTTP/1.1
Host: api.target-corp.internal
Authorization: Bearer eyJhbGciOiJIUzI1Ni... (Valid token for User #8812)
\`\`\`

If the backend queries \`SELECT * FROM billing_profiles WHERE user_id = 1042\` without asserting that the token subject matches \`1042\` or belongs to an authorized organization context, User #8812 successfully exfiltrates User #1042's financial data.

---

### Root Causes in Production Code

Through our audits of over 40 enterprise endpoints, three architectural anti-patterns account for 85% of BOLA occurrences:

1. **Sequential / Predictable Integer Identifiers:** Auto-incrementing primary keys make enumeration trivial via simple loop scripts.
2. **Missing Repository Scope Guards:** Querying database entities by entity ID alone rather than composite keys bounded by tenant ID.
3. **Implicit Trust in Gateway Decoders:** Microservices assuming that if a request passed the API Gateway, authorization has already been evaluated.

#### Vulnerable Implementation Pattern (Python / FastAPI)

\`\`\`python
# VULNERABLE: Direct access without ownership validation
@router.get("/documents/{document_id}")
async def get_document(
    document_id: str, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
\`\`\`

#### Hardened Implementation with Scope Scrutiny

\`\`\`python
# HARDENED: Scoped query asserting ownership or explicit delegation
@router.get("/documents/{document_id}")
async def get_document(
    document_id: str, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == document_id,
        (Document.owner_id == current_user.id) | 
        (Document.org_id == current_user.org_id & Document.is_public == True)
    ).first()
    
    if not doc:
        # Return 404 rather than 403 to prevent ID existence leakage
        raise HTTPException(status_code=404, detail="Resource not found")
    
    log_audit_access(actor=current_user.id, target=document_id, action="READ")
    return doc
\`\`\`

---

### Verification and Automated Testing

Security teams must not rely solely on manual testing. Automated contract tests must be built into continuous integration. By maintaining test fixture matrices containing at least two distinct user accounts (User A and User B) across separate test tenants:

\`\`\`bash
# Automated BOLA regression test run
$ pytest tests/security/test_bola.py -v
tests/security/test_bola.py::test_user_a_cannot_read_user_b_invoices PASSED [ 50%]
tests/security/test_bola.py::test_user_b_cannot_update_user_a_settings PASSED [100%]
\`\`\`

### Defensive Key Takeaways

- Use cryptographically random identifiers (UUIDv4 or ULID) to eliminate guessability, though recognize that random IDs do not replace authorization checks.
- Enforce authorization in the data access layer (e.g., multi-tenant row-level security in PostgreSQL).
- Audit all mutating (\`PUT\`, \`PATCH\`, \`DELETE\`) endpoints where IDs reside in request bodies.
`,
  },
  {
    id: 'wu-2',
    title: 'Linux Kernel Hardening: From Auditd Telemetry to SecComp Enforcing',
    slug: 'linux-kernel-hardening-auditd-seccomp-enforcing',
    excerpt: 'A practical guide to locking down Linux server environments using syscall restrictions, proactive auditd rules, sysctl memory protections, and custom SecComp profiles.',
    author: 'Ram',
    date: 'Jan 28, 2026',
    readingTime: '11 min read',
    difficulty: 'ELITE',
    category: 'Linux',
    tags: ['Linux', 'Kernel', 'Hardening', 'SecComp', 'Syscall', 'Defensive Security'],
    featured: true,
    published: true,
    views: 980,
    references: [
      'Linux Kernel Documentation: Documentation/userspace-api/seccomp_filter.rst',
      'CIS Linux Benchmark v2.1.0',
      'Red Hat Security Guide: System Auditing with auditd',
    ],
    content: `
### Defensive Architecture Strategy

A production Linux host running exposed network services presents hundreds of system calls to userspace processes. Many of these syscalls (\`ptrace\`, \`process_vm_readv\`, \`bpf\`, \`userfaultfd\`) are prime targets for local privilege escalation (LPE) exploits when an unprivileged service is compromised.

Defense-in-depth requires a layered baseline:

1. **Kernel Sysctl Hardening**: Restrict unprivileged eBPF, ASLR randomization, and dmesg visibility.
2. **Audit Subsystem Telemetry**: Monitor unauthorized execution attempts in real-time.
3. **Syscall Filtering with SecComp**: Whitelist only the explicit syscalls required by the daemon.

---

### 1. Essential Sysctl Hardening Configuration

Place these directives inside \`/etc/sysctl.d/99-security-hardening.conf\`:

\`\`\`ini
# Prevent unprivileged users from loading eBPF programs
kernel.unprivileged_bpf_disabled = 1

# Disable unprivileged user namespaces if not required for rootless containers
kernel.unprivileged_userns_clone = 0

# Restrict dmesg output to root only
kernel.dmesg_restrict = 1

# Restrict ptrace scope to prevent memory scraping of sibling processes
kernel.yama.ptrace_scope = 2

# Enforce strict ASLR memory mapping randomization
kernel.randomize_va_space = 2

# Prevent core dumps from suid binaries leaking memory credentials
fs.suid_dumpable = 0

# Protect symlink and hardlink exploitation
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
\`\`\`

Apply immediately with:

\`\`\`bash
ram@sec:~$ sudo sysctl -p /etc/sysctl.d/99-security-hardening.conf
kernel.unprivileged_bpf_disabled = 1
kernel.yama.ptrace_scope = 2
kernel.randomize_va_space = 2
\`\`\`

---

### 2. Crafting SecComp-BPF Whitelists

SecComp allows a process to enter a one-way restrictive state where invoking an unapproved syscall results in immediate termination (\`SIGKILL\`) or error delivery (\`EPERM\`).

\`\`\`c
#include <seccomp.h>
#include <unistd.h>
#include <stdio.h>

void enforce_minimal_sandbox() {
    scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_KILL); // Default to KILL
    
    // Whitelist mandatory system calls
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(read), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(write), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit_group), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(nanosleep), 0);
    
    seccomp_load(ctx);
    seccomp_release(ctx);
}
\`\`\`

When a worker daemon triggers an unexpected \`execve\` or \`fork\`, the kernel terminates the execution vector instantly before shellcode can detonate.
`,
  },
  {
    id: 'wu-3',
    title: 'Deep Dive into TCP SYN Flood Mechanics & eBPF XDP Mitigation',
    slug: 'deep-dive-tcp-syn-flood-ebpf-xdp-mitigation',
    excerpt: 'Understanding the state transition bottlenecks in the Linux TCP/IP stack during SYN flood floods, and implementing line-rate packet drops via eBPF XDP.',
    author: 'Ram',
    date: 'Dec 14, 2025',
    readingTime: '8 min read',
    difficulty: 'ADVANCED',
    category: 'Networking',
    tags: ['TCP/IP', 'eBPF', 'XDP', 'DDoS', 'Networking', 'SYN Flood'],
    featured: false,
    published: true,
    views: 740,
    references: [
      'RFC 4987: TCP SYN Flooding Attacks and Common Mitigations',
      'The eBPF Foundation: XDP (eXpress Data Path) Architecture',
    ],
    content: `
### The Asymmetry of the TCP 3-Way Handshake

In standard TCP connection establishment:
1. Client transmits \`SYN\` with an Initial Sequence Number (ISN).
2. Server allocates a Transmission Control Block (TCB) in memory and enters \`SYN-RECEIVED\` state, replying with \`SYN-ACK\`.
3. Client finishes handshake with \`ACK\`.

During a SYN flood attack, the adversary transmits thousands of forged \`SYN\` packets per second with spoofed source IPs. Because the server never receives the finishing \`ACK\`, the half-open connection table (\`syn_backlog\`) rapidly exhausts available memory, causing connection drops for legitimate clients.

\`\`\`
Client (Attacker)                   Server (Target)
       |                                   |
       | -------- SYN (Spoofed IP) ------> | [TCB Allocated in Backlog]
       | <------- SYN-ACK ---------------- | (Waiting for ACK timeout...)
       |        [No ACK Sent]              |
       |                                   | (Backlog fills -> DOS)
\`\`\`

### Traditional Defense: SYN Cookies

Linux offers built-in SYN Cookies via:

\`\`\`bash
sudo sysctl -w net.ipv4.tcp_syncookies=1
\`\`\`

Instead of storing state in memory, the server encodes the connection parameters into the 32-bit Sequence Number sent in the \`SYN-ACK\`. However, while this saves memory, the network stack still wastes thousands of CPU cycles traversing the full kernel network buffer (\`sk_buff\`).

---

### Next-Gen Mitigation with eBPF and XDP

eXpress Data Path (XDP) runs safe bytecode directly within the network interface card (NIC) driver before the Linux kernel allocates an \`sk_buff\`. This enables line-rate packet dropping with zero kernel stack overhead.

\`\`\`c
SEC("xdp")
int filter_syn_flood(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    
    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;
        
    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return XDP_PASS;
        
    struct iphdr *ip = (void *)(eth + 1);
    if ((void *)(ip + 1) > data_end)
        return XDP_PASS;
        
    if (ip->protocol != IPPROTO_TCP)
        return XDP_PASS;
        
    struct tcphdr *tcp = (void *)ip + (ip->ihl * 4);
    if ((void *)(tcp + 1) > data_end)
        return XDP_PASS;
        
    // Rate check on SYN flags
    if (tcp->syn && !tcp->ack) {
        // Drop suspicious flood threshold
        if (is_rate_exceeded(ip->saddr)) {
            return XDP_DROP;
        }
    }
    
    return XDP_PASS;
}
\`\`\`

This drops attack frames in hardware/driver space, processing up to 14 million packets per second on commodity server hardware.
`,
  },
  {
    id: 'wu-4',
    title: 'Passive OSINT: Mapping Corporate Cloud Attack Surfaces Without Alarms',
    slug: 'passive-osint-mapping-cloud-attack-surfaces',
    excerpt: 'Techniques for uncovering unindexed staging domains, leaky object storage buckets, and public API keys without sending a single probe to target servers.',
    author: 'Ram',
    date: 'Nov 02, 2025',
    readingTime: '7 min read',
    difficulty: 'INTERMEDIATE',
    category: 'OSINT',
    tags: ['OSINT', 'Reconnaissance', 'Cloud Security', 'Attack Surface'],
    featured: false,
    published: true,
    views: 890,
    references: [
      'Certificate Transparency (RFC 6962)',
      'SANS Institute: Open Source Intelligence Gathering Guidelines',
    ],
    content: `
### Why Passive Reconnaissance Matters

When conducting authorized security assessments, sending active scans (like mass Nmap sweeps or aggressive directory fuzzers) alerts SOC engineers and web application firewalls (WAFs). Passive OSINT gathers vital intelligence purely through third-party repositories and historical indexes.

---

### 1. Certificate Transparency (CT) Stream Sniffing

Every public SSL/TLS certificate issued by an authorized Certificate Authority must be logged to a public, append-only Certificate Transparency log. Whenever developers request a TLS cert for \`staging-api.prod.target.com\`, the domain name is logged publicly within minutes.

We can query crt.sh passively using Python:

\`\`\`python
import requests

def harvest_subdomains(domain: str) -> set:
    url = f"https://crt.sh/?q=%.{domain}&output=json"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    subdomains = set()
    if resp.status_code == 200:
        for entry in resp.json():
            name_value = entry.get("name_value", "")
            for sub in name_value.split("\\n"):
                if domain in sub:
                    subdomains.add(sub.strip().lower())
    return subdomains
\`\`\`

### 2. Leaked Git Artifacts and Staging S3 Buckets

Developers often push temporary commit records or staging configurations containing credentials to public branches. Utilizing tools like \`gitleaks\` against historical repository commits routinely recovers active test keys and internal VPN endpoints.
`,
  },
  {
    id: 'wu-5',
    title: 'Privilege Escalation via SUID and Misconfigured Sudo Capabilities',
    slug: 'privilege-escalation-suid-misconfigured-sudo-capabilities',
    excerpt: 'Detailed analysis of Linux permission vulnerabilities, abusing GTFOBins binaries with setuid bits, and exploiting POSIX file capabilities like cap_setuid.',
    author: 'Ram',
    date: 'Sep 19, 2025',
    readingTime: '6 min read',
    difficulty: 'INTERMEDIATE',
    category: 'Defensive Security',
    tags: ['Linux', 'Privilege Escalation', 'SUID', 'Capabilities', 'CTF'],
    featured: false,
    published: true,
    views: 620,
    references: [
      'GTFOBins Curated Unix Binaries',
      'Linux Man Pages: capabilities(7)',
    ],
    content: `
### Understanding SUID and Linux Capabilities

In traditional Linux, executable files marked with the SetUID (\`chmod u+s\`) bit execute with the privileges of the file owner (frequently \`root\`), rather than the invoking user.

To find all SUID binaries on a host:

\`\`\`bash
find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null
\`\`\`

If standard utility binaries like \`find\`, \`vim\`, \`bash\`, or \`python\` have been assigned SUID, privilege escalation is instantaneous:

\`\`\`bash
# If python3 has SUID:
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
\`\`\`

### Auditing POSIX Capabilities

Modern Linux systems decouple root privileges using Linux capabilities. For instance, rather than making a packet capture tool full SUID root, administrators can assign only network capture capabilities:

\`\`\`bash
sudo setcap cap_net_raw,cap_net_admin+ep /usr/bin/dumpcap
\`\`\`

However, if an administrator inadvertently grants \`cap_setuid+ep\` to an interpreter like \`python3\`, an unprivileged user can trivially elevate to root without needing sudo.

**Remediation Rule:** Always audit setcap and SUID binaries in your CI host provisioning scripts, stripping unnecessary capabilities before deploying to production.
`,
  },
];

export const initialDailyLogs: DailyLog[] = [
  {
    id: 'log-1',
    date: '09 SEP 2026',
    title: 'Testing OAuth 2.0 PKCE & Token Downgrade Vectors',
    workedOn: 'Audited RFC 7636 (PKCE) implementations across microservices. Tested code_challenge validation behaviors when authorization codes are exchanged without code_verifier parameter.',
    learned: 'Discovered that several OAuth libraries fall back silently to non-PKCE flow when the verifier is omitted if the client registration was marked "public" without strict enforcement flag.',
    failed: 'Attempted to bypass state token mismatch check using multi-threaded race conditions, but backend session lock successfully serialized authorization requests.',
    willTryNext: 'Examine Refresh Token Rotation (RTR) mechanics and test whether revoking a parent token invalidates compromised sibling refresh sessions.',
    tags: ['OAuth', 'Authentication', 'Web Security', 'PKCE'],
  },
  {
    id: 'log-2',
    date: '02 SEP 2026',
    title: 'eBPF Kernel Probes & Anomaly Metrics',
    workedOn: 'Iterated on NetSpecter packet hook program. Added BPF hash map tables to track SYN packet velocity grouped by /24 subnet blocks instead of individual /32 IPs.',
    learned: 'Using LPM (Longest Prefix Match) trie map in BPF kernel space drastically accelerates IP subnet lookups compared to naive hash iteration.',
    failed: 'Hit BPF verifier rejection: "R1 invalid mem access \'inv\'". The verifier could not guarantee packet pointer boundaries before reading IP header options.',
    willTryNext: 'Refactor pointer boundary bounds checks right before struct dereferencing to satisfy the kernel static verifier.',
    tags: ['eBPF', 'Linux', 'Kernel', 'Networking'],
  },
  {
    id: 'log-3',
    date: '24 AUG 2026',
    title: 'BOLA Scanner Dynamic Heuristics in SentinelForge',
    workedOn: 'Wrote an automated fuzzing module that extracts entity IDs from response payloads and automatically attempts cross-tenant substitution on subsequent requests.',
    learned: 'Response headers like ETag or Location often leak newly created resource IDs that never appeared in the request body.',
    failed: 'False positives were triggered on shared public lookup tables (country codes, currency tables) because they return 200 OK for all users.',
    willTryNext: 'Add a baseline entropy and uniqueness filter to differentiate multi-tenant entities from static lookup tables.',
    tags: ['Python', 'API Security', 'Automation', 'BOLA'],
  },
  {
    id: 'log-4',
    date: '15 AUG 2026',
    title: 'Linux Container Escape Hardening Research',
    workedOn: 'Tested Docker container environments with privileged mode enabled to document exact privilege escalation vectors via `/dev` host block device mounting.',
    learned: 'Even without root privileges inside the container, if `--cap-add=SYS_ADMIN` is passed, cgroups release_agent technique provides near-instant host root execution.',
    failed: 'SecComp filter test caused Docker daemon startup failure due to syntax error in custom JSON profile schema.',
    willTryNext: 'Build a validation CLI to lint SecComp JSON profiles before deploying to container orchestrator.',
    tags: ['Docker', 'Linux', 'Privilege Escalation', 'Hardening'],
  },
  {
    id: 'log-5',
    date: '04 AUG 2026',
    title: 'Passive DNS & Subdomain Enumeration Speedup',
    workedOn: 'Benchmarked asynchronous DNS resolution with Python aiodns versus dnspython on a list of 50,000 candidate subdomains.',
    learned: 'A single AsyncIO thread with aiodns and custom resolver pools can resolve 12,000 records per minute without tripping provider rate limits.',
    failed: 'Public recursive resolvers (8.8.8.8 and 1.1.1.1) began throttling UDP queries after 5,000 rapid requests.',
    willTryNext: 'Implement a round-robin rotation pool across 25 verified public DNS recursive servers with adaptive backoff.',
    tags: ['DNS', 'OSINT', 'Python', 'Networking'],
  },
];

export const initialTimeline: TimelineItem[] = [
  {
    id: 'time-1',
    year: '2024',
    title: 'Started Security Journey & Core Foundations',
    subtitle: 'Linux, Networking & Python Scripting',
    description: 'Transitioned deep focus into offensive and defensive cybersecurity. Built foundational mastery in Linux administration, TCP/IP protocol internals, Python security automation, and fundamental web exploitation methodologies.',
    tags: ['Linux Basics', 'Networking', 'Python', 'Bash'],
  },
  {
    id: 'time-2',
    year: '2025',
    title: 'Web Application Security & Systems Hardening',
    subtitle: 'Hands-on Labs, CTFs & Custom Tools',
    description: 'Deepened research into OWASP API vulnerabilities, containerized CTF challenges, Linux kernel syscall auditing with SecComp, and developed custom automation tools (TraceHound, SentinelForge prototype).',
    tags: ['Web Security', 'Burp Suite', 'Kernel Hardening', 'API Security'],
  },
  {
    id: 'time-3',
    year: '2026',
    title: 'Advanced Research, Kernel eBPF & Security Engineering',
    subtitle: 'High-Performance Security Tools & Active Research',
    description: 'Engineering production-grade security tooling (NetSpecter, SentinelForge), exploring eBPF XDP network defense, publishing vulnerability teardowns, and preparing for industry-standard offensive security certifications.',
    tags: ['eBPF / XDP', 'Research Papers', 'OSINT Engineering', 'Open Source'],
  },
];

export const initialCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    title: 'CompTIA Security+',
    issuer: 'CompTIA',
    status: 'VERIFIED',
    date: '2025',
    credentialId: 'SEC-PLUS-77491-VERIFIED',
    credentialUrl: 'https://www.comptia.org/certifications/security',
  },
  {
    id: 'cert-2',
    title: 'Certified Red Team Professional (CRTP)',
    issuer: 'Altered Security',
    status: 'IN PROGRESS',
    date: 'Target Q3 2026',
    credentialId: 'Lab Progress 75%',
  },
  {
    id: 'cert-3',
    title: 'Offensive Security Certified Professional (OSCP)',
    issuer: 'OffSec',
    status: 'PLANNED',
    date: 'Target Late 2026',
    credentialId: 'Preparation in Progress',
  },
];

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology (Computer Science & Engineering)',
    institution: 'University Engineering College',
    period: '2022 - 2026',
    highlights: [
      'Focus areas: Operating Systems, Computer Networks, Database Internals, Cryptography & Network Security',
      'Lead organizer for campus Cybersecurity Lab workshops and Capture The Flag events',
      'Undergraduate research capstone: Automated detection of access control flaws in modern microservices',
    ],
  },
];

export const initialLabExperiments: LabExperiment[] = [
  {
    id: 'exp-1',
    title: 'HTTP Security Headers & CORS Policy Auditor',
    category: 'Web Security',
    difficulty: 'Beginner',
    status: 'Active',
    summary: 'Evaluate critical defense-in-depth HTTP response headers including Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, and CORS configurations.',
    environment: 'Simulated HTTP Request / Response Inspector Engine',
    toolsUsed: ['HTTP Parser', 'Header Inspector', 'CSP Validator'],
    findings: 'Missing CSP and permissive Access-Control-Allow-Origin: * on authenticated endpoints permit Cross-Origin Data Exfiltration and DOM-based Clickjacking.',
    authorizedDisclaimer: 'This content is for authorized labs and educational environments only.',
  },
  {
    id: 'exp-2',
    title: 'Cryptographic Hash Identifier & Payload Inspector',
    category: 'Forensics',
    difficulty: 'Beginner',
    status: 'Active',
    summary: 'Identify unknown cipher signatures, message digest algorithms (MD5, SHA-1, SHA-256, bcrypt), and decode multi-layered Base64 / Hex / URL payloads safely.',
    environment: 'Offline Forensic Parsing Sandbox',
    toolsUsed: ['Hash Identification Engine', 'Payload Decoder', 'Entropy Calculator'],
    findings: 'Distinguishing legacy unsalted hashes from modern memory-hard key derivation functions (Argon2, bcrypt) is crucial when assessing stored credential risk.',
    authorizedDisclaimer: 'This content is for authorized labs and educational environments only.',
  },
  {
    id: 'exp-3',
    title: 'Subnet & CIDR Netmask Architectural Calculator',
    category: 'Network',
    difficulty: 'Intermediate',
    status: 'Active',
    summary: 'Calculate usable host bounds, broadcast addresses, subnet masks, and wildcard bits to verify network segmentation and firewall rule coverage.',
    environment: 'Network Topology Design Workbench',
    toolsUsed: ['CIDR Math Engine', 'Binary Netmask Dissector'],
    findings: 'Overly permissive subnet masks (/16 where /24 was intended) frequently expose internal management interfaces across adjacent tenant boundaries.',
    authorizedDisclaimer: 'This content is for authorized labs and educational environments only.',
  },
  {
    id: 'exp-4',
    title: 'JWT Claim Analyzer & Common Vulnerability Tester',
    category: 'Web Security',
    difficulty: 'Intermediate',
    status: 'Active',
    summary: 'Inspect JSON Web Token headers, payloads, signature verification status, and flag common structural flaws (e.g., none algorithm, expired timestamp tolerance, weak HMAC).',
    environment: 'Client-side Isolated Token Verifier',
    toolsUsed: ['JWT Parser', 'Claims Inspector', 'Signature Flag Engine'],
    findings: 'Token verification libraries that accept alg: none or permit HMAC verification using the public key string allow total authentication forgery.',
    authorizedDisclaimer: 'This content is for authorized labs and educational environments only.',
  },
];

export const initialUser: User = {
  id: 'user-ram-admin',
  name: 'Ram',
  username: 'ram',
  email: 'ram.security@proton.me',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  joinedDate: 'Jan 2024',
  savedArticles: ['wu-1', 'wu-2'],
};

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-09-09 07:15:22 UTC',
    action: 'SYSTEM_BOOT',
    actor: 'kernel',
    severity: 'INFO',
    details: 'RAM.SEC security console initialized. Status: OPERATIONAL. Threat level: LOW.',
  },
  {
    id: 'audit-2',
    timestamp: '2026-09-09 07:16:04 UTC',
    action: 'ADMIN_AUTHENTICATED',
    actor: 'ram@sec',
    severity: 'INFO',
    details: 'Session established via local cryptographic challenge token.',
  },
  {
    id: 'audit-3',
    timestamp: '2026-09-09 07:22:11 UTC',
    action: 'PROBE_CHECK',
    actor: 'daemon.auditd',
    severity: 'INFO',
    details: 'Network telemetry probes active. 0 ingress anomalies detected.',
  },
];
