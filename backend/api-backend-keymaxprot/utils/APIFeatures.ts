import mongoose, { Document, Query } from 'mongoose';

interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  [key: string]: any;
}

class APIFeatures<T extends Document> {
  public query: Query<T[], T>;
  private queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let finalQuery = JSON.parse(queryStr);

    if (this.queryString.search) {
      finalQuery.$or = [
        { name: { $regex: this.queryString.search, $options: 'i' } },
        { description: { $regex: this.queryString.search, $options: 'i' } }
      ];
    }

    if (this.queryString.category) {
      finalQuery.category = this.queryString.category;
    }

    if (this.queryString.minPrice || this.queryString.maxPrice) {
      finalQuery.price = {};
      if (this.queryString.minPrice) {
        finalQuery.price.$gte = parseFloat(this.queryString.minPrice);
      }
      if (this.queryString.maxPrice) {
        finalQuery.price.$lte = parseFloat(this.queryString.maxPrice);
      }
    }

    this.query = this.query.find(finalQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page || '1', 10);
    const limit = parseInt(this.queryString.limit || '100', 10);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
