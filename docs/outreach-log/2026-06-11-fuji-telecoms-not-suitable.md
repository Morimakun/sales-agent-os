# フジテレコムズ 送信不可判定

## 対象企業

フジテレコムズ株式会社

## 公式URL

https://www.fujitelecoms.jp/

## 問い合わせURL

https://www.fujitelecoms.jp/contact/inquiry-for-consumer.html

## 公開メールアドレス

support@fujitelecoms.com

## LP URL

https://telecom-staff-ai-demo.vercel.app/?src=fuji-telecoms

## 実施日

2026-06-11

## 結果

送信不可。send_failed 扱い。

## 判定理由

### 問い合わせフォーム構造
- 公式サイトの問い合わせページが「個人のお客様向け」セクションに分類されている
- 契約者向けサポート、アカウント管理、請求・請求・解約手続きなどが主な用途と見られる
- 営業・法人向け提案の適切な窓口ではない

### メールアドレス用途
- support@fujitelecoms.com は購入者・契約者サポート専用の可能性が高い
- 営業・法人向け提案の送信先として適切ではない

### 結論
通信代理店・携帯ショップ運営会社としては候補に合うが、問い合わせ導線が明確に「個人向けサポート」目的のため、営業送信は避けるべき。

## 営業禁止文言

明確な「営業禁止」文言は確認できなかった。

## 送信状況

**未送信**

理由：問い合わせ窓口の用途が個人向けサポート専門のため、営業送信は不適切と判断。

## 個人情報露出

以下は使用していない：
- 個人名
- 個人電話番号
- 個人住所
- 架空情報
- 技術的 POST bypass

Dify 直 URL も Sales Agent OS URL も送付していない。

## Sales Agent OS ローカル DB 記録

ローカル DB 上では以下で記録：

* companyName: フジテレコムズ株式会社
* status: send_failed
* sentChannel: contact_form_not_suitable
* sentUrl: https://www.fujitelecoms.jp/contact/inquiry-for-consumer.html
* lpUrl: https://telecom-staff-ai-demo.vercel.app/?src=fuji-telecoms
* replyStatus: none
* sentAt: null

## 次アクション

法人向け問い合わせ窓口、公開メールアドレス、または電話番号・住所不要の一般問い合わせフォームがある別候補を探す。

## 備考

フォーム判定ルール：

送信NG 条件（該当項目）：
- ✅ **個人向けサポート専用窓口** ← フジテレコムズはここに該当
- 電話番号が必須項目
- 住所が必須項目
- 営業禁止文言あり
- 採用専用フォーム
- 送信完了画面が確認できない
- 技術的 POST bypass が必要
- 個人電話番号・個人住所・架空情報が必要になる

フジテレコムズは「個人向けサポート専用窓口」のため、営業送信を実施しない。

