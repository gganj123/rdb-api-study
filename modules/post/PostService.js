import { createTransactionalService } from '../../database/TransactionProxy.js'

class _PostService {

}


/**
 *  @type {typeof _PostService} 
 *  @description 트랜잭션 프록시를 적용한 PostService
*/
export const PostService = createTransactionalService(_PostService)