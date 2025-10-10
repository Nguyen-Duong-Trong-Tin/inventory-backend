const paginationHelper = (page?: number, limit?: number) => {
  const pagination = {
    page: 1,
    limit: 20,
    skip: 0,
  };

  if (page && limit) {
    pagination.page = page;
    pagination.limit = limit;
    pagination.skip = (page - 1) * limit;
  }

  return pagination;
};

export default paginationHelper;
