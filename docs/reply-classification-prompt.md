# 返信分類プロンプト

返信文を営業管理用に分類してください。

分類ラベル:
- interested
- question
- not_interested
- do_not_contact
- wrong_contact
- needs_followup
- other

出力項目:
- replyStatus
- replySummary
- nextAction
- nextActionDateSuggestion
- riskNote
- suggestedReplyDraft

方針:
- 返信内容を営業管理用に短く整理する
- 失礼な返信はしない
- 不要と言われたら `do_not_contact` にする
- 法的・契約的な判断はしない
- 返信案は短く丁寧にする
- 判断が難しい場合は `other` に寄せる

出力例:
```json
{
  "replyStatus": "interested",
  "replySummary": "デモ確認の意向あり",
  "nextAction": "デモURLを案内する",
  "nextActionDateSuggestion": "2026-06-10",
  "riskNote": "",
  "suggestedReplyDraft": "ご返信ありがとうございます。デモURLをご確認いただけるようご案内します。"
}
```
