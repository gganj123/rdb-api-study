import { createTransactionalService } from "../../database/TransactionProxy";

class _FollowService {}

/**
 * @type {typeof _FollowService}
 * @description 트랙잭션 프록시를 적용한 FollowService
 */

export const FollowService = createTransactionalService(_FollowService);
