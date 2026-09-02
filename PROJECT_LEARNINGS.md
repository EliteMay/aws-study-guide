# Project Learnings

## 2026-09-03 — Beginner learning must start before AWS

### Finding

AWSサービスから説明を始めると、完全初心者は「サーバー / DNS / DB / API」が未理解のまま固有サービス名だけ増える。

### Decision

コース冒頭にWeb、サーバー、ネットワーク/DNS、保存/DB、APIの5Lessonを置き、その後にAWSへ対応付ける。

### Reuse value

クラウド学習サイトでは、製品固有語より前に前提となる一般IT概念を短く揃える。

---

## 2026-09-03 — Dashboard is not the main learning surface

### Finding

進捗カードやサービス一覧は整理には強いが、初心者が順番に理解するPrimary Taskには弱い。

### Decision

暗色のAWS shellは維持し、中央を明るいReading Surfaceへ変更。Homeは次の行動を示し、Main TaskはLesson Readerに置く。

### Reuse value

学習サイトは「管理画面」と「読む/解く画面」を同じ密度・Surfaceで扱わない。

---

## 2026-09-03 — Completion and understanding are different

### Finding

「学習済み」だけでは、読んだだけなのか説明・判断できるのか区別できない。

### Decision

Lesson完了と確認問題結果、3段階の自己理解度を分離して保存し、誤答または低理解度を復習キューへ自動投入する。

---

## 2026-09-03 — Preserve old progress during learning-model replacement

### Finding

旧版のTopic単位進捗と、新版のLesson単位進捗は粒度が違う。保存キーを変えて切り捨てると既存学習データを失う。

### Decision

`awsStudyGuide.progress.v1` と旧フィールドを維持し、各Lessonの `legacyTopicId` が旧completedへ存在する場合のみLesson完了へ移行する。

### Reuse value

学習モデルを大きく変える場合も、旧IDと新IDの対応が取れる範囲はMigrationし、対応不能なデータを勝手に推測して変換しない。
