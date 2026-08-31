# AWS Study Guide

AWSを「サービス名の暗記」ではなく、**役割・使い分け・構成・問題演習**までつなげて学ぶための個人向け学習サイトです。

## Project Profile

`STATIC + DATA + TOOL`

- STATIC: GitHub Pagesでそのまま動作
- DATA: 学習コンテンツをJSONへ分離
- TOOL: 進捗・苦手・ブックマークをブラウザへ保存

## 主な機能

- 初心者向けAWSロードマップ
- サービス別の要点解説
- 「なぜ使うか」「何と比較するか」を重視した説明
- S3 / EBS / EFS、RDS / DynamoDB、CloudWatch / CloudTrailなどの比較
- サービス検索・カテゴリ絞り込み
- 学習済みチェック
- ブックマーク / 苦手登録
- クイズと即時解説
- 学習進捗ダッシュボード
- `localStorage` による端末内保存

## GitHub Pages

公開URL:

https://elitemay.github.io/aws-study-guide/

初回だけRepositoryの **Settings → Pages** で次を設定します。

```text
Build and deployment
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

保存後は `main` の静的ファイルがGitHub Pagesから公開されます。

## ファイル構成

```text
aws-study-guide/
├─ index.html
├─ 404.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ app.js
├─ data/
│  ├─ manifest.json
│  └─ aws-core.json
├─ tests/
│  └─ validate.mjs
├─ REQUIREMENTS.md
├─ SPEC.md
├─ PROJECT_LEARNINGS.md
├─ WORK_REPORT.md
└─ .github/workflows/validate.yml
```

## データ保存

ユーザーの進捗のみブラウザの `localStorage` に保存します。

保存キー:

```text
awsStudyGuide.progress.v1
```

教材そのものはGitHub上のJSONを正本とします。

## Validation

push / pull request時にGitHub Actionsで次を確認します。

- JavaScript構文
- JSON構文
- Manifest件数
- Topic / Quiz ID参照
- 必須フィールド
- `index.html` のローカル参照
- 公開ファイルへの典型的な秘密情報混入

共通Baselineは `EliteMay/.github` のReusable WorkflowをCommit SHA固定で利用し、Project固有Validationは `tests/validate.mjs` に残しています。

## 情報方針

AWSの仕様は変化するため、教材更新時はAWS公式ドキュメントを優先して確認します。特に料金、上限、推奨構成、サービス名変更は固定知識として扱いません。

## 開発ルール

制作判断の正本は `EliteMay/web-project-guide` の最新状態です。現在の実装では、GitHub Pagesの相対パス、JSON分離、保存互換性、Visual Quality、Static Validationを重視します。
