# コネクシオ 送信失敗記録

## 対象企業

コネクシオ株式会社

## 公式URL

https://www.conexio.co.jp/

## 問い合わせURL

https://www.conexio.co.jp/contact

## 公開メールアドレス

contact@conexio.co.jp

## LP URL

https://telecom-staff-ai-demo.vercel.app/?src=conexio

## 実施日

2026-06-12

## 結果

送信不可。send_failed 扱い。

## 判定理由

### 企業属性
- 通信代理店・携帯ショップ運営会社として対象フィット ✅
- ドコモショップ・楽天モバイルショップ運営の実績あり ✅

### 問い合わせ窓口構成
公式Contact ページで複数カテゴリを確認：
- 法人向けサービス → 別フォーム（mobileworkplace.jp）
- 人事・採用・退職後 → jinji_kc@conexio.co.jp
- プリペイドカードサービス → contact@conexio.co.jp
- **総合お問い合わせ → contact@conexio.co.jp** ← 営業向け候補

### 総合お問い合わせのメーラーテンプレート分析
以下の必須項目を確認：
- ✅ お問い合わせ種別・内容（必須）
- ✅ お名前（漢字/カナ）（必須）
- ✅ メールアドレス（半角英数）（必須）
- ❌ **電話番号（半角英数）（必須）** ← NG
- ❌ **郵便番号（半角英数）（必須）** ← NG
- ❌ **都道府県（必須）** ← NG
- ❌ **住所（必須）** ← NG
- ⚠️ 会社名/部署名（任意）

### 結論
contact@conexio.co.jp は営業・法人向け提案の窓口として自然。ただし、メーラーテンプレートで **電話番号・郵便番号・都道府県・住所が必須項目** となっているため、以下の理由で送信不可：

1. **営業用公開電話番号がない** → 個人電話番号を入力しない
2. **営業用公開住所がない** → 個人住所を入力しない
3. **架空情報は入力しない**（個人情報保護の観点）
4. **技術的 POST bypass は未実施**（フォーム設計尊重）

## 営業禁止文言

明確な「営業禁止」文言は確認できなかった。

## 送信状況

**未送信**

理由：総合お問い合わせの必須項目に電話番号・住所（郵便番号/都道府県）が含まれるため、営業送信は不適切と判断。

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

* companyName: コネクシオ株式会社
* status: send_failed
* sentChannel: contact_form_not_suitable
* sentUrl: https://www.conexio.co.jp/contact
* lpUrl: https://telecom-staff-ai-demo.vercel.app/?src=conexio
* replyStatus: none
* sentAt: null

## 次アクション

電話番号・住所が必須ではない問い合わせフォーム、または用途が明確な公開メールアドレスがある別候補を探す。

## 備考

フォーム判定ルール：

送信NG 条件（該当項目）：
- 電話番号が必須項目 ← コネクシオはここに該当
- 住所が必須項目 ← コネクシオはここに該当
- 営業禁止文言あり
- 採用専用フォーム
- 送信完了画面が確認できない
- 技術的 POST bypass が必要
- 個人電話番号・個人住所・架空情報が必要になる

コネクシオは複数の NG 条件に該当するため、営業送信を実施しない。

