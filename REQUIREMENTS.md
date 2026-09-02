# Requirements

## 目的

AWSを一度も学んだことがない利用者が、このサイトを上から順番に進めるだけで、一般IT基礎からAWS主要サービスの役割・使い分け・基本構成まで理解できる個人向け学習サイトにする。

## 利用者

- 主利用者: AWS完全初心者の自分
- 公開形態: GitHub Pagesで閲覧可能な公開サイト

## Project Profile

`STATIC + DATA + TOOL + PUBLIC-CONTENT`

## 必須学習体験

1. Web / サーバー / DNS / DB / APIなどAWS以前の基礎から開始できる
2. 推奨順のChapter / Lessonを迷わず進められる
3. 各Lessonで「例え → 流れ → 要点 → AWS内でのつながり」を理解できる
4. 各Lessonの短い確認問題で読んだだけを防ぐ
5. Lesson完了と理解度を別々に保存できる
6. 構成マップでAWSサービスの位置関係を確認できる
7. 類似サービスを比較して選択条件を整理できる
8. 要件からサービスを選ぶ構成問題を解ける
9. 誤答・低理解度を自動で復習キューへ入れる
10. 用語で詰まったとき辞書へすぐ戻れる
11. ホームで「次にやるLesson」をすぐ開始できる

## 画面構成

- Home: 今日のLesson、進捗、学習方法、Chapter概要
- Course: 10章 / 24Lessonの推奨順
- Lesson Reader: 本文、例え、概念フロー、要点、関連、確認問題、理解度
- Architecture Map: 典型的なWeb構成上でサービス位置を確認
- Compare: 類似サービスのDecision Table
- Practice: 要件ベースの構成問題
- Review: 誤答 / 低理解度の自動復習
- Glossary: 基礎用語検索

## データ

公開教材:

- `data/manifest.json`: Version / 件数 / 読み込み対象
- `data/course-core.json`: version / chapters / comparisons / scenarios / glossary
- `data/lessons-foundation.json`: IT基礎 / Cloud / IAM
- `data/lessons-core-services.json`: Compute / Storage / Network / Database
- `data/lessons-advanced.json`: Serverless / Operations / Architecture

ユーザー状態:

- `localStorage`: `awsStudyGuide.progress.v1`
- 旧 completed / weak / bookmarks / quizHistoryを削除せず保持
- 新 lessonDone / lessonChecks / confidence / scenarioHistoryを追加
- `legacyTopicId`で旧Topic完了を新Lessonへ可能な範囲で移行

## 崩してはいけない仕様

- AWS教材本文をHTML / JSへ大量直書きしない
- GitHub PagesのRepository subpathを壊すroot固定パスを使わない
- 旧 `awsStudyGuide.progress.v1` を無断破棄しない
- AWS APIキー等の秘密情報を公開ファイルへ置かない
- 料金・Quota等、変化しやすい数値を無根拠に固定しない
- 未実装機能を完成済みとして見せない
- 初心者に未説明の専門用語を大量に先出ししない

## 非機能要件

- Firefox / Chromium系を主対象とする
- 320px幅で致命的な横スクロールを発生させない
- focus-visibleを維持する
- `prefers-reduced-motion` を考慮する
- 外部Framework / CDNなしで動作する
- 教材読込失敗を画面上で把握できる

## 完成条件

- 10章 / 24LessonがJSONから読み込める
- Lesson確認問題・理解度・完了状態が保存できる
- Map / Compare / Practice / Review / Glossaryが通常利用できる
- JS / JSON / local referenceのStatic Validationが通る
- Manifest件数と教材件数が一致する
- README / SPEC / WORK_REPORTが現行実装と一致する
- GitHub Pages公開状態を確認、または未確認事項を明記する
- Visual Quality Baseline上のBlockingな崩れを残さない
