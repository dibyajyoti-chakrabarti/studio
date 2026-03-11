import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const products = [
    {
        sku: "BRG-6201-2RS",
        name: "Bearing 6201-2RS",
        specs: "12x32x10mm sealed",
        basePrice: 149,
        salePrice: 99,
        inventory: 100,
        categoryId: "bearings",
        slug: "bearing-6201-2rs",
        description: "Standard deep groove ball bearing, double rubber sealed for protection against dust and moisture.",
        isActive: true,
        features: ["Double rubber sealed", "High-speed rotation", "Low friction", "Deep groove design"],
        technicalSpecs: {
            "Inner Diameter": "12mm",
            "Outer Diameter": "32mm",
            "Width": "10mm",
            "Material": "Chrome Steel",
            "Seal Type": "2RS (Rubber Sealed)"
        },
        applications: ["Electric Motors", "Home Appliances", "Automotive Parts", "Industrial Fans"],
        faqs: [
            { q: "Is it pre-lubricated?", a: "Yes, it comes pre-lubricated for immediate install." },
            { q: "What is the max RPM?", a: "Rated for up to 15,000 RPM." }
        ],
        reviews: [
            { user: "Aman S.", rating: 5, comment: "High quality, fits perfectly in my motor.", date: "2024-03-01" }
        ],
        compatibility: ["12mm shafts", "General industrial machinery"],
        images: ["https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800"]
    },
    {
        sku: "BRG-6202-2RS",
        name: "Bearing 6202-2RS",
        specs: "15x35x11mm sealed",
        basePrice: 149,
        salePrice: 99,
        inventory: 100,
        categoryId: "bearings",
        slug: "bearing-6202-2rs",
        description: "Medium-sized ball bearing, high-precision for industrial motors and machinery.",
        isActive: true,
        features: ["Precision Grade P6", "Quiet operation", "Long service life"],
        technicalSpecs: {
            "Inner Diameter": "15mm",
            "Outer Diameter": "35mm",
            "Width": "11mm",
            "Load Rating (Dynamic)": "7.7 kN",
            "Material": "Carbon Steel"
        },
        applications: ["Gearboxes", "Pumps", "Conveyors"],
        faqs: [
            { q: "Can it handle axial loads?", a: "Yes, it is designed for both radial and axial loads." }
        ],
        reviews: [
            { user: "Vikram R.", rating: 4, comment: "Good bearing for the price.", date: "2024-02-15" }
        ],
        compatibility: ["15mm shaft assemblies"],
        images: ["https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800"]
    },
    {
        sku: "BRG-6203-2RS",
        name: "Bearing 6203-2RS",
        specs: "17x40x12mm sealed",
        basePrice: 179,
        salePrice: 119,
        inventory: 75,
        categoryId: "bearings",
        slug: "bearing-6203-2rs",
        description: "Heavy-duty ball bearing for high-load applications.",
        isActive: true,
        features: ["Heavy load capacity", "Low noise", "Thermal stability"],
        technicalSpecs: {
            "Inner Diameter": "17mm",
            "Outer Diameter": "40mm",
            "Width": "12mm",
            "Seal": "Nitrile Rubber"
        },
        applications: ["Agriculture Equipment", "Textile Machinery", "Construction"],
        faqs: [
            { q: "Is it heat resistant?", a: "Safe up to 120°C." }
        ],
        reviews: [],
        compatibility: ["17mm industrial shafts"],
        images: ["https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800"]
    },
    {
        sku: "BRG-6204-2RS",
        name: "Bearing 6204-2RS",
        specs: "20x47x14mm sealed",
        basePrice: 199,
        salePrice: 149,
        inventory: 50,
        categoryId: "bearings",
        slug: "bearing-6204-2rs",
        description: "Precision engineered ball bearing for high-speed shafts and automotive use.",
        isActive: true,
        features: ["High speed rating", "Corrosion resistant", "Maintenance free"],
        technicalSpecs: {
            "Inner Diameter": "20mm",
            "Outer Diameter": "47mm",
            "Width": "14mm",
            "Tolerance": "ABEC-3"
        },
        applications: ["Alternators", "Washing Machines", "Wheel Hubs"],
        faqs: [],
        reviews: [],
        compatibility: ["20mm shafts"],
        images: ["https://images.unsplash.com/photo-1594819047050-99def0f34101?q=80&w=800"]
    },
    {
        sku: "LNR-LM8UU",
        name: "Linear Bearing LM8UU",
        specs: "8x15x24mm",
        basePrice: 199,
        salePrice: 149,
        inventory: 120,
        categoryId: "linear-motion",
        slug: "linear-bearing-lm8uu",
        description: "Standard linear motion bearing for 8mm rods, used in 3D printers and CNC machines.",
        isActive: true,
        features: ["Smooth linear motion", "Compact design", "Compatible with 8mm rods", "Durable steel housing"],
        technicalSpecs: {
            "Inner Diameter": "8mm",
            "Outer Diameter": "15mm",
            "Length": "24mm",
            "Material": "Bearing Steel",
            "Structure": "Recirculating Balls"
        },
        applications: ["3D Printers (Prusa, Creality)", "Small CNC Machines", "Robotics Projects", "Automation Jigs"],
        faqs: [
            { q: "Is it compatible with 8mm smooth rods?", a: "Yes, specifically designed for 8mm hardened smooth rods." },
            { q: "Should I lubricate it?", a: "They come with light preservative oil. Using Lithium grease is recommended for smoother operation." }
        ],
        reviews: [
            { user: "Rahul M.", rating: 5, comment: "Perfect fit for my 3D printer axis.", date: "2024-03-05" },
            { user: "Arjun P.", rating: 4, comment: "Smooth operation, much better than cheap generic ones.", date: "2024-03-02" }
        ],
        compatibility: ["8mm Smooth Rods", "3D Printer Axis Kits"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "BLT-GT2-6MM",
        name: "GT2 Timing Belt (per m)",
        specs: "6mm wide, 2mm pitch",
        basePrice: 169,
        salePrice: 119,
        inventory: 200,
        categoryId: "transmission",
        slug: "gt2-timing-belt-6mm",
        description: "High-quality rubber timing belt with fiberglass reinforcement for precision motion.",
        isActive: true,
        features: ["Fiberglass reinforcement", "Zero backlash", "Precision positioning"],
        technicalSpecs: {
            "Width": "6mm",
            "Pitch": "2mm",
            "Material": "Neoprene Rubber",
            "Tensile Strength": "High"
        },
        applications: ["3D Printers", "Plotters", "Automation Kits"],
        faqs: [],
        reviews: [],
        compatibility: ["GT2 Pulleys (20T, 16T)"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "PLY-GT2-20T",
        name: "GT2 Pulley 20T 5mm",
        specs: "Aluminum, 5mm bore",
        basePrice: 199,
        salePrice: 149,
        inventory: 150,
        categoryId: "transmission",
        slug: "gt2-pulley-20t-5mm",
        description: "20 teeth aluminum pulley for GT2 belt. Comes with 5mm bore for NEMA 17 motors.",
        isActive: true,
        features: ["High-grade Aluminum", "Precise tooth profile", "Dual set screws"],
        technicalSpecs: {
            "Teeth Count": "20",
            "Bore": "5mm",
            "Belt Type": "GT2 (2mm pitch)",
            "Material": "Aluminum Alloy"
        },
        applications: ["Stepper Motor Drive", "CNC Projects"],
        faqs: [],
        reviews: [],
        compatibility: ["NEMA 17 Stepper Motors", "GT2 6mm Belts"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "CPL-6X8MM",
        name: "Shaft Coupler 6x8mm",
        specs: "Aluminum flexible",
        basePrice: 199,
        salePrice: 149,
        inventory: 80,
        categoryId: "transmission",
        slug: "shaft-coupler-6x8mm",
        description: "Flexible jaw coupler to connect 6mm and 8mm shafts, absorbing vibrations.",
        isActive: true,
        features: ["Anti-vibration", "Zero maintenance", "Flexible coupling"],
        technicalSpecs: {
            "Bore A": "6mm",
            "Bore B": "8mm",
            "Length": "25mm",
            "Outside Diameter": "19mm"
        },
        applications: ["Encoders", "Screw Drives"],
        faqs: [],
        reviews: [],
        compatibility: ["Lead Screws", "NEMA shafts"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "ROD-6MM-500",
        name: "Smooth Rod 8mm x 500mm",
        specs: "Chrome plated, hardened",
        basePrice: 349,
        salePrice: 249,
        inventory: 40,
        categoryId: "linear-motion",
        slug: "smooth-rod-8mm-500mm",
        description: "Hardened steel rod with chrome plating for smooth linear movement.",
        isActive: true,
        features: ["Hardened surface", "Precision tolerance", "Chrome plated"],
        technicalSpecs: {
            "Diameter": "8mm",
            "Length": "500mm",
            "Tolerance": "h8",
            "Surface Hardness": "HRC 60-62"
        },
        applications: ["Linear Guides", "Industrial Rails"],
        faqs: [],
        reviews: [],
        compatibility: ["LM8UU Linear Bearings"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "SHT-AL-1MM",
        name: "Al Sheet 1mm 300x300mm",
        specs: "6061-T6, cut to size",
        basePrice: 699,
        salePrice: 549,
        inventory: 30,
        categoryId: "raw-materials",
        slug: "al-sheet-1mm-300x300",
        description: "High-strength aluminum alloy sheet, corrosion-resistant.",
        isActive: true,
        features: ["High strength", "Good machinability", "Weldable"],
        technicalSpecs: {
            "Thickness": "1mm",
            "Size": "300x300mm",
            "Grade": "6061-T6",
            "Finish": "Mill Finish"
        },
        applications: ["Panels", "Aerospace Parts", "Brackets"],
        faqs: [],
        reviews: [],
        compatibility: ["Industrial chassis designs"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "SHT-AL-2MM",
        name: "Al Sheet 2mm 300x300mm",
        specs: "6061-T6, cut to size",
        basePrice: 999,
        salePrice: 799,
        inventory: 25,
        categoryId: "raw-materials",
        slug: "al-sheet-2mm-300x300",
        description: "2mm precision aluminum plate for structural components.",
        isActive: true,
        features: ["Structural grade", "Precision thickness", "Standard sheet size"],
        technicalSpecs: {
            "Thickness": "2mm",
            "Size": "300x300mm",
            "Grade": "6061-T6"
        },
        applications: ["Mainframes", "Heavy Brackets"],
        faqs: [],
        reviews: [],
        compatibility: ["Heavy-duty enclosures"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "SHT-AL-3MM",
        name: "Al Sheet 3mm 300x300mm",
        specs: "6061-T6, cut to size",
        basePrice: 1499,
        salePrice: 1099,
        inventory: 20,
        categoryId: "raw-materials",
        slug: "al-sheet-3mm-300x300",
        description: "3mm thick aluminum plate for industrial heat sinks and chassis.",
        isActive: true,
        features: ["Heavy plate", "Superior stiffness", "Machinable"],
        technicalSpecs: {
            "Thickness": "3mm",
            "Grade": "6061-T6"
        },
        applications: ["Heat Sinks", "Base Plates"],
        faqs: [],
        reviews: [],
        compatibility: ["Machined bases"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "EXT-2020-500",
        name: "2020 Extrusion 500mm",
        specs: "T-slot, Al 6063",
        basePrice: 749,
        salePrice: 549,
        inventory: 60,
        categoryId: "raw-materials",
        slug: "2020-extrusion-500mm",
        description: "Anodized black aluminum T-slot extrusion for frame building.",
        isActive: true,
        features: ["Modular design", "Anodized finish", "T-slot standard"],
        technicalSpecs: {
            "Type": "2020 (20mm x 20mm)",
            "Length": "500mm",
            "Slot": "6mm T-Slot",
            "Material": "Aluminium 6063"
        },
        applications: ["Printer Frames", "Workstations", "Sim Rigs"],
        faqs: [],
        reviews: [],
        compatibility: ["2020 Series Fittings", "M5 T-Nuts"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "FST-ECLIP-8MM",
        name: "E-clip 8mm (10 pcs pack)",
        specs: "External retaining ring",
        basePrice: 149,
        salePrice: 99,
        inventory: 500,
        categoryId: "fasteners",
        slug: "e-clip-8mm-pack",
        description: "Spring steel E-clips for securing 8mm shafts.",
        isActive: true,
        features: ["High spring tension", "DIN 6799 compliant", "Secures 8mm grooves"],
        technicalSpecs: {
            "Size": "8mm",
            "Material": "Carbon Spring Steel",
            "Standard": "DIN 6799"
        },
        applications: ["Shaft Retainment", "Linkage Systems"],
        faqs: [],
        reviews: [],
        compatibility: ["Shaft Grooves"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    },
    {
        sku: "K-PAR-5X5X20",
        name: "Parallel Key 5x5x20mm",
        specs: "DIN 6885, mild steel",
        basePrice: 129,
        salePrice: 89,
        inventory: 1000,
        categoryId: "fasteners",
        slug: "parallel-key-5x5x20mm",
        description: "Mild steel parallel key for torque transmission between shaft and hub.",
        isActive: true,
        features: ["Precision fit", "Standard DIN size", "High torque handling"],
        technicalSpecs: {
            "Width": "5mm",
            "Height": "5mm",
            "Length": "20mm",
            "Standard": "DIN 6885"
        },
        applications: ["Pulleys", "Couplings", "Motors"],
        faqs: [],
        reviews: [],
        compatibility: ["Standard Keyways"],
        images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"]
    }
];

async function seed() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }

    const db = admin.firestore();
    const batch = db.batch();

    console.log('Seeding products...');

    products.forEach((product) => {
        const docRef = db.collection('products').doc();
        batch.set(docRef, {
            ...product,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            images: [] // To be filled later via Admin UI or Storage
        });
    });

    await batch.commit();
    console.log('Seed successful! 15 products added.');
}

seed().catch(console.error);
