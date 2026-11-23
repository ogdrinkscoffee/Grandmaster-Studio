# Security Specification & Dirty Dozen Adversarial Payloads

## 1. Data Invariants
1. **Strict PII Isolation**: `email` and legal consent logs are stored solely in `/usersPrivate/{userId}` and readable/writable only by `request.auth.uid == userId`. `/playersPublic/{userId}` never stores email or PII.
2. **Age Gate Enforcement**: Creating `/usersPrivate/{userId}` requires `ageConfirmed == true`, `email_verified == true`, and server timestamps (`request.time`) for `acceptedTermsAt`, `createdAt`, and `updatedAt`.
3. **Classic Variant Lock**: All online matches in `/onlineMatches/{matchId}` strictly require `variant == 'standard'`. Variant games are blocked at the security rules boundary.
4. **Immutable Creator & Server Timestamps**: `creatorId` and `createdAt` cannot be modified after creation. `updatedAt` and `lastMoveAt` must match `request.time`.
5. **Participant Authorization & Terminal State Locking**: Only `whiteUid` or `blackUid` of an `active` match may play moves, respond to draw/takeback offers, or finish the match. Once `status == 'finished'` or `'cancelled'`, outcomes (`winner`, `result`, `reason`, `fen`, `pgn`) are permanently locked (only `rematchMatchId` may be linked once by a match participant).
6. **Master Gate on Subcollections**: `/onlineMatches/{matchId}/chat/{messageId}` requires parent match membership (`whiteUid` or `blackUid`) via `get()` on `create`/`get` and resource-bound ownership check on `list`.

## 2. The "Dirty Dozen" Payloads (Expected Result: `PERMISSION_DENIED`)
1. **Unverified / Unauthenticated Create**: Creating `/usersPrivate/u1` with `request.auth == null` or `email_verified: false`.
2. **Underage Bypass**: Creating `/usersPrivate/u1` with `ageConfirmed: false`.
3. **UID Spoofing**: Creating `/playersPublic/victim` while signed in as `attacker` (`uid: 'victim'`).
4. **PII Leak Read**: Reading `/usersPrivate/victim` while signed in as `attacker`.
5. **Non-Classic Variant Injection**: Creating `/onlineMatches/m1` with `variant: 'atomic'` or `variant: 'chaturanga'`.
6. **Ghost Field / Shadow Update**: Creating `/onlineMatches/m1` with extra field `isAdmin: true`.
7. **Oversized Path ID Poisoning**: Targeting `/onlineMatches/` with a 300-character ID or invalid characters (`../bad`).
8. **Pre-Completed Match Fraud**: Creating `/onlineMatches/m1` with `status: 'finished'`, `winner: 'w'`, `result: '1-0'`.
9. **Client Timestamp Forgery**: Creating `/onlineMatches/m1` with backdated `createdAt` (`!== request.time`).
10. **Third-Party Match Hijack**: Updating an `'active'` match (`fen`, `turn`) as a bystander who is neither `whiteUid` nor `blackUid`.
11. **Terminal State Outcome Tampering**: Updating `winner` or `result` on a match whose existing `status == 'finished'`.
12. **Cross-Match Chat Injection**: Creating a chat message in `/onlineMatches/m1/chat/c1` from a user who is not `whiteUid` or `blackUid` of `m1`.
