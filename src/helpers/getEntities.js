// @flow

import { appCode } from '../config'

const debug = require('debug')(`${appCode}:getEntities`)

export default async function getEntities({
  Model,
  mongoFilter,
  sort,
  page,
  limit,
  skip,
  projection,
  populate = [],
}: {
  Model: any,
  mongoFilter: MongoFilter,
  sort: string,
  page: number,
  limit: number,
  skip: number,
  projection?: string | string[],
  populate: Array<string>,
}) {
  debug(`Start getEntities for model ${Model.modelName}`)
  debug({
    sort, page, limit, projection, populate, skip,
  })
  let q = Model.find(mongoFilter)
    .select(projection)

  if (sort === 'relavant') {
    q = q
      .select({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
  } else {
    q = q.sort(sort)
  }
  q = q
    .skip(((page - 1) * limit) + skip)
    .limit(limit)

  /*
   * NOTE need revise this assumption
   * If the fields is not selected, it will not have value to populate.
   * So we can safely populate all fields
   */
  populate.forEach((field) => { q = q.populate(field) })

  const entities = await q.lean()

  debug(`Got ${entities.length} entities for model ${Model.modelName}`)
  return entities
}
