# Requirements

## 目的

AWS初心者が、サービス名の丸暗記ではなく「要件 → サービス選択 → 理由 → 構成」の流れで理解できる個人向け学習サイトを作る。

## 利用者

- 主利用者: 自分
- 公開形態: GitHub Pagesで閲覧可能な公開サイト

## Project Profile

`STATIC + DATA + TOOL`

## MVP

1. AWS基礎ロードマップを表示できる
2. サービス教材をカテゴリ・検索で探せる
3. 各教材で役割・イメージ・比較・判断ポイントを読める
4. 学習済み / 苦手 / ブックマークを保存できる
5. クイズへ回答し、即時解説を確認できる
6. 復習画面で苦手 / ブックマークを再確認できる
7. GitHub Pagesのサブパスで動作する

## 画面構成

- ホーム: 進捗、次の学習、重要比較
- ロードマップ: 推奨学習順
- サービス学習: 全教材、検索、カテゴリ絞り込み
- クイズ: 選択問題、即時解説、正答履歴
- 復習: 苦手 / ブックマーク
- 教材詳細: Dialogで要点を表示

## データ構成

公開教材:

- `data/manifest.json`: Dataset Version / 件数 / 読み込み対象
- `data/aws-core.json`: category / roadmap / topics / quiz

ユーザー状態:

- `localStorage` の `awsStudyGuide.progress.v1`
- `schemaVersion: 1`
- completed / weak / bookmarks / quizHistory

## 崩してはいけない仕様

- AWS教材データをHTML/JSへ大量直書きしない
- GitHub Pagesのリポジトリサブパスを壊すroot固定パスを使わない
- 既存進捗をSchema変更時に無断破棄しない
- AWS APIキー等の秘密情報を公開ファイルへ置かない
- 料金・上限・推奨事項など変化しやすい情報を無根拠に固定しない
- 未実装機能を完成済みとしてUIへ置かない

## 非機能要件

- Firefox / Chromium系を主対象とする
- 320px幅で致命的な横スクロールを発生させない
- キーボードfocus-visibleを維持する
- 外部CDN・Frameworkなしで動作する
- 教材読込失敗を画面上で把握できる

## 完成条件

- 必須ファイルが存在する
- JS / JSONのStatic Validationが成功する
- Manifest件数とデータ件数が一致する
- Topic / Quiz ID参照が壊れていない
- 主要ボタンと検索・保存・クイズが通常利用できる
- README / SPEC / WORK_REPORTが現行実装と一致する
- GitHub Pages実公開確認、または未確認状態が明記されている
- Visual Quality Baseline上のBlockingな崩れがない
