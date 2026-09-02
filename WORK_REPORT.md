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
- 用語辞書15語
- JSONバックアップ
- 旧 `awsStudyGuide.progress.v1` 互換維持
- 旧Topic完了から新Lessonへの互換移行
- 教材Source of Truthを役割別JSONへ整理
- Responsive / focus-visible / reduced-motion対応

### Validation

- Local `node --check js/app.js`: Passed
- Local `node --check js/views.js`: Passed
- Local `node tests/validate.mjs`: Passed — 10 chapters / 24 lessons / 4 comparisons / 4 scenarios / 15 glossary terms
- PR #1 validation on head `027bde24db2214ab96dc7b267ce7312b5e0792c6`: Passed
- `main` feature commit `afaa031969b18baaa15381bcdd45dab4a05a2b1b`: GitHub Actions Validation Passed
- GitHub Pages build / deploy for `afaa031969b18baaa15381bcdd45dab4a05a2b1b`: Passed
- Public URL: `https://elitemay.github.io/aws-study-guide/`
- Browser / screenshot visual verification: **Visual未確認**。この作業環境ではレンダリング済みWebページの実ブラウザScreenshotを取得できないため、公開・Asset・CI成功とVisual確認を混同しない。
- User validation: Pending

### Cleanup

- 一時展開Workflowを削除済み
- 一時転送 `.tmp/apply/*` を削除済み
- 旧 `css/styles.css` を削除済み
- 旧 `data/aws-core.json` を削除済み
- 最終Runtimeは通常のHTML / CSS / JavaScript / JSONのみ

### Known limitations

- 教材はAWS全サービスを網羅しない。初心者が主要概念をつなげる範囲を優先。
- 実AWSアカウントを使うハンズオンは未実装。
- 復習間隔は現時点では誤答・理解度ベースで、Spaced Repetitionの日付スケジューリングは未実装。
- 実ブラウザでの最終Visual Reviewは未実施。
