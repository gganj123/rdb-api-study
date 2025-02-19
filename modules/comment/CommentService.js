import { createTransactionalService } from "../../database/TransactionProxy.js";
import { CommentMapper } from "./CommentMapper.js";
import { CommentCreateDto, CommentDto } from "./models/CommentDto.js";
import { CommentInfo } from "./models/CommentInfo.js";

class _CommentService {
  /** @type {CommentMapper} */
  CommentMapper;

  constructor() {
    this.commentMapper = new CommentMapper();
  }

  /**
   * 댓글 생성
   * @async
   * @param {CommentCreateDto} comment
   * @returns {Promise<CommentInfo>}
   */

  async createComment({ content, postId, userId }) {
    const createdComment = await this.commentMapper.createComment({
      content,
      postId,
      userId,
    });
    return new CommentDto(createdComment);
  }

  /** 모든 댓글 조회
   * @return {Promise<CommentInfo>}
   */
  async findAllComments() {
    const comments = await this.commentMapper.findAllComments();
    return comments;
  }

  /**
   * 특정 Id로 게시물 조회
   * @param {number} userId
   * @returns {Promise<CommentInfo[]}
   */

  async findCommentByUserId(userId) {
    const comment = await this.commentMapper.findCommentByUserId(userId);
    return comment;
  }

  /**
   * postId로 게시물 조회
   * @param {number} postId
   * @returns {Promise<CommentInfo[]}
   */

  async findCommentByPostId(postId) {
    const comment = await this.commentMapper.findCommentByPostId(postId);
    return comment;
  }

  /**
   * commentId로 게시물 조회
   * @param {number} commentId
   * @returns {Promise<CommentInfo[]}
   */

  async findCommentByCommentId(commentId) {
    const comment = await this.commentMapper.findCommentByCommentId(commentId);
    return comment;
  }

  /**
   * 댓글 수정
   * @param {number} userId
   * @param {number} commentId
   * @param {string} content
   * @returns {Promise<number>}
   */

  async updateCommnet({ userId, commentId, content }) {
    const result = await this.commentMapper.updateComment(
      userId,
      commentId,
      content
    );
    return result;
  }

  /**
   * 댓글 삭제
   * @param {number} commentId
   * @param {number} userId
   * @returns {Promise<number>}
   */

  async deleteComment({ userId, commentId }) {
    const result = await this.commentMapper.deleteComment(userId, commentId);
    return result;
  }
}
/**
 *  @type {typeof _CommentService}
 *  @description 트랜잭션 프록시를 적용한 CommentService
 */
export const CommentService = createTransactionalService(_CommentService);
