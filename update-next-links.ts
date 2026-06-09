import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // NEXT LINKSのレコードを検索
  const opportunity = await prisma.opportunity.findFirst({
    where: {
      companyName: {
        contains: 'NEXT'
      }
    }
  });

  if (!opportunity) {
    console.log('NEXT LINKS のレコードが見つかりません。新規作成します。');

    // 新規レコードを作成
    const created = await prisma.opportunity.create({
      data: {
        companyName: '株式会社NEXT LINKS',
        sourceType: 'manual_company',
        sourceName: 'Prospect Database',
        status: 'send_failed',
        sentChannel: 'contact_form',
        sentTo: '公式問い合わせフォーム',
        sentUrl: 'https://www.nx-lk.jp/contact/',
        lpUrl: 'https://telecom-staff-ai-demo.vercel.app/?src=next-links',
        replyStatus: 'none',
        memo: 'NEXT LINKS公式問い合わせフォームを確認。営業禁止文言は確認できなかったが、電話番号が必須項目だったため送信中止。営業用公開電話番号がないため、個人電話番号・架空番号は入力せず。技術的POST bypassも未実施。Dify直URLは未送付。個人名も未入力。'
      }
    });

    console.log('新規作成完了:', created);
    return;
  }

  console.log('見つかったレコード:', opportunity.id, opportunity.companyName);

  // レコードを update
  const updated = await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: {
      status: 'send_failed',
      sentChannel: 'contact_form',
      sentTo: '公式問い合わせフォーム',
      sentUrl: 'https://www.nx-lk.jp/contact/',
      lpUrl: 'https://telecom-staff-ai-demo.vercel.app/?src=next-links',
      replyStatus: 'none',
      memo: 'NEXT LINKS公式問い合わせフォームを確認。営業禁止文言は確認できなかったが、電話番号が必須項目だったため送信中止。営業用公開電話番号がないため、個人電話番号・架空番号は入力せず。技術的POST bypassも未実施。Dify直URLは未送付。個人名も未入力。'
    }
  });

  console.log('更新完了:', updated);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
