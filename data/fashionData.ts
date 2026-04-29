import { FashionBrand, FashionTrendPoint } from "@/types/fashion";

export const fashionBrands: FashionBrand[] = [
  { id: "gucci", name: "Gucci", category: "Luxury", country: "Italia", score: 92, mentions: 18400, popularity: 91, sentiment: 82 },
  { id: "prada", name: "Prada", category: "Luxury", country: "Italia", score: 88, mentions: 14200, popularity: 86, sentiment: 79 },
  { id: "chanel", name: "Chanel", category: "Luxury", country: "Francia", score: 94, mentions: 20100, popularity: 93, sentiment: 85 },
  { id: "dior", name: "Dior", category: "Luxury", country: "Francia", score: 90, mentions: 17600, popularity: 89, sentiment: 83 },
  { id: "zara", name: "Zara", category: "Fast Fashion", country: "España", score: 84, mentions: 22100, popularity: 88, sentiment: 69 },
  { id: "mango", name: "Mango", category: "Fast Fashion", country: "España", score: 78, mentions: 12600, popularity: 77, sentiment: 73 },
  { id: "hm", name: "H&M", category: "Fast Fashion", country: "Suecia", score: 75, mentions: 15800, popularity: 76, sentiment: 66 },
  { id: "uniqlo", name: "Uniqlo", category: "Fast Fashion", country: "Japón", score: 81, mentions: 13400, popularity: 82, sentiment: 76 },
  { id: "cos", name: "COS", category: "Premium", country: "Reino Unido", score: 72, mentions: 8200, popularity: 70, sentiment: 78 },
  { id: "massimo-dutti", name: "Massimo Dutti", category: "Premium", country: "España", score: 74, mentions: 9100, popularity: 73, sentiment: 77 },
  { id: "sandro", name: "Sandro", category: "Premium", country: "Francia", score: 69, mentions: 6400, popularity: 68, sentiment: 74 },
  { id: "maje", name: "Maje", category: "Premium", country: "Francia", score: 67, mentions: 5900, popularity: 66, sentiment: 72 },
];

export const fashionTrendData: FashionTrendPoint[] = [
  { month: "Ene", brand: "Gucci", category: "Luxury", mentions: 12000, popularity: 79, sentiment: 76 },
  { month: "Feb", brand: "Gucci", category: "Luxury", mentions: 13200, popularity: 82, sentiment: 78 },
  { month: "Mar", brand: "Gucci", category: "Luxury", mentions: 15100, popularity: 86, sentiment: 80 },
  { month: "Abr", brand: "Gucci", category: "Luxury", mentions: 18400, popularity: 91, sentiment: 82 },

  { month: "Ene", brand: "Prada", category: "Luxury", mentions: 9800, popularity: 76, sentiment: 75 },
  { month: "Feb", brand: "Prada", category: "Luxury", mentions: 11100, popularity: 79, sentiment: 77 },
  { month: "Mar", brand: "Prada", category: "Luxury", mentions: 12800, popularity: 83, sentiment: 78 },
  { month: "Abr", brand: "Prada", category: "Luxury", mentions: 14200, popularity: 86, sentiment: 79 },

  { month: "Ene", brand: "Chanel", category: "Luxury", mentions: 15200, popularity: 86, sentiment: 80 },
  { month: "Feb", brand: "Chanel", category: "Luxury", mentions: 16900, popularity: 89, sentiment: 82 },
  { month: "Mar", brand: "Chanel", category: "Luxury", mentions: 18700, popularity: 91, sentiment: 84 },
  { month: "Abr", brand: "Chanel", category: "Luxury", mentions: 20100, popularity: 93, sentiment: 85 },

  { month: "Ene", brand: "Zara", category: "Fast Fashion", mentions: 16100, popularity: 78, sentiment: 63 },
  { month: "Feb", brand: "Zara", category: "Fast Fashion", mentions: 17900, popularity: 81, sentiment: 65 },
  { month: "Mar", brand: "Zara", category: "Fast Fashion", mentions: 19800, popularity: 85, sentiment: 67 },
  { month: "Abr", brand: "Zara", category: "Fast Fashion", mentions: 22100, popularity: 88, sentiment: 69 },

  { month: "Ene", brand: "Mango", category: "Fast Fashion", mentions: 8700, popularity: 67, sentiment: 70 },
  { month: "Feb", brand: "Mango", category: "Fast Fashion", mentions: 9400, popularity: 70, sentiment: 71 },
  { month: "Mar", brand: "Mango", category: "Fast Fashion", mentions: 10900, popularity: 74, sentiment: 72 },
  { month: "Abr", brand: "Mango", category: "Fast Fashion", mentions: 12600, popularity: 77, sentiment: 73 },

  { month: "Ene", brand: "COS", category: "Premium", mentions: 5100, popularity: 61, sentiment: 74 },
  { month: "Feb", brand: "COS", category: "Premium", mentions: 6300, popularity: 65, sentiment: 75 },
  { month: "Mar", brand: "COS", category: "Premium", mentions: 7100, popularity: 68, sentiment: 77 },
  { month: "Abr", brand: "COS", category: "Premium", mentions: 8200, popularity: 70, sentiment: 78 },

  { month: "Ene", brand: "Massimo Dutti", category: "Premium", mentions: 5700, popularity: 63, sentiment: 73 },
  { month: "Feb", brand: "Massimo Dutti", category: "Premium", mentions: 6800, popularity: 67, sentiment: 74 },
  { month: "Mar", brand: "Massimo Dutti", category: "Premium", mentions: 7900, popularity: 70, sentiment: 76 },
  { month: "Abr", brand: "Massimo Dutti", category: "Premium", mentions: 9100, popularity: 73, sentiment: 77 },
];