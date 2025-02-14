import { BaseMapper } from '../../util/types/BaseMapper.js'

export class PostMapper extends BaseMapper {

  findAllPosts() {
    return this.exec(async query =>
      query.SELECT('*').FROM('posts').findMany()
    )
  }
}
