class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering (gte, gt, lte, lt) for price
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let finalQuery = JSON.parse(queryStr);

        // 2) Implement search functionality
        if (this.queryString.search) {
            finalQuery.$or = [
                { name: { $regex: this.queryString.search, $options: 'i' } },
                { description: { $regex: this.queryString.search, $options: 'i' } }
            ];
        }

        // 3) Implement category filtering
        if (this.queryString.category) {
            finalQuery.category = this.queryString.category;
        }

        // 4) Implement price range filtering
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
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
export default APIFeatures;