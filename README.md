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

## 公開予定URL

https://elitemay.github.io/aws-study-guide/

GitHub Pagesが未有効の場合は、Repository Settings → Pages から公開を有効にしてください。

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

## 情報方針

AWSの仕様は変化するため、教材更新時はAWS公式ドキュメントを優先して確認します。特に料金、上限、推奨構成、サービス名変更は固定知識として扱いません。

## 開発ルール

制作判断の正本は `EliteMay/web-project-guide` の最新状態です。現在の実装では、GitHub Pagesの相対パス、JSON分離、保存互換性、Visual Quality、Static Validationを重視します。
