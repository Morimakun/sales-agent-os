# キンキテレコム 送信失敗記録

## 対象企業

キンキテレコム株式会社

## 公式 URL

https://www.kintele.co.jp/

## LP URL

https://telecom-staff-ai-demo.vercel.app/?src=kinki-telecom

## 実施日

2026-06-10

## 結果

送信せず。send_failed 扱い。

## 理由

キンキテレコム公式問い合わせフォーム（https://www.kintele.co.jp/contact）を確認したところ、以下の必須項目が存在した：

1. **電話番号※（必須）**
   - フォーム HTML より確認: "電話番号は必須項目です"
   - 例：078-123-4567

2. **郵便番号※（必須）**
   - 必須項目として指定

3. **住所※（必須）**
   - 必須項目として指定

営業用の公開電話番号・営業用公開住所がないため、以下の対応を実施しなかった：
- 個人電話番号を入力しない
- 個人住所（自宅・実家・関係先）を入力しない
- 架空の電話番号を入力しない
- 架空の住所を入力しない
- 技術的 POST bypass を実施しない

## 営業禁止文言

明確な営業禁止文言は確認できなかった。

## 送信状況

未送信。

## 個人情報露出

個人名は入力していない。
個人電話番号も入力していない。
個人住所も入力していない。
Dify 直 URL も送付していない。
Sales Agent OS の URL も送付していない。

## Sales Agent OS ローカル DB 記録

ローカル DB 上では以下で記録済み。

* companyName: キンキテレコム株式会社
* status: send_failed
* sentChannel: contact_form
* sentTo: 公式問い合わせフォーム
* sentUrl: https://www.kintele.co.jp/contact
* lpUrl: https://telecom-staff-ai-demo.vercel.app/?src=kinki-telecom
* replyStatus: none
* sentAt: null

## 次アクション

電話番号・住所が必須ではない問い合わせフォームを持つ企業を優先する。
または、公開メールアドレスがある企業を優先する。

## 備考

フォーム判定ルール：

送信NG 条件：
- 電話番号が必須項目
- 住所が必須項目
- 営業禁止文言あり
- 採用専用フォーム
- 送信完了画面が確認できない
- 技術的 POST bypass が必要
- 個人電話番号・個人住所・架空情報が必要になる

キンキテレコムは複数の NG 条件に該当するため、送信を実施しない。

今後のルールとして、電話番号・住所が両方とも必須ではない問い合わせフォームを持つ企業を優先する。
