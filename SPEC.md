# Specification

## Purpose

AWSを知らない利用者が、このサイトを上から進めるだけで一般IT基礎とAWSの基本構造、主要サービスの使い分けを理解できる状態を目指す。

## Primary workflow

1. Homeで次Lessonを確認
2. Lesson本文を読む
3. 短い確認問題に答える
4. 理解度を自己評価する
5. 次Lessonへ進む
6. Map / Compareで位置関係と差を確認する
7. Practiceで要件からサービスを選ぶ
8. 誤答・低理解度をReviewする

## Information architecture

- Home: 今日の学習、進捗、コースの考え方
- Course: 10章 / 24Lesson
- Lesson Reader: 本文、例え、図式、要点、関連、確認問題、理解度
- Architecture Map: サービスの位置関係
- Compare: 類似サービスの選択条件
- Practice: 要件から構成を選ぶ練習
- Review: 誤答 / 低理解度を自動収集
- Glossary: 基礎用語検索

## Data

`data/course-core.json` と `data/lessons-*.json` が教材Source of Truth。

Lessonは `id`, `chapter`, `title`, `minutes`, `lead`, `analogy`, `flow`, `points`, `connect`, `terms`, `check`, `source`, `legacyTopicId` を持つ。

`data/manifest.json` はDataset Versionと件数を持ち、CIでcourse.jsonと一致を確認する。

## Persistence

Storage key: `awsStudyGuide.progress.v1`

新しい状態:
- `lessonDone`
- `lessonChecks`
- `confidence`
- `scenarioHistory`

旧状態:
- `completed`
- `weak`
- `bookmarks`
- `quizHistory`

旧状態を消さず互換情報として保持する。`legacyTopicId` が一致した旧完了Topicは新Lessonへ移行する。

## Review rule

Review Queueへ入る条件:

- Lesson確認問題の最新結果が不正解
- 自己理解度が `1 / まだ曖昧`

## Visual direction

AWSらしい濃紺 / オレンジのIdentityと左Railは維持する。中央は白〜薄灰のReading Surfaceにし、管理Dashboardではなく教材を読む感覚を優先する。

Desktopでは固定Rail + Reading Workspace。Lessonでは中央本文をPrimary Surfaceとし、左にChapter内Lesson、右にConnection / Termsを置く。MobileではRailをDrawer化し、Lesson本文を最優先する。

## Failure state

`data/course.json` のFetch失敗時はConsoleへErrorを出し、Rail statusとToastで教材読込失敗を通知する。保存済み進捗は削除しない。
