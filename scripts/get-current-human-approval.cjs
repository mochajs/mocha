"use strict";

module.exports = (reviews, headSha, eligibleReviewers = []) => {
  const latestReviewsByReviewer = new Map();
  const eligibleReviewerLogins = new Set(eligibleReviewers);

  for (const review of reviews) {
    const login = review.user && review.user.login;
    const submittedAt = Date.parse(review.submitted_at);

    if (
      !login ||
      login.endsWith("[bot]") ||
      !eligibleReviewerLogins.has(login) ||
      !Number.isFinite(submittedAt) ||
      review.state === "PENDING" ||
      review.state === "COMMENTED"
    ) {
      continue;
    }

    const latestReview = latestReviewsByReviewer.get(login);
    const reviewId = Number(review.id);

    if (
      !latestReview ||
      submittedAt > latestReview.submittedAt ||
      (submittedAt === latestReview.submittedAt &&
        reviewId > latestReview.reviewId)
    ) {
      latestReviewsByReviewer.set(login, { review, reviewId, submittedAt });
    }
  }

  const latestReviews = [...latestReviewsByReviewer.values()].map(
    ({ review }) => review,
  );

  if (latestReviews.some((review) => review.state === "CHANGES_REQUESTED")) {
    return false;
  }

  return latestReviews.some(
    (review) => review.state === "APPROVED" && review.commit_id === headSha,
  );
};
