# Specification

## Architecture

GitHub Pages向けの静的Webアプリ。

```text
index.html
  ├─ css/styles.css
  ├─ js/app.js
  └─ fetch → data/manifest.json → data/aws-core.json
```

外部Backend / Build step / FrameworkはMVPでは使用しない。

## Data Schema

### manifest.json

```json
{
  "schemaVersion": 1,
  "datasetVersion": "YYYY.MM.DD-N",
  "updatedAt": "YYYY-MM-DD",
  "files": [],
  "counts": {
    "topics": 0,
    "quizQuestions": 0
  }
}
```

### Topic

必須フィールド:

- id
- title
- service
- category
- level
- summary
- mentalModel
- keyPoints[]
- compare
- examTip
- sourceUrl

### Quiz

- id
- topicId
- question
- choices[]
- answer: 0始まりのindex
- explanation

## Progress Schema

保存キー: `awsStudyGuide.progress.v1`

```json
{
  "schemaVersion": 1,
  "completed": [],
  "weak": [],
  "bookmarks": [],
  "quizHistory": {},
  "updatedAt": null
}
```

`quizHistory[questionId]`:

```json
{
  "attempts": 1,
  "correct": 1,
  "lastAt": "ISO-8601"
}
```

## Navigation

SPAライクに同一HTML内のViewを切り替える。

- `dashboard`
- `roadmap`
- `topics`
- `quiz`
- `review`

URL RouterはMVPでは採用しないため、GitHub Pages上のDirect Link問題を増やさない。

## Search

`topics` の以下を小文字化した文字列へ部分一致する。

- title
- service
- summary
- mentalModel
- compare
- examTip
- keyPoints

検索入力時は自動的にサービス学習Viewへ移動する。

## Topic Detail

`<dialog>` を使用する。

操作:

- 学習済み ON / OFF
- 苦手 ON / OFF
- ブックマーク ON / OFF
- AWS公式Sourceを新規タブで開く

## Quiz

- Dataset順に1問ずつ表示
- 回答後に正解・不正解と解説を表示
- 回答後だけ次へ進める
- 全問終了後はSession scoreを通知して先頭へ戻る
- 累積履歴はlocalStorageへ保存

## Failure State

教材JSON読込失敗時:

- ConsoleへError
- Topbarへ「教材の読み込みに失敗」
- Main画面へFailure message
- 保存済み進捗は削除しない

localStorage書込失敗時:

- ConsoleへError
- Toastで保存失敗を通知
- その操作を成功扱いしない

## Accessibility

- `<button>` / `<nav>` / `<main>` / `<dialog>` 等の意味要素を利用
- focus-visibleを削除しない
- Skip linkを用意
- 色だけで主要状態を説明しない
- `prefers-reduced-motion` を考慮

## Responsive

- Desktop: 固定Sidebar + Content
- Tablet以下: SidebarをDrawer化
- 580px以下: Topic 1列、Architecture flow縦化
- 主要操作をViewport外へ固定しない

## Content Policy

AWS仕様は変化するため、更新時はAWS公式ドキュメントを優先する。

変化しやすい値（料金、Quota、無料枠、具体的Version等）は教材本文へ不用意に固定しない。
