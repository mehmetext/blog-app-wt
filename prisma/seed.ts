import { CommentStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sub } from "date-fns";
import slugify from "slugify";

const prisma = new PrismaClient();

const postTemplates = {
  teknoloji: [
    "Yapay Zeka'nın İş Dünyasına Etkileri",
    "Web 3.0 ve Blockchain Teknolojisi",
    "Siber Güvenlik: Güncel Tehditler ve Önlemler",
    "5G Teknolojisi ve Geleceği",
    "Metaverse: Sanal Gerçekliğin Yeni Boyutu",
    "Türkiye'de Yazılım Geliştirme Trendleri",
    "Mobil Uygulama Geliştirme Rehberi",
    "Veri Bilimi ve Yapay Zeka Uygulamaları",
  ],
  seyahat: [
    "Kapadokya'da Balon Turu Deneyimi",
    "Ege'nin İncisi: Çeşme Gezi Rehberi",
    "İstanbul'un Gizli Kalmış Köşeleri",
    "Doğu Ekspresi ile Unutulmaz Bir Yolculuk",
    "Karadeniz Yaylalarında Bir Hafta",
    "Likya Yolu'nda Trekking Macerası",
    "Mardin'in Tarihi Sokaklarında",
    "Pamukkale Travertenlerinin Büyüsü",
  ],
  "yemek-mutfak": [
    "Geleneksel Türk Kahvaltısı Hazırlama",
    "En İyi Mantı Yapmanın Püf Noktaları",
    "Ev Yapımı Lahmacun Tarifi",
    "Osmanlı Mutfağından Seçme Tarifler",
    "Zeytinyağlı Yemekler Rehberi",
    "Türk Tatlıları: Baklava Yapımı",
    "Anadolu'nun Yöresel Lezzetleri",
    "Sokak Lezzetleri: Kokoreç ve Midye",
  ],
  "saglik-yasam": [
    "Sağlıklı Beslenme İlkeleri",
    "Yoga ile Stres Yönetimi",
    "Doğal Detoks Yöntemleri",
    "Bağışıklık Sistemini Güçlendirme",
    "Evde Spor Rutini Oluşturma",
    "Meditasyon ve Mindfulness Rehberi",
    "Sağlıklı Uyku için İpuçları",
    "Doğal Cilt Bakım Önerileri",
  ],
  "kisisel-gelisim": [
    "Etkili Zaman Yönetimi Teknikleri",
    "İş Hayatında İletişim Becerileri",
    "Finansal Özgürlük için Stratejiler",
    "Kişisel Marka Oluşturma Rehberi",
    "Stres Yönetimi ve Motivasyon",
    "Kariyer Planlama İpuçları",
    "Liderlik Becerileri Geliştirme",
    "Etkili Sunum Teknikleri",
  ],
  bilim: [
    "Türk Bilim İnsanlarının Başarıları",
    "Uzay Araştırmalarında Son Gelişmeler",
    "İklim Değişikliği ve Türkiye",
    "Kuantum Bilgisayarlar",
    "Genetik Mühendisliğinin Geleceği",
    "Yenilenebilir Enerji Kaynakları",
    "Nörobilim ve Beyin Araştırmaları",
    "CERN ve Parçacık Fiziği",
  ],
};

const commentTemplates = [
  "Harika bir yazı olmuş, teşekkürler!",
  "Bu konuda çok faydalı bilgiler var.",
  "Yazıyı büyük bir ilgiyle okudum.",
  "Özellikle son bölüm çok etkileyiciydi.",
  "Daha fazla içerik bekliyoruz.",
  "Konuyu çok güzel açıklamışsınız.",
  "Bu bilgiler tam da aradığım şeylerdi.",
  "Çok detaylı ve bilgilendirici olmuş.",
  "Kesinlikle katılıyorum, süper bir analiz.",
  "Farklı bir bakış açısı kazandırdınız.",
];

const authorNames = [
  "Ahmet Yılmaz",
  "Ayşe Demir",
  "Mehmet Kaya",
  "Zeynep Çelik",
  "Can Öztürk",
  "Elif Yıldız",
  "Mustafa Aydın",
  "Deniz Şahin",
  "Gül Aksoy",
  "Emre Koç",
];

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
        hashedPassword: bcrypt.hashSync("admin", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "yazar@example.com",
        name: "Yazar Kullanıcı",
        role: "USER",
        hashedPassword: bcrypt.hashSync("123456", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "editor@example.com",
        name: "Editör Kullanıcı",
        role: "USER",
        hashedPassword: bcrypt.hashSync("123456", 10),
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

  // Helper function to get random content for a category
  const getRandomContent = (categorySlug: string, title: string) => {
    const baseContent = `# ${title}

## Giriş

Bu yazımızda ${title.toLowerCase()} konusunu detaylıca ele alacağız. 

## Ana Başlıklar

1. Temel Kavramlar
2. Önemli Noktalar
3. Pratik Uygulamalar
4. Sık Sorulan Sorular

## Detaylı İnceleme

${
  categorySlug === "teknoloji"
    ? `
\`\`\`javascript
// Örnek kod
const teknoloji = {
  yapayZeka: true,
  blockchain: "gelecek",
  veri: "değerli"
};
\`\`\`
`
    : ""
}

### Önemli Noktalar

- ${title} hakkında bilinmesi gerekenler
- Güncel gelişmeler ve trendler
- Pratik ipuçları
- Uzman görüşleri

## Sonuç

Bu yazımızda ${title.toLowerCase()} konusunu detaylıca ele aldık. Umarız faydalı olmuştur.

### Kaynaklar

1. Türkiye'deki araştırmalar
2. Uluslararası kaynaklar
3. Uzman görüşleri
4. Güncel istatistikler`;

    return baseContent;
  };

  // Create posts
  const posts = [];
  for (const category of categories) {
    const titles = postTemplates[category.slug as keyof typeof postTemplates];

    for (const title of titles) {
      const createdAt = randomPastDate(365);
      const author = users[Math.floor(Math.random() * users.length)];
      const slug = slugify(title, { lower: true, strict: true });

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content: getRandomContent(category.slug, title),
          coverImage: `https://picsum.photos/seed/${slug}/1200/630`,
          categoryId: category.id,
          authorId: author.id,
          createdAt,
          updatedAt: createdAt,
        },
      });

      // Add 2-5 comments for each post
      const numComments = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < numComments; j++) {
        const commentCreatedAt = sub(createdAt, {
          hours: Math.floor(Math.random() * 24 * 7),
        });

        await prisma.comment.create({
          data: {
            content:
              commentTemplates[
                Math.floor(Math.random() * commentTemplates.length)
              ],
            authorName:
              authorNames[Math.floor(Math.random() * authorNames.length)],
            postId: post.id,
            status: ["PENDING", "APPROVED", "APPROVED", "APPROVED"][
              Math.floor(Math.random() * 4)
            ] as CommentStatus,
            createdAt: commentCreatedAt,
            updatedAt: commentCreatedAt,
          },
        });
      }

      posts.push(post);
    }
  }

  console.log(`Veritabanı başarıyla dolduruldu! 🌱`);
  console.log(`${users.length} kullanıcı oluşturuldu`);
  console.log(`${categories.length} kategori oluşturuldu`);
  console.log(`${posts.length} gönderi oluşturuldu`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
