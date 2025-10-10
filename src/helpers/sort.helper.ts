const sortHelper = (sortBy?: string, sortOrder?: string) => {
  if (!sortBy || !sortOrder) {
    return {};
  }

  const sort: { [key: string]: 'asc' | 'desc' } = {
    [sortBy]: sortOrder === 'des' ? 'desc' : 'asc',
  };
  return sort;
};

export default sortHelper;
