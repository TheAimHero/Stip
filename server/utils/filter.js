class filter {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filterQuery() {
    if (!this.queryObj.deadline) return this;
    const queryObj = { ...this.queryObj };
    // @note: filter out some fields that are not needed
    const excludedFields = ['sort', 'sortFields', 'pagination'];
    excludedFields.forEach(el => delete queryObj[el]);
    const queryEnteries = Object.entries(queryObj.deadline);
    queryEnteries.forEach(el => {
      el[0] = `$${el[0]}`;
      el[1] = Date.now() + el[1] * 24 * 60 * 60 * 1000;
    });
    queryObj.deadline = Object.fromEntries(queryEnteries);
    this.query = this.query.find(queryObj);
    return this;
  }

  sortBy() {
    let sortField = this.queryObj?.sort;
    if (!sortField) {
      this.query = this.query.sort('-createdAt');
      return this;
    }
    sortField = sortField.replace(/,/g, ' ');
    this.query = this.query.sort(sortField);
    return this;
  }

  sortFields() {
    let sortFields = this.queryObj?.sortFields;
    if (!sortFields) {
      this.query = this.query.select('-__v');
      return this;
    }
    sortFields = sortFields.replace(/,/g, ' ');
    this.query = this.query.select(`${sortFields} -_id`);
    return this;
  }

  // @todo: implement pagination
}

export default filter;
