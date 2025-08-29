// utils/paginateAndSearch.js
export const paginateAndSearch = async ({
  model,
  page = 1,
  limit = 10,
  search = "",
  searchField = "name",
  sortBy = "createdAt",
  sortOrder = "desc",
  filter = {},
  populate = "",
}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const query = {
    ...filter,
  };

  if (search && searchField) {
    query[searchField] = { $regex: search, $options: "i" };
  }

  let mongooseQuery = model.find(query);

  if (populate) {
    mongooseQuery = mongooseQuery.populate(populate);
  }

  const data = await mongooseQuery
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await model.countDocuments(query);

  return {
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};
