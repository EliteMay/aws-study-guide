# Work Report

## 2026-09-03 — Beginner-first learning redesign

### Goal

「AWSを一度も学んだことがない状態」から、このサイトを順番に進めるだけで基本概念と主要サービスの使い分けを理解できる構造へ変更する。

### Research / direction

- 最新 `EliteMay/web-project-guide` の README / START_HERE / Visual Quality Baselineを確認
- AWS公式の2026年初心者向け学習方針を確認
- Microsoft LearnのLearning Path / Module型構造を参考に、Lesson単位と所要時間を導入
- 既存のAWS色・左RailはKEEP、Dashboard / Card中心の学習導線をFIX

### Implemented

- AWS以前のIT基礎5Lesson
- 全10章 / 24Lesson
- Lesson Reader
- Lessonごとの確認問題
- 3段階の理解度
- 今日の次Lesson
- 誤答 / 低理解度から作る自動復習キュー
- AWS構成マップ
- サービス比較4テーマ
- 構成シナリオ4問
- 用語辞書
- JSONバックアップ
- 旧 `awsStudyGuide.progress.v1` 互換維持
- 旧Topic完了から新Lessonへの互換移行
- 教材Source of Truthを役割別JSONへ整理
- Responsive / focus-visible / reduced-motion対応

### Validation

- Local `node tests/validate.mjs`: final-state実行対象
- Local `node --check js/app.js`: Passed
- GitHub Actions: final commitで確認する
- Browser / screenshot visual verification: GitHub Pages公開後に確認する
- User validation: Pending

### Known limitations

- 教材はAWS全サービスを網羅しない。初心者が主要概念をつなげる範囲を優先。
- 実AWSアカウントを使うハンズオンは未実装。
- 復習間隔は現時点では誤答・理解度ベースで、Spaced Repetitionの日付スケジューリングは未実装。
