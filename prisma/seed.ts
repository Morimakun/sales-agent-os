import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ===== 商品メニュー (6件) =====
  const products = [
    { name: "AI業務改善ミニ診断", priceMin: 0, priceMax: 3000, target: "AI導入を検討中の個人事業主・小規模事業者", description: "現状業務をヒアリングし、AIで楽になりそうなポイントを洗い出す入口商品", deliverables: "診断シート / 改善ポイント3つ", salesAngle: "まず気軽に試せる無料〜低額の入口" },
    { name: "AI業務改善レポート", priceMin: 10000, priceMax: 30000, target: "具体的な改善余地を知りたい事業者", description: "業務フローを分析し、AI活用の改善案をレポート化", deliverables: "改善提案レポート（PDF）", salesAngle: "診断の次のステップとして提案" },
    { name: "スプレッドシート自動化ミニ改善", priceMin: 10000, priceMax: 50000, target: "Excel/スプレッドシート作業が多い事業者", description: "手作業の集計・転記を関数やGASで自動化", deliverables: "自動化済みシート / 簡易マニュアル", salesAngle: "目に見える時短効果で価値を実感してもらう" },
    { name: "ChatGPT業務活用レクチャー", priceMin: 10000, priceMax: 50000, target: "ChatGPTを業務で使いたい個人・小規模チーム", description: "業務に合わせたプロンプトと使い方を実演レクチャー", deliverables: "レクチャー（オンライン）/ プロンプト集", salesAngle: "教育系。継続relationの起点になりやすい" },
    { name: "社内FAQ/RAGミニPoC", priceMin: 50000, priceMax: 150000, target: "問い合わせ対応の多い事業者", description: "社内ドキュメントを使ったFAQボットの小規模PoC", deliverables: "PoC環境 / 効果検証メモ", salesAngle: "本格導入前の小さく試すPoC" },
    { name: "LINE/Google Sheets簡易ボット", priceMin: 30000, priceMax: 100000, target: "予約・受付・日報をLINEで回したい店舗・事業者", description: "LINEとスプレッドシートを連携した簡易ボット", deliverables: "稼働するボット / 運用手順", salesAngle: "現場でそのまま使える実用ツール" },
  ];
  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // ===== 案件候補 (架空・実在名なし・Z中心 + Y一部) =====
  const opportunities = [
    // === Z：完全新規（Google Map / Instagram から見つけた美容系3件） ===
    { sourceType: "manual_company", sourceName: "Google マップ検索", companyName: "（匿名）地域美容サロンA", rawText: "小規模美容サロン。予約フォームなし。LINE予約のみ。", industry: "美容", budgetHint: "不明", candidateType: "z", referrerName: "", painPoints: "LINE予約対応\n予約変更対応\n問い合わせ返信", tools: "LINE", temperature: "medium", memo: "Z：完全新規。美容サロン。予約・問い合わせ対応が面倒。Instagram DM で接触推奨。" },
    { sourceType: "manual_company", sourceName: "Instagram", companyName: "（匿名）整体院B", rawText: "インスタグラムで施術写真を毎日投稿。フォロー者500名。", industry: "美容・健康", budgetHint: "不明", candidateType: "z", referrerName: "", painPoints: "予約確認メール\n口コミ返信\nスタッフ共有", tools: "LINE, Instagram", temperature: "medium", memo: "Z：完全新規。整体院。Instagram DMで接触。口コミ返信が手作業。" },
    { sourceType: "manual_company", sourceName: "Google マップ検索", companyName: "（匿名）エステティック サロンC", rawText: "予約管理がExcel。問い合わせはメール・LINE両対応。", industry: "美容", budgetHint: "月5万円程度", candidateType: "z", referrerName: "", painPoints: "予約管理が手作業\nメール返信\nLINE返信", tools: "Excel, Gmail, LINE", temperature: "medium", memo: "Z：完全新規。美容サロン。予約・返信管理を問い合わせフォーム経由で接触。" },

    // === Z：完全新規（不動産・士業系2件） ===
    { sourceType: "manual_company", sourceName: "会社HP検索", companyName: "（匿名）不動産仲介事業者", rawText: "営業活動が多い。顧客フォローが重要。スタッフは3名。", industry: "不動産", budgetHint: "不明", candidateType: "z", referrerName: "", painPoints: "面談メモ整理\n次回フォロー管理\n返信下書き", tools: "Gmail, Excel", temperature: "medium", memo: "Z：完全新規。不動産営業。面談後のメモ・フォロー対応が面倒。" },
    { sourceType: "manual_company", sourceName: "Google マップ検索", companyName: "（匿名）行政書士事務所", rawText: "士業向けDX相談が増えている。書類作成が多い。", industry: "士業", budgetHint: "5〜10万円", candidateType: "z", referrerName: "", painPoints: "相談内容の整理\n必要書類案内\nメール返信", tools: "Gmail, Word, PDF", temperature: "medium", memo: "Z：完全新規。士業。PDF・書類確認が多い。無料診断で業務整理。" },

    // === Z：完全新規（紙・Excel系2件） ===
    { sourceType: "crowdsourcing", sourceName: "クラウドワークス", companyName: "（匿名）製造業（小規模）", rawText: "見積書・請求書・納期確認が紙とExcel混在。効率化したい。", industry: "製造", budgetHint: "10〜20万円", candidateType: "z", referrerName: "", painPoints: "紙帳票の目視確認\nExcel転記\n照合作業", tools: "Excel, 紙", temperature: "high", memo: "Z：完全新規。紙・Excel系。確認・転記・照合が手作業。温度感高い。" },
    { sourceType: "job_board", sourceName: "求人サイトD", companyName: "（匿名）小売店（複数店舗）", rawText: "日報確認と在庫確認が手作業。スプレッドシート導入希望。", industry: "小売", budgetHint: "5〜15万円", candidateType: "z", referrerName: "", painPoints: "日報確認\n在庫照合\n目視チェック", tools: "Excel, 紙", temperature: "medium", memo: "Z：完全新規。小売。日報・在庫の人力確認が負担。" },

    // === Y：紹介経由（1件） ===
    { sourceType: "referral", sourceName: "紹介（既知人脈経由）", companyName: "（匿名）税理士事務所", rawText: "業界知人からの紹介。ChatGPTを業務で使いたいが何から始めればいいか分からないとのこと。", industry: "士業", budgetHint: "不明", candidateType: "y", referrerName: "Cさん（業界知人）", painPoints: "相談内容の要約\nメール返信下書き", tools: "Gmail, Excel", temperature: "high", memo: "Y：紹介経由（Cさん紹介）。紹介者から信頼。温度感高い。丁寧に対応。" },

    // === Z：完全新規（通販・問い合わせ系1件） ===
    { sourceType: "inquiry", sourceName: "問い合わせフォーム", companyName: "（匿名）通販事業者E", rawText: "社内の問い合わせ対応を効率化したいと問い合わせあり。月50件以上のメール。", industry: "EC", budgetHint: "5〜15万円", candidateType: "z", referrerName: "", painPoints: "問い合わせメール対応\nよくある質問への返信", tools: "Gmail", temperature: "high", memo: "Z：完全新規。問い合わせ起点なので温度感は高い。無料診断→レポート→PoC。" },
  ];
  for (const o of opportunities) {
    await prisma.opportunity.create({ data: o });
  }

  // ===== リード (架空・副次) =====
  const leads = [
    { companyName: "（匿名）サンプル商店", industry: "小売", area: "東京", source: "サンプル", memo: "ECサイトあり" },
    { companyName: "（匿名）テスト工業", industry: "製造", area: "大阪", source: "サンプル", memo: "問い合わせ対応多め" },
    { companyName: "（匿名）デモ美容室", industry: "美容", area: "福岡", source: "サンプル", memo: "予約管理が手動" },
    { companyName: "（匿名）example士業事務所", industry: "士業", area: "名古屋", source: "サンプル", memo: "書類作成多い" },
    { companyName: "（匿名）テストカフェ", industry: "飲食", area: "札幌", source: "サンプル", memo: "SNS運用に課題" },
    { companyName: "（匿名）サンプル不動産", industry: "不動産", area: "東京", source: "サンプル", memo: "問い合わせフォームあり" },
    { companyName: "（匿名）demo建設", industry: "建設", area: "仙台", source: "サンプル", memo: "見積作成が手作業" },
    { companyName: "（匿名）example通販", industry: "EC", area: "横浜", source: "サンプル", memo: "FAQ整備したい" },
    { companyName: "（匿名）テスト整体院", industry: "健康", area: "京都", source: "サンプル", memo: "Web集客に課題" },
    { companyName: "（匿名）サンプルコンサル", industry: "コンサル", area: "東京", source: "サンプル", memo: "AI活用に興味" },
  ];
  for (const l of leads) {
    await prisma.lead.create({ data: l });
  }

  // ===== プロフィール雛形 =====
  const settings: Record<string, string> = {
    company_name: "〇〇AIサポート",
    sender_name: "（あなたの名前）",
    services: "中小企業・個人事業主向けのAI業務改善、ChatGPT導入支援、社内FAQボット作成、スプレッドシート自動化",
    achievements: "（実績があれば記入。なければ空欄でOK）",
    strengths: "現場業務をヒアリングし、最小構成で使えるAIツールを作る",
    area: "オンライン対応（全国）",
    sales_tone: "丁寧、押し売りしない、短文、相手の負担を減らす",
    forbidden_phrases: "絶対に / 必ず儲かる / 100%成果保証",
    price_range: "無料診断〜30万円程度",
    free_offer: "あり（15分無料相談 / 無料ミニ診断）",
    cta: "15分だけ無料で相談できます",
    signature: "————\n〇〇AIサポート / （あなたの名前）",
    compliance_footer: "今後のご連絡が不要な場合は、お手数ですがその旨お知らせください。",
    contact_info: "（メールアドレス等の連絡先）",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  console.log("Seed 完了: 商品6 / 案件候補8 / リード10 / 設定14");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
