export const MOCK_PRODUCTS = [
  {
    _id: "prod_1",
    id: "prod_1",
    name: "Bold Care Surge — Endurance & Stamina Gummies",
    slug: "bold-care-surge-endurance-stamina-gummies",
    category: "Sexual Wellness",
    price: 699,
    comparePrice: 999,
    rating: 4.9,
    reviewCount: 342,
    stock: 45,
    isBestSeller: true,
    isFeatured: true,
    isRx: false,
    benefitSummary: "L-Arginine, Gokshura & Safed Musli gummies for elevated blood flow & lasting vigor.",
    description: "Doctor-formulated daily gummies engineered for natural nitric oxide elevation, increased circulation, and enhanced bedroom endurance. Formulated with pure Gokshura, Safed Musli, and L-Arginine.",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "1 Month Pack (60 Gummies)", price: 699, comparePrice: 999, savings: "30% OFF" },
      { name: "3 Month Pack (180 Gummies)", price: 1799, comparePrice: 2997, savings: "40% OFF" }
    ],
    benefits: [
      "Boosts Nitric Oxide production for optimal circulation",
      "Increases stamina & physical resilience",
      "Zero added sugar, 100% plant-derived active extracts",
      "Delicious berry flavor with zero bitter aftertaste"
    ],
    ingredients: "Gokshura Extract (250mg), Safed Musli (200mg), L-Arginine (500mg), Zinc Monomethionine (12mg), Vitamin B12.",
    usage: "Chew 2 gummies daily after meals, ideally 30 minutes before bedtime or active workouts.",
    whoFor: "Men seeking natural daily stamina, improved blood flow, and sexual energy without pharmaceuticals.",
    whoNotFor: "Not intended for minors under 18 or individuals undergoing acute cardiovascular treatment without consulting a physician.",
    faqs: [
      { question: "How long until I see results?", answer: "Noticeable improvements in daily energy occur within 7 to 10 days of consistent daily consumption." },
      { question: "Are there any side effects?", answer: "Formulated with 100% clinical botanical extracts. Non-habit forming and safe for long-term daily use." }
    ]
  },
  {
    _id: "prod_2",
    id: "prod_2",
    name: "Pure Himalayan Shilajit Gold Soft Resin (>75% Fulvic)",
    slug: "pure-himalayan-shilajit-gold-resin",
    category: "Daily Performance",
    price: 1299,
    comparePrice: 1799,
    rating: 4.95,
    reviewCount: 512,
    stock: 28,
    isBestSeller: true,
    isFeatured: true,
    isRx: false,
    benefitSummary: ">75% Fulvic Acid purified soft resin enriched with 24K edible Gold Bhasma.",
    description: "Harvested from high-altitude Himalayan peaks above 18,000 ft. Purified using traditional Shodhana methods and lab-tested for heavy metals, fulvic potency, and 100% authenticity.",
    images: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "20g Jar (1 Month)", price: 1299, comparePrice: 1799, savings: "27% OFF" },
      { name: "50g Value Jar (2.5 Months)", price: 2799, comparePrice: 4497, savings: "38% OFF" }
    ],
    benefits: [
      "Increases free testosterone and overall power output",
      "Accelerates post-workout muscle recovery & stamina",
      "Enriched with 80+ essential trace minerals",
      "Includes brass measuring spoon & lab COA certificate"
    ],
    ingredients: "100% Pure Himalayan Shilajit Resin (75% Fulvic Acid minimum), Swarna Bhasma (24K Gold particles).",
    usage: "Dissolve a pea-sized portion (300mg) in warm milk or water once daily every morning.",
    whoFor: "Men looking for authentic Himalayan stamina boosters, gym endurance, and mental clarity.",
    whoNotFor: "Individuals with severe gout or high uric acid levels should consult a physician before using Shilajit.",
    faqs: [
      { question: "Is this certified for heavy metals?", answer: "Yes, every batch undergoes third-party ICP-MS testing for heavy metal purity and heavy metals safety." }
    ]
  },
  {
    _id: "prod_3",
    id: "prod_3",
    name: "Bold Care Apex — 5% Minoxidil + Redensyl Hair Drops",
    slug: "bold-care-apex-minoxidil-redensyl-hair-drops",
    category: "Grooming & Hair",
    price: 899,
    comparePrice: 1299,
    rating: 4.8,
    reviewCount: 289,
    stock: 60,
    isBestSeller: false,
    isFeatured: true,
    isRx: true,
    rxNotice: "Clinical formulation: Doctor consultation recommended for hair regrowth.",
    benefitSummary: "Clinically proven formula for reactivating dormant scalp hair follicles & thickening beard density.",
    description: "Non-greasy hair growth tonic engineered with 5% Minoxidil, 3% Redensyl, Procapil, and Saw Palmetto to stop hair thinning and stimulate thick follicle regrowth.",
    images: [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "60ml Bottle (1 Month)", price: 899, comparePrice: 1299, savings: "30% OFF" },
      { name: "180ml Pack (3 Months)", price: 2199, comparePrice: 3897, savings: "43% OFF" }
    ],
    benefits: [
      "Stimulates active regrowth in crown & hairline",
      "Blocks local DHT follicle miniaturization",
      "Alcohol-reduced formula prevents scalp dryness & itching"
    ],
    ingredients: "Minoxidil IP 5% w/v, Redensyl 3%, Procapil 2%, Saw Palmetto Berry Extract, Biotin, Caffeine.",
    usage: "Apply 1ml using dropper onto clean scalp/beard twice daily. Gently massage with fingertips.",
    whoFor: "Men experiencing male pattern baldness, receding hairline, or patchy beard growth.",
    whoNotFor: "Not for women or individuals under 18 years of age.",
    faqs: [
      { question: "Can I use this on my beard?", answer: "Yes! Redensyl and Procapil work exceptionally well for filling patchy beard areas." }
    ]
  },
  {
    _id: "prod_4",
    id: "prod_4",
    name: "Bold Care 404 Ultra-Thin Condoms (Featherlight 0.04mm)",
    slug: "bold-care-404-ultra-thin-condoms",
    category: "Condoms & Lubes",
    price: 349,
    comparePrice: 499,
    rating: 4.92,
    reviewCount: 620,
    stock: 120,
    isBestSeller: true,
    isFeatured: true,
    isRx: false,
    benefitSummary: "Ultra-thin 0.04mm natural latex condoms for skin-on-skin intimacy feeling.",
    description: "Designed for maximum sensitivity. Bold Care 404 condoms are electronically tested, pre-lubricated with non-sticky aloe silicone, and feature a contour fit that stays securely in place.",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "Pack of 10", price: 349, comparePrice: 499, savings: "30% OFF" },
      { name: "Pack of 30 (Value Saver)", price: 899, comparePrice: 1497, savings: "40% OFF" }
    ],
    benefits: [
      "Skin-on-skin feel (0.04mm ultra-thin barrier)",
      "100% Electronically air-tested for tear resistance",
      "Clean pleasant scent, zero harsh rubber odor"
    ],
    ingredients: "100% Pure Natural Rubber Latex, Medical-Grade Silicone Lubricant.",
    usage: "Unwrap carefully. Ensure rim is facing outward before unrolling onto erect anatomy.",
    whoFor: "Couples looking for maximum sensitivity, safety, and natural sensation.",
    whoNotFor: "Individuals with known latex allergies.",
    faqs: []
  },
  {
    _id: "prod_5",
    id: "prod_5",
    name: "Bold Care Lasting Touch — Delay Spray for Men",
    slug: "bold-care-lasting-touch-delay-spray",
    category: "Sexual Wellness",
    price: 799,
    comparePrice: 1199,
    rating: 4.88,
    reviewCount: 410,
    stock: 35,
    isBestSeller: true,
    isFeatured: true,
    isRx: true,
    rxNotice: "Over-the-counter endurance aid: Follow recommended pump dosage.",
    benefitSummary: "Quick-acting Lidocaine desensitizing spray to extend intimacy by up to 3x.",
    description: "Formulated for instant absorption. Temporarily desensitizes hypersensitive nerve endings, letting you control climax timing and enjoy longer, uninterrupted sessions without transfer to your partner.",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "20ml Spray Bottle (50+ sprays)", price: 799, comparePrice: 1199, savings: "33% OFF" }
    ],
    benefits: [
      "Extends intimacy duration by up to 3x",
      "Fast-acting spray absorbs within 10-15 minutes",
      "Transfer-safe formula when wiped prior to intercourse"
    ],
    ingredients: "Lidocaine USP 10% w/v in micro-emulsion spray base, Vitamin E Tocopherol.",
    usage: "Spray 3-4 pumps onto the head and shaft 15 minutes before intimacy. Wipe clean with damp cloth before contact.",
    whoFor: "Men seeking climax control and extended endurance.",
    whoNotFor: "Do not apply on broken or inflamed skin.",
    faqs: []
  },
  {
    _id: "prod_6",
    id: "prod_6",
    name: "Natural Aloe Organic Water-Based Lubricant",
    slug: "natural-aloe-water-based-lubricant",
    category: "Condoms & Lubes",
    price: 499,
    comparePrice: 699,
    rating: 4.85,
    reviewCount: 275,
    stock: 85,
    isBestSeller: false,
    isFeatured: true,
    isRx: false,
    benefitSummary: "100% Organic Aloe Vera personal lubricant, toy & condom compatible.",
    description: "Ultra-slippery, water-soluble personal gel enriched with organic Aloe Vera and Chamomile. Mimics natural body lubrication, rinses off effortlessly with warm water, and leaves zero sticky residue.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "100ml Pump Bottle", price: 499, comparePrice: 699, savings: "28% OFF" },
      { name: "250ml Family Pack", price: 899, comparePrice: 1398, savings: "35% OFF" }
    ],
    benefits: [
      "100% Water-based & condom compatible",
      "Non-staining formula washes away easily with water",
      "pH-balanced for sensitive skin and mucous membranes"
    ],
    ingredients: "Organic Aloe Barbadensis Juice, Plant Glycerin, Chamomile Extract, Hydroxyethyl Cellulose, Lactic Acid.",
    usage: "Dispense desired amount onto intimate areas. Reapply freely as needed.",
    whoFor: "Couples and solo play users desiring smooth friction-free moisture.",
    whoNotFor: "None. Suitable for all skin types.",
    faqs: []
  },
  {
    _id: "prod_7",
    id: "prod_7",
    name: "Bold Care FreshShield Intimate Wash pH 5.5",
    slug: "bold-care-freshshield-intimate-wash-ph-55",
    category: "Intimate Care",
    price: 399,
    comparePrice: 599,
    rating: 4.75,
    reviewCount: 198,
    stock: 90,
    isBestSeller: false,
    isFeatured: false,
    isRx: false,
    benefitSummary: "Tea tree oil & witch hazel wash to eliminate odor, sweat, and groin itching.",
    description: "Specially formulated for male intimate anatomy. Maintains the natural pH balance (5.5) of delicate skin while washing away sweat, odor, and chafing bacteria.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "200ml Bottle", price: 399, comparePrice: 599, savings: "33% OFF" }
    ],
    benefits: [
      "Eliminates intimate odor & groin sweat",
      "Soothes friction chafing & redness",
      "Free from harsh sulfates, parabens, and synthetic dyes"
    ],
    ingredients: "Tea Tree Essential Oil, Organic Aloe Vera, Witch Hazel, Lactic Acid (pH 5.5 balance), Chamomile.",
    usage: "Lather small amount gently during daily shower and rinse thoroughly with warm water.",
    whoFor: "Men wanting daily groin freshness, odor control, and hygiene.",
    whoNotFor: "External use only.",
    faqs: []
  },
  {
    _id: "prod_8",
    id: "prod_8",
    name: "KSM-66 Ashwagandha 600mg High-Potency",
    slug: "ksm-66-ashwagandha-600mg-high-potency",
    category: "Daily Performance",
    price: 549,
    comparePrice: 799,
    rating: 4.9,
    reviewCount: 367,
    stock: 75,
    isBestSeller: true,
    isFeatured: false,
    isRx: false,
    benefitSummary: "World's most clinically studied Ashwagandha root extract for cortisol & stress reduction.",
    description: "KSM-66 is the highest concentration full-spectrum root extract available. Clinically proven to lower cortisol stress hormones, elevate natural testosterone, and sharpen mental focus.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
    ],
    packs: [
      { name: "60 Veg Capsules (1 Month)", price: 549, comparePrice: 799, savings: "31% OFF" }
    ],
    benefits: [
      "Reduces serum cortisol & anxiety levels by 27%",
      "Improves muscle strength & cardiorespiratory stamina",
      "Supports deeper REM sleep cycles"
    ],
    ingredients: "KSM-66 Ashwagandha Organic Root Extract (600mg, 5% Withanolides), Piperine Black Pepper Extract (5mg).",
    usage: "Take 1 capsule twice daily with warm milk or water after meals.",
    whoFor: "Men suffering from daily stress, work anxiety, low energy, or poor sleep quality.",
    whoNotFor: "Consult doctor if taking anti-depressant medications.",
    faqs: []
  }
];

