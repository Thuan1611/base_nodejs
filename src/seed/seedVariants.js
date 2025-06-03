import { faker } from "@faker-js/faker";
import ProductVariant from "../models/variantModel.js";
import Size from "../models/sizeModel.js";
import Color from "../models/colorModel.js";

function generateFakeVariant(sizes, colors) {
  return {
    product_id: faker.number.int({ min: 1, max: 100 }),
    size_id: sizes[faker.number.int({ min: 0, max: sizes.length - 1 })]._id,
    color_id: colors[faker.number.int({ min: 0, max: colors.length - 1 })]._id,
    sku: faker.string.alphanumeric(8).toUpperCase(),
    additional_price: faker.number.float({ min: 0, max: 50, precision: 0.01 }),
    image_url: faker.image.urlLoremFlickr({ category: "product" }),
    note: faker.lorem.words(5),
    isDeleted: false,
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}

export default async function seedVariants(n = 10) {
  await ProductVariant.deleteMany();
  const sizes = await Size.find();
  const colors = await Color.find();
  if (sizes.length === 0 || colors.length === 0) {
    throw new Error("Please seed Sizes and Colors first");
  }
  const variants = Array.from({ length: n }, () =>
    generateFakeVariant(sizes, colors)
  );
  await ProductVariant.insertMany(variants);
  console.log(`Seeded ${n} variants`);
}
