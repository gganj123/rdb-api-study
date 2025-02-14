import { createTransactionalService } from '../../database/TransactionProxy.js'

class _CommentService {

}

/**
 *  @type {typeof _CommentService} 
 *  @description 트랜잭션 프록시를 적용한 CommentService
*/
export const CommentService = createTransactionalService(_CommentService)

