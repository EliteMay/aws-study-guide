# Project Learnings

## 2026-09-01 — Initial architecture

### Decision

学習コンテンツをHTML / JavaScriptへ直書きせず、`data/manifest.json` と `data/aws-core.json` を正本にした。

### Why

- 教材追加時にUIコードへ触れる量を減らす
- Topic / Quiz件数をManifestで検証できる
- 将来カテゴリ別JSONへ分割しやすい

### Reuse value

学習サイトでは「UI Runtime」と「公開教材Data」を分離し、ID参照とManifest件数をCIで検証すると保守しやすい。

---

## 2026-09-01 — Learning model

### Decision

教材カードを単なる定義一覧にせず、各Topicを以下の共通構造にした。

1. summary
2. mentalModel
3. keyPoints
4. compare
5. examTip
6. official source

### Why

AWSは似た役割のサービスが多く、定義暗記だけでは選択問題・設計判断につながりにくい。

### Reuse value

技術学習サイトでは「何か」だけでなく「何と違うか」「どういう要件で選ぶか」を同じSchemaに含める。

---

## 2026-09-01 — Local-first progress

### Decision

MVPの進捗は `localStorage` のVersion付きJSONのみで保存する。

### Why

- 個人利用では複数端末同期が必須ではない
- GitHub Pagesだけで完結できる
- Backend / Auth / Cost / Security scopeを増やさない

### Future note

複数端末同期が明確に必要になった場合だけCloud storageを検討する。導入時は現在のデータを無断で捨てずMigrationを設計する。
