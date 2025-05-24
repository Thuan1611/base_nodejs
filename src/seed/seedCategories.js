import { faker } from "@faker-js/faker";
import Category from "../models/categoryModel.js";

function generateFakeCategory() {
  const name = faker.commerce.department();
  const slug = faker.helpers.slugify(name).toLowerCase();

  return {
    name,
    description: faker.lorem.sentence(),
    image: faker.image.urlLoremFlickr({ category: "product" }),
    isDeleted: false,
    slug,
    created_at: faker.date.past(),
    updated_at: new Date(),
    note: faker.lorem.words(5),
  };
}

export default async function seedCategories(n = 10) {
  // số lượng danh mục muốn tạo
  await Category.deleteMany();
  const categories = Array.from({ length: n }, generateFakeCategory);
  await Category.insertMany(categories);
  console.log(`Seeded ${n} categories`);
}
