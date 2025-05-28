import { faker } from "@faker-js/faker";
import Color from "../models/colorModel.js";

function generateFakeColor() {
  return {
    name: faker.color.human(),
    hex_code: faker.color.rgb(),
    note: faker.lorem.words(5),
    isDeleted: false,
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}

export default async function seedColors(n = 5) {
  await Color.deleteMany();
  const colors = Array.from({ length: n }, generateFakeColor);
  await Color.insertMany(colors);
  console.log(`Seeded ${n} colors`);
}
