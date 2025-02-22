import { sendErrorResponse, sendResponse } from "../../util/Functions.js";
import { ResponseData } from "../../util/types/ResponseData.js";
import { FollowService } from "./FollowService.js";
import { response } from "express";

export class FollowController {
  /**
   * 팔로우 컨트롤러
   *
   * @param {InstanceType<typeof FollowService>} FollowService
   */

  constructor() {
    this.followService = new FollowService();
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  followToggle = async (req, res) => {
    try {
      const followerId = req.user?.index;
      const followingId = req.params.followingId;

      if (!followerId || isNaN(Number(followerId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const result = await this.followService.followToggle({
        followerId,
        followingId,
      });
      const response = ResponseData.data({ result });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findFollowers = async (req, res) => {
    try {
      const followingId = req.params.followingId;
      console.log("컨트롤러 팔로워 조회 ID: ", followingId);

      const follwers = await this.followService.findFollowers(followingId);
      const response = ResponseData.data({ follwers });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  findFollowing = async (req, res) => {
    try {
      const followerId = req.params.followerId;
      const following = await this.followService.findFollowing(followerId);
      const response = ResponseData.data({ following });

      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  isFollowed = async (req, res) => {
    try {
      const followerId = req.user?.index;
      const followingId = req.params.followingId;
      console.log("컨트롤러 팔로워", followerId);
      if (!followerId || isNaN(Number(followerId))) {
        return sendErrorResponse(res, new Error("userId를 확인해주세요."));
      }

      const isFollowed = await this.followService.isFollowed({
        followerId,
        followingId,
      });

      const response = ResponseData.data({ isFollowed });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  countFollowers = async (req, res) => {
    try {
      const followingId = req.params.followingId;
      const countFollower = await this.followService.countFollowers(
        followingId
      );

      const response = ResponseData.data({ countFollower });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  countFollowing = async (req, res) => {
    try {
      const followerId = req.params.followerId;
      const countFollowing = await this.followService.countFollowing(
        followerId
      );

      const response = ResponseData.data({ countFollowing });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  countMostFollowedUser = async (req, res) => {
    try {
      const limit = req.params.limit;
      const mostFollowedUser = await this.followService.countMostFollowedUser(
        limit
      );

      const response = ResponseData.data({ mostFollowedUser });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  countMostFollowingUser = async (req, res) => {
    try {
      const limit = req.params.limit;
      const mostFollowingUser = await this.followService.countMostFollowingUser(
        limit
      );

      const response = ResponseData.data({ mostFollowingUser });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

  adminDeleteFollow = async (req, res) => {
    try {
      const followerId = req.params.followerId;
      const followingId = req.params.followingId;
      console.log(
        "삭제 요청 - followerId:",
        followerId,
        "followingId:",
        followingId
      );

      const deleteFollow = await this.followService.adminDeleteFollow({
        followerId,
        followingId,
      });
      const response = ResponseData.data({ deleteFollow });
      sendResponse(res, response);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
}
