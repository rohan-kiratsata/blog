# X (Twitter) Algorithm Reference — For Tweet/Content Generation

Compiled from X's open-sourced algorithm. Note: the 2023 repo (github.com/twitter/the-algorithm) is dead. X open-sourced a new algorithm on Jan 20, 2026 at github.com/xai-org/x-algorithm, powered by Grok's transformer architecture (the "Phoenix ranker"), updated every 4 weeks. A May 15, 2026 update added the Grox content-understanding system. Use this as the current source of truth, not the old Scala repo.

---

## Stage 1: Candidate Selection

From 500M+ daily tweets, the algorithm picks ~1,500 candidate tweets per feed refresh for a user.

- 50% from people you follow (ranked by how often you interact with them)
- 50% from people you don't follow (out-of-network, sourced via three systems below)

### Out-of-Network Sourcing (the 50% that matters for growth)

**1. Social Graph Traversal**
The algo asks: what did people you follow recently engage with, and who likes the same tweets as you. If a high-influence account you follow engages with a tweet from someone you don't follow, that tweet can surface in your feed. Implication: replies/engagement from high-influence niche accounts puts your content into THEIR followers' feeds directly.

**2. SimClusters**
X groups all users into ~145,000 virtual communities via matrix factorization, recalculated every 3 weeks. Community placement is driven by who you follow, who you engage with, what you like/reply/retweet, and what your own tweets cover. Heavy engagement from one community surfaces your tweet to others in that community even without a follow. Implication: niche consistency is a hard requirement — mixing topics dilutes your SimCluster placement and confuses distribution.

**3. TwHIN (Heterogeneous Information Network)**
A 1.5B-node graph creating 128-dimensional vector embeddings for users and tweets in shared space, used to calculate similarity between any user-user, tweet-tweet, or user-tweet pair. Implication: consistent niche content + genuine engagement from niche-relevant accounts = tighter embedding = more accurate out-of-network reach.

---

## Stage 2: Heavy Ranker (Scoring Engine)

Each of the ~1,500 candidates is scored by a neural network (originally a 48M-parameter MaskNet, replaced by a Grok-powered transformer as of Jan 2026). It predicts 10 engagement probabilities per tweet:

1. Like
2. Retweet
3. Reply
4. Click to expand
5. Click author profile
6. Click a link
7. Watch video
8. Spend 2+ min in thread
9. Report
10. Block

Each probability × weight, summed = final score.

### Engagement Weights

```
SIGNAL                                              WEIGHT
─────────────────────────────────────────────────────────────
Reply that gets engaged by tweet author              +75.0
Reply to tweet                                       +13.5
Profile visit → like or reply to author's tweet      +12.0
Click into conversation → reply or like               +11.0
Dwell in conversation 2+ minutes                      +10.0
Retweet                                                +1.0
Like (favorite)                                        +0.5
Video 50%+ watch                                      +0.005

Report tweet                                         -369.0
Block author                                          -74.0
Mute author                                           -74.0
"Show less" / negative feedback                       -74.0
```

### What the weights actually mean

- **Reply + author engagement (+75) is 150x a like (+0.5).** X wants conversations, not passive scrolling. A reply chain where the author participates outweighs a thousand silent likes.
- **Retweets (+1.0) are only 2x a like.** Most growth advice overrates RTs. A single reply is worth ~27 likes. "Like and RT" strategies optimize the wrong signal.
- **Dwell time (+10)** is high-value and underused — content that holds attention in-thread for 2+ minutes is rewarded almost as much as a reply.
- **Report (-369x) and block/mute (-74x)** are account killers. One report event outweighs roughly 738 likes' worth of positive signal.

---

## Stage 3: Filter and Serve

Blocked/muted accounts removed, in-network/out-of-network balanced, ads mixed in, feed served.

---

## TweepCred (Reputation Gate)

A hidden 0–100 reputation score. Below 65 = only 3 of your tweets even enter the candidate pipeline, regardless of content quality. Built from account age, follower ratio, engagement quality, and interaction with high-quality accounts. Functions as an algorithmic credit score that gates everything upstream of content quality.

- 30 days minimum account age for full scoring
- 0.6 = maximum healthy following/followers ratio

---

## Tweet Lifecycle

- **360-minute half-life.** Tweets decay fast.
- **First 2 hours decide the tweet's fate.** Early engagement velocity determines total reach — this is why the "what should I post RIGHT NOW" problem matters more than content quality alone.

---

## Premium (Blue) Boost

4x in-network boost, 2x out-of-network. As of last check, adoption is low (~0.26%), making it a disproportionate lever for anyone using it. Premium users are also paid based on engagement from other Premium users, so writing for a Premium-heavy audience matters more than writing for raw volume.

---

## 2026 Shift: Grok/Grox Content Understanding

The new system eliminated most hand-coded features and learns purely from engagement patterns — old tricks like hashtag stuffing and "optimal posting time" hacks matter much less now. Grox (content-understanding layer) reads and scores content quality directly:

- **AI slop fails twice.** Grox deprioritizes it on content signals, and humans don't reply to generic content, so it never earns the one signal that actually matters (replies).
- Musk has stated the algorithm reads every post — 100M+/day — meaning an LLM is evaluating your tweet before a human ever sees it. Feeding it generic LLM output is exactly the pattern it's trained to bury.
- **Promptable feeds** are live: users can tell Grok "more startup content, less politics," making topical/niche consistency a direct ranking factor, not just a growth-hack heuristic.

---

## Key Numbers (Cheat Sheet)

```
150x    — Value of author reply-back vs a like
75      — Weight of reply engaged by author
13.5    — Weight of a reply
0.5     — Weight of a like (near-worthless alone)
65      — TweepCred threshold (below = only 3 tweets considered)
360 min — Tweet half-life
50/50   — In-network vs out-of-network feed split
145,000 — Number of SimClusters
1,500   — Candidate tweets per feed refresh
4x/2x   — Premium boost (in-network/out-of-network)
-369    — Report penalty multiplier
-74     — Block/mute penalty multiplier
0.6     — Max healthy following/followers ratio
30 days — Minimum account age for full scoring
```

---

## Product Implications (for a tweet/reply generator)

1. **Order of build priority: reply engine → trend reader → tweet drafter.** Replies are worth 27–150x a like, and out-of-network reach requires borrowed social proof from engagement, not original posting alone. The "generate tweets" feature is the least algorithmically valuable of the three, despite being the obvious MVP.
2. **Niche discipline is now a hard ranking factor**, not just aesthetic advice — SimCluster placement and promptable-feed targeting both depend on topical consistency.
3. **Any generated content must avoid AI-slop patterns** — Grox scores content quality directly, so generic phrasing gets buried before it can even earn replies.
4. **The algorithm updates every 4 weeks.** A static playbook decays within a month. Any product built on this needs to re-derive its rules from the live repo, not hardcode this doc permanently.
5. **Guardrails that must hold**: no automated follow/unfollow (triggers 3-month shadowban), no auto-posting without human approval (bot detection watches for behavioral patterns), no volume spikes (gradual increases only).

---

## Sources

- X algorithm (2026, current): github.com/xai-org/x-algorithm
- X algorithm (2023, deprecated — do not build on this): github.com/twitter/the-algorithm
- X Engineering Blog: blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm
- TweepCred source (legacy repo, concept still applies): github.com/twitter/the-algorithm/tree/main/src/scala/com/twitter/graph/batch/job/tweepcred
- SimClusters (legacy repo, concept still applies): github.com/twitter/the-algorithm/tree/main/src/scala/com/twitter/simclusters_v2
- Knight First Amendment Institute analysis: knightcolumbia.org/blog/twitter-showed-us-its-algorithm-what-does-it-tell-us
