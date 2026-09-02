# AWS Study Guide

AWSを完全初心者から順番に学ぶための個人向け学習サイトです。サービス名の暗記ではなく、**IT基礎 → AWSの役割 → サービス比較 → 構成判断 → 復習**の流れで理解します。

## Project Profile

`STATIC + DATA + TOOL + PUBLIC-CONTENT`

## 学習体験

- AWS以前のWeb / サーバー / DNS / DB / APIから開始
- 10章・24LessonのLearning Path
- Lessonごとの所要時間、例え、要点、AWS内でのつながり
- 各Lessonの短い理解確認
- 理解度自己評価（曖昧 / だいたい分かる / 説明できる）
- AWS構成マップ
- S3 / EBS / EFSなどの使い分け比較
- 要件からサービスを選ぶ構成シナリオ
- 間違い・理解度から自動で作る復習キュー
- 用語辞書
- 今日の次Lesson表示
- 学習データのJSONバックアップ

## 保存

進捗はブラウザの `localStorage` に保存します。

```text
awsStudyGuide.progress.v1
```

旧版と同じ保存キーを維持し、旧Topicの完了情報は `legacyTopicId` を使って新Lessonへ可能な範囲で引き継ぎます。

## 教材データ

教材の正本は `data/course-core.json` と3つの `data/lessons-*.json` です。`data/manifest.json` はVersion・読込対象・件数の検証用です。

## 開発・検証

```bash
node tests/validate.mjs
node --check js/app.js
```

制作判断の正本は `EliteMay/web-project-guide` の最新状態です。

## 公開

GitHub Pages: `https://elitemay.github.io/aws-study-guide/`

Pagesが未有効の場合は Repository Settings → Pages で `main` / `/ (root)` を公開元にします。
