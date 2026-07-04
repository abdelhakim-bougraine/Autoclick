const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const categoryImageMap = {
  "Accessoires": "/images/accessoires.svg",
  "Entretien": "/images/entretien.svg",
  "Pièces": "/images/pieces.svg",
  "Éclairage": "/images/eclairage.svg",
  "Intérieur": "/images/interieur.svg",
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const Product = require("../models/Product");

  const products = await Product.find({});
  for (const product of products) {
    const localImage = categoryImageMap[product.category] || "/images/accessoires.svg";
    product.image = localImage;
    await product.save();
    console.log(`Updated: ${product.name} -> ${localImage}`);
  }

  console.log("Done");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
