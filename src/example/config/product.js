// @flow

import {
  ProductTagModel,
} from '../models'

/*
 * Assume that we query:
 *   - category by _id (default)
 *   - tag by slug. So we need a preprocess function to convert Tag slug to _id
 */
export const filters = {
  category: {
    dbField: 'categories',
    dbType: String,
    compareType: 'EQUAL',
  },
  tag: {
    dbType: String,
    compareType: 'EQUAL',
    preprocess: async (tag: string) => {
      const obj = await ProductTagModel.Model.findOne({ slug: tag }).select('_id')
      if (obj) {
        return { tags: obj._id }
      }
      return {}
    },
  },
  brand: {
    dbField: 'brands',
    dbType: String,
    compareType: 'EQUAL',
  },
}

export const populate = ['category', 'categories', 'tags', 'brands']
