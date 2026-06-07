# LP インサイト設計メモ

現状:
- LP はフォーム送信後に Dify デモ URL を表示する
- 自動保存は未実装
- Sales Agent OS 側では手動で `lpVisited` / `lpFormSubmitted` / `difyOpened` を記録する

次フェーズ案:
- LP フォーム送信を Google Sheets または Supabase に保存する
- `src` パラメータを保存する
- 会社名、名前、メール、希望内容を保存する
- Dify ボタンクリックを保存する
- Sales Agent OS と `sourceId` で紐づける

保存項目案:
- createdAt
- source
- companyName
- name
- role
- email
- requestType
- message
- difyOpened
- userAgent
- referrer

注意:
- 個人情報の扱いに注意する
- 外部共有設定は最小限にする
- 最初は手動記録でもよい
