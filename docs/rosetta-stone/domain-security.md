# Rosetta Stone — Domain 5: Security/Auth

## Layer 0 Reference: docs/LAYER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS security?

**Candidate Constant:** Controlling who can access what, proving identity, and protecting information from unauthorized use.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what is being secured, the system controls access, verifies identity, and protects data. |
| CTB | PASS | From wax seals to JWT tokens — the definition holds at every level. |
| Circle | PASS | Breach found → patch vulnerability → verify fix → hardened. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**11 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Authentication | Proving you are who you claim to be | PASS | PASS | PASS | LOCKED |
| 2 | Authorization | Determining what an authenticated identity is permitted to do | PASS | PASS | PASS | LOCKED |
| 3 | Token | A portable proof of authenticated identity | PASS | PASS | PASS | LOCKED |
| 4 | Encryption | Transforming data so only authorized parties can read it | PASS | PASS | PASS | LOCKED |
| 5 | Hashing | Creating a fixed-size fingerprint of data that cannot be reversed | PASS | PASS | PASS | LOCKED |
| 6 | Session | A bounded period of authenticated access | PASS | PASS | PASS | LOCKED |
| 7 | Permissions | Named capabilities assigned to identities or roles | PASS | PASS | PASS | LOCKED |
| 8 | Secrets Management | Secure storage and controlled access to sensitive credentials | PASS | PASS | PASS | LOCKED |
| 9 | RBAC | Assigning permissions through roles rather than directly to identities | PASS | PASS | PASS | LOCKED |
| 10 | Delegated Auth | One system trusting another system's identity verification | PASS | PASS | PASS | LOCKED |
| 11 | MFA | Requiring multiple independent proofs of identity | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every security operation follows IMO:
- **Input:** Identity claim + credentials presented
- **Middle:** System verifies claim, checks permissions, grants/denies
- **Output:** Access granted with scope, or access denied with reason

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every security system organizes as CTB:
- **Trunk:** The security boundary (the perimeter)
- **Branches:** Authentication layer, authorization layer, encryption layer
- **Leaves:** Individual policies, keys, tokens, sessions

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | Cloudflare Access | JWT | OAuth 2.0 | Wax Seals (Historical) | Signet Rings (Historical) | Cipher Machines (Historical) |
|-------------|------------------|-----|-----------|----------------------|--------------------------|----------------------------|
| Authentication | CF Access login flow | JWT signature verification | Authorization code exchange | Recognizing the seal | Recognizing the ring impression | Knowing the key setting |
| Authorization | Access policies (allow/deny) | Claims in payload (roles, scopes) | Scopes (read, write, admin) | Seal type indicates authority level | Ring owner's known authority | Clearance level for cipher |
| Token | CF Access JWT | JWT string (header.payload.signature) | Access token + refresh token | The sealed document itself | The wax impression | The encoded message |
| Encryption | TLS 1.3 (transit) + WARP | N/A (signing, not encrypting) | TLS for transport | Sealed container | N/A (identity only, not secrecy) | Enigma/cipher transformation |
| Hashing | Password hash at IdP | Signature = HMAC-SHA256 | PKCE code_challenge = SHA256 | N/A | N/A | N/A (encryption, not hashing) |
| Session | CF Access session cookie | Token expiry (exp claim) | Access token lifetime + refresh | Duration of sealed order | Duration of delegation | Duration of key validity |
| Permissions | Policy rules (email, group, IP) | Custom claims (admin: true) | Scopes (profile, email, openid) | Seal grants specific authority | Ring grants owner's full authority | Clearance determines access |
| Secrets Management | CF environment variables / secrets | JWT signing key (HMAC secret or RSA key) | Client secret, signing keys | Seal die kept in treasury | Ring kept on person | Key book kept in secure room |
| RBAC | Access groups → policies | Role claim → route middleware | Scopes mapped to roles at provider | Court hierarchy (king → lord → knight) | Feudal delegation chain | Military rank = clearance |
| Delegated Auth | IdP integration (Google, GitHub, SAML) | Trusted issuer (iss claim) | Authorization server delegation | One lord's seal honored by another | Regent acting with king's ring | Allied cipher sharing |
| MFA | CF Access + TOTP/WebAuthn via IdP | N/A (handled at auth layer) | Step-up authentication | Seal + verbal password | Ring + countersign | Key setting + daily code word |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Breach Circle | Unauthorized access detected → revoke tokens/rotate keys → re-verify → hardened | YES — from key rotation to changing seals after theft |
| Expiry Circle | Token/session expires → re-authenticate → new token issued | YES — from JWT refresh to seal renewal |
| Audit Circle | Access logs reviewed → anomalies found → policies tightened | YES — from security logs to court records |
| Escalation Circle | Insufficient permissions → request elevated access → approval flow → granted/denied | YES — from RBAC escalation to petitioning authority |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Token format | JWT vs opaque token vs SAML assertion vs wax impression |
| Encryption algorithm | AES-256 vs RSA vs ChaCha20 vs physical cipher wheel |
| Auth flow | Authorization code vs implicit vs client credentials vs in-person |
| Session storage | Cookie vs localStorage vs server-side vs physical object |
| Key management platform | CF secrets vs Doppler vs AWS KMS vs physical treasury |

**Variable count:** 5 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 11 root concepts + 3 structural + 4 circles = 18 |
| Variables isolated | 5 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from signet rings to OAuth 2.0 |