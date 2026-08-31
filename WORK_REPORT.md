# Work Report

## 2026-09-01 — Initial release

### Implemented

- GitHub Pages向け1ページ学習アプリ構成
- AWS基礎18トピック
- 8段階学習ロードマップ
- 18問クイズ
- サービス検索
- カテゴリ絞り込み
- Topic詳細Dialog
- 学習済み / 苦手 / ブックマーク
- クイズ履歴と正答率
- localStorageによる進捗保存
- Responsive Sidebar / Mobile layout
- Keyboard focus / Skip link / reduced motion対応
- Manifest / Dataset分離
- Project-specific validator
- README / Requirements / Specification / Project Learnings

### Content verification

AWS公式ドキュメントを優先し、特に以下を確認して初期教材へ反映した。

- IAM: temporary credentials / roles / MFA / least privilege
- Well-Architected: 6 pillars
- Global Infrastructure / Shared Responsibility等の基本概念

料金・Quotaなど変化しやすい数値は初期教材で極力固定していない。

### Validation status

- Implemented: Yes
- Static Validation: GitHub Actions追加後に最終Commitで確認予定
- Browser Validated: Unverified
- Visual Reviewed: Code-level baseline only / 実ブラウザ未確認
- GitHub Pages Published: Unverified
- User Validated: Unverified

### Known limitations

- 進捗は現在のブラウザ端末内のみ。複数端末同期なし。
- Topic数は初期18件。AWS全サービスを網羅するものではない。
- URLごとのDeep Link Routerは未実装。
- 実ブラウザでのVisual / Interaction確認は未実施。

### Next candidates

- Cloud Practitioner / SAAなど目的別モード
- Architecture scenario問題
- 間違えたQuizだけの出題
- JSON Export / Importによる進捗バックアップ
- Topicデータのカテゴリ別分割
- 実ブラウザVisual review後のUI微調整
