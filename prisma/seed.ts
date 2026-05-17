import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // Limpiar datos existentes
  await prisma.brandReview.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.brandMetricsHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  // ==================== CREAR USUARIO ADMIN ====================

  const adminPassword = "Admin123!@#";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@trendfashion.com",
      name: "Administrador",
      password: hashedPassword,
      role: "admin",
      consultancy: "TrendFashion Analytics",
      subscription: "enterprise",
    },
  });

  console.log(`✅ Usuario admin creado:`);
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Password: ${adminPassword}`);

  // ==================== CREAR USUARIO DE PRUEBA ====================

  const testPassword = "Test123!@#";
  const testHashedPassword = await bcrypt.hash(testPassword, 10);

  const testUser = await prisma.user.create({
    data: {
      email: "demo@fashionanalytics.com",
      name: "Demo User",
      password: testHashedPassword,
      role: "user",
      consultancy: "Fashion Analytics Team",
      subscription: "pro",
    },
  });

  console.log(`✅ Usuario de prueba creado:`);
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Password: ${testPassword}`);

  // ==================== CREAR MARCAS ====================

  const brands = await Promise.all([
    // LUXURY
    prisma.brand.create({
      data: {
        name: "Chanel",
        category: "luxury",
        country: "France",
        logo: "https://via.placeholder.com/100?text=Chanel",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Prada",
        category: "luxury",
        country: "Italy",
        logo: "https://via.placeholder.com/100?text=Prada",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Dior",
        category: "luxury",
        country: "France",
        logo: "https://via.placeholder.com/100?text=Dior",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Gucci",
        category: "luxury",
        country: "Italy",
        logo: "https://via.placeholder.com/100?text=Gucci",
      },
    }),

    // PREMIUM
    prisma.brand.create({
      data: {
        name: "Massimo Dutti",
        category: "premium",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Massimo+Dutti",
      },
    }),
    prisma.brand.create({
      data: {
        name: "COS",
        category: "premium",
        country: "Sweden",
        logo: "https://via.placeholder.com/100?text=COS",
      },
    }),

    // FAST FASHION
    prisma.brand.create({
      data: {
        name: "Zara",
        category: "fastfashion",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Zara",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Mango",
        category: "fastfashion",
        country: "Spain",
        logo: "https://via.placeholder.com/100?text=Mango",
      },
    }),
    prisma.brand.create({
      data: {
        name: "H&M",
        category: "fastfashion",
        country: "Sweden",
        logo: "https://via.placeholder.com/100?text=H&M",
      },
    }),
  ]);

  console.log(`✅ Creadas ${brands.length} marcas`);

  // ==================== CREAR HISTÓRICO DE MÉTRICAS (12 meses) ====================

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  const metricsData = [];

  for (let i = 0; i < 12; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + i);

    for (const brand of brands) {
      // Datos realistas por categoría
      let baseMentions: number;
      let baseSentiment: number;
      let basePopularity: number;

      if (brand.category === "luxury") {
        baseMentions = 45 + Math.random() * 25;
        baseSentiment = 72 + Math.random() * 15;
        basePopularity = 78 + Math.random() * 12;
      } else if (brand.category === "premium") {
        baseMentions = 30 + Math.random() * 20;
        baseSentiment = 68 + Math.random() * 18;
        basePopularity = 65 + Math.random() * 15;
      } else {
        // fastfashion
        baseMentions = 60 + Math.random() * 30;
        baseSentiment = 60 + Math.random() * 20;
        basePopularity = 72 + Math.random() * 18;
      }

      // Añadir tendencia: algunos meses suben, otros bajan
      const trend = Math.sin((i / 12) * Math.PI * 2) * 10;

      metricsData.push({
        brandId: brand.id,
        date: currentDate,
        mentions: Math.round(baseMentions + trend),
        sentiment: Math.min(100, Math.max(0, baseSentiment + trend)),
        popularity: Math.min(100, Math.max(0, basePopularity + trend)),
        score: Math.min(
          100,
          Math.max(
            0,
            (baseSentiment + basePopularity + baseMentions / 10) / 2 + trend
          )
        ),
      });
    }
  }

  // Insertar todos los datos de métricas
  for (const metric of metricsData) {
    await prisma.brandMetricsHistory.create({
      data: metric,
    });
  }

  console.log(`✅ Creados ${metricsData.length} registros de histórico`);

  console.log("\n🎉 Seed completado exitosamente\n");
  console.log("═══════════════════════════════════════════════════");
  console.log("📌 CREDENCIALES DE ACCESO:");
  console.log("═══════════════════════════════════════════════════");
  console.log(`ADMIN:`);
  console.log(`  Email: admin@trendfashion.com`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`\nUSUARIO DE PRUEBA:`);
  console.log(`  Email: demo@fashionanalytics.com`);
  console.log(`  Password: ${testPassword}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
