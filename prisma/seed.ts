import { PrismaClient } from "@prisma/client";
import { sub } from "date-fns";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin Kullanıcı",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "ahmet@example.com",
        name: "Ahmet Yılmaz",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        email: "ayse@example.com",
        name: "Ayşe Demir",
        role: "USER",
      },
    }),
  ]);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Teknoloji",
        slug: "teknoloji",
      },
    }),
    prisma.category.create({
      data: {
        name: "Seyahat",
        slug: "seyahat",
      },
    }),
    prisma.category.create({
      data: {
        name: "Yemek & Mutfak",
        slug: "yemek-mutfak",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sağlık & Yaşam",
        slug: "saglik-yasam",
      },
    }),
    prisma.category.create({
      data: {
        name: "Kişisel Gelişim",
        slug: "kisisel-gelisim",
      },
    }),
    prisma.category.create({
      data: {
        name: "Bilim",
        slug: "bilim",
      },
    }),
  ]);

  // Helper function to generate random past dates
  const randomPastDate = (maxDaysAgo: number) => {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    return sub(new Date(), { days: daysAgo });
  };

  // Sample post titles and content templates
  const postTemplates = [
    {
      tech: [
        "2024'te Yapay Zeka'nın Geleceği",
        "WebAssembly'yi Derinlemesine Anlamak",
        "Next.js ile Ölçeklenebilir Uygulamalar",
        "Rust ve Go: Performans Karşılaştırması",
        "Kuantum Bilişime Giriş",
      ],
      travel: [
        "Güneydoğu Asya'nın Gizli Cennetleri",
        "İsviçre Alpleri'nde Bir Hafta",
        "Avrupa Bütçe Seyahat Rehberi",
        "Asya'nın En İyi Sokak Lezzetleri",
        "Macera Seyahati: Patagonya Keşfi",
      ],
      food: [
        "Geleneksel Türk Mutfağı Tarifleri",
        "Vegan Yemek Pişirme Rehberi",
        "Dünya Mutfakları Füzyon Rehberi",
        "Mevsimsel Yemek: Bahar Tarifleri",
        "Ev Yapımı Ekmek Tarifleri",
      ],
      health: [
        "Mindfulness Meditasyon Rehberi",
        "Bitkisel Beslenmenin Faydaları",
        "Evde Spor Rutinleri",
        "Kaliteli Uyku İpuçları",
        "Stres Yönetimi Teknikleri",
      ],
      development: [
        "Etkili Alışkanlık Oluşturma",
        "Zaman Yönetimi Stratejileri",
        "Etkili İletişim Becerileri",
        "Finansal Planlama 101",
        "Hedef Belirleme Teknikleri",
      ],
      science: [
        "Astronomi'de Son Keşifler",
        "İklim Değişikliğini Anlamak",
        "Genetik Alanındaki Gelişmeler",
        "Uykunun Bilimi",
        "Nörobilim Temelleri",
      ],
    },
  ];

  // Create 50 posts
  const posts = [];
  for (let i = 1; i <= 50; i++) {
    const createdAt = randomPastDate(365);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const author = users[Math.floor(Math.random() * users.length)];

    let titles;
    switch (category.slug) {
      case "teknoloji":
        titles = postTemplates[0].tech;
        break;
      case "seyahat":
        titles = postTemplates[0].travel;
        break;
      case "yemek-mutfak":
        titles = postTemplates[0].food;
        break;
      case "saglik-yasam":
        titles = postTemplates[0].health;
        break;
      case "kisisel-gelisim":
        titles = postTemplates[0].development;
        break;
      case "bilim":
        titles = postTemplates[0].science;
        break;
      default:
        titles = postTemplates[0].tech;
    }

    const title = `${titles[Math.floor(Math.random() * titles.length)]} ${i}`;
    const slug = slugify(title, { lower: true, strict: true });

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content: `# ${title}

${
  category.slug === "teknoloji"
    ? `
Teknoloji dünyası her geçen gün hızla gelişmeye devam ediyor. Bu yazıda, son gelişmeleri ve gelecekteki etkilerini inceliyoruz.

## Önemli Noktalar

- Temel kavramlar
- Pratik uygulamalar
- Gelecekteki etkiler
- En iyi uygulamalar

### Teknik Detaylar

\`\`\`javascript
// Örnek kod implementasyonu
const uygula = async (veri) => {
  const sonuc = await veriIsleme(veri);
  return optimize(sonuc);
};
\`\`\`

## Gerçek Dünya Uygulamaları

1. Kurumsal çözümler
2. Tüketici uygulamaları
3. Araştırma ve geliştirme
4. Eğitim amaçlı kullanım

`
    : `
## Giriş

Bu kapsamlı rehber, ${title.toLowerCase()} hakkında bilmeniz gereken her şeyi size anlatacak. Temel kavramları, ileri düzey teknikleri ve hemen uygulayabileceğiniz pratik ipuçlarını ele alacağız.

### Önemli Noktalar

1. Temel kavramlar
2. Pratik uygulamalar
3. Uzman ipuçları
4. Sık yapılan hatalar

## Detaylı İnceleme

Bu bilgileri günlük hayatınızda nasıl en iyi şekilde kullanabileceğinizi inceleyelim.

### En İyi Uygulamalar

- Temelden başlayın
- Düzenli pratik yapın
- Uzmanlardan öğrenin
- Güncel kalın

`
}

## Sonuç

Bu yazıda ${title.toLowerCase()} konusunun temel yönlerini ele aldık. Umarız bu bilgiler size faydalı olmuştur.

Daha fazla bilgi için ilgili yazılarımıza göz atabilir veya aşağıda yorum bırakabilirsiniz.`,
        coverImage: `https://picsum.photos/seed/${i}/1200/630`,
        categoryId: category.id,
        authorId: author.id,
        createdAt,
        updatedAt: createdAt,
      },
    });

    // Add 2-5 comments for each post
    const numComments = Math.floor(Math.random() * 4) + 2;
    const commentTemplates = [
      "Harika bir yazı olmuş! Özellikle şu kısım çok iyiydi:",
      "Bu çok faydalı oldu. Tam da şu konu hakkında bilgi arıyordum:",
      "İlginç bir bakış açısı sunmuşsunuz:",
      "Paylaşım için teşekkürler! Şu konuda çok şey öğrendim:",
      "Çok iyi yazılmış ve bilgilendirici bir yazı:",
      "Bu konuyu uzun zamandır takip ediyordum, güzel bir içgörü sunmuşsunuz:",
      "Örnekler konuyu anlamama çok yardımcı oldu:",
      "Daha fazla içerik bekliyoruz şu konuda:",
    ];

    for (let j = 1; j <= numComments; j++) {
      const commentTemplate =
        commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      await prisma.comment.create({
        data: {
          content: `${commentTemplate} ${title.toLowerCase()}. ${
            j === 1
              ? "Yeni içeriklerinizi merakla bekliyorum!"
              : j === 2
              ? "Devamı için sabırsızlanıyorum."
              : "Teşekkürler!"
          }`,
          authorName: `Okuyucu ${Math.floor(Math.random() * 100) + 1}`,
          postId: post.id,
          createdAt: sub(createdAt, { hours: Math.random() * 24 * 7 }),
        },
      });
    }

    posts.push(post);
  }

  console.log(`Veritabanı başarıyla dolduruldu. 🌱`);
  console.log(`${users.length} kullanıcı oluşturuldu`);
  console.log(`${categories.length} kategori oluşturuldu`);
  console.log(`${posts.length} yazı oluşturuldu`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
