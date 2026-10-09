"use strict";

const getCurrentHumanApproval = require("../../scripts/get-current-human-approval.cjs");

const headSha = "current-head";
const eligibleReviewers = ["reviewer", "approver", "requester"];
const review = (
  login,
  state,
  commitId = headSha,
  submittedAt = "2026-09-30T12:00:00Z",
) => ({
  commit_id: commitId,
  id: Date.parse(submittedAt),
  state,
  submitted_at: submittedAt,
  user: { login },
});

describe("getCurrentHumanApproval()", function () {
  it("should accept a latest human approval for the current head", function () {
    expect(
      getCurrentHumanApproval(
        [review("reviewer", "APPROVED")],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      true,
    );
  });

  it("should ignore an approval superseded by a changes-requested review", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("reviewer", "APPROVED", headSha, "2026-09-29T12:00:00Z"),
          review("reviewer", "CHANGES_REQUESTED"),
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should not let a later comment-only review supersede an approval", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("reviewer", "APPROVED", headSha, "2026-09-29T12:00:00Z"),
          review("reviewer", "COMMENTED"),
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      true,
    );
  });

  it("should reject an approval when another reviewer has an active changes request", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("approver", "APPROVED"),
          review("requester", "CHANGES_REQUESTED"),
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should ignore approvals made on an older head", function () {
    expect(
      getCurrentHumanApproval(
        [review("reviewer", "APPROVED", "old-head")],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should not count approvals superseded by a dismissal", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("reviewer", "APPROVED", headSha, "2026-09-29T12:00:00Z"),
          review("reviewer", "DISMISSED"),
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should ignore bot approvals and pending reviews", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("automation[bot]", "APPROVED"),
          {
            ...review("reviewer", "APPROVED"),
            state: "PENDING",
            submitted_at: null,
          },
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should use review submission time rather than API response order", function () {
    expect(
      getCurrentHumanApproval(
        [
          review(
            "reviewer",
            "CHANGES_REQUESTED",
            headSha,
            "2026-09-30T13:00:00Z",
          ),
          review("reviewer", "APPROVED", headSha, "2026-09-30T12:00:00Z"),
        ],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });

  it("should ignore approvals from reviewers outside the eligible set", function () {
    expect(
      getCurrentHumanApproval([review("reviewer", "APPROVED")], headSha),
      "to be",
      false,
    );
  });

  it("should ignore changes requests from reviewers outside the eligible set", function () {
    expect(
      getCurrentHumanApproval(
        [
          review("reviewer", "APPROVED"),
          review("untrusted-reviewer", "CHANGES_REQUESTED"),
        ],
        headSha,
        ["reviewer"],
      ),
      "to be",
      true,
    );
  });

  it("should accept approvals from reviewers in the eligible set", function () {
    expect(
      getCurrentHumanApproval(
        [review("reviewer", "APPROVED")],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      true,
    );
  });

  it("should exclude read and triage reviewers from the eligible set", function () {
    expect(
      [
        ...getCurrentHumanApproval.getEligibleReviewerLogins([
          { login: "reader", permission: "read" },
          { login: "triager", permission: "triage" },
        ]),
      ],
      "to equal",
      [],
    );
  });

  it("should include write, maintain, and admin reviewers in the eligible set", function () {
    expect(
      [
        ...getCurrentHumanApproval.getEligibleReviewerLogins([
          { login: "writer", permission: "write" },
          { login: "maintainer", permission: "maintain" },
          { login: "admin", permission: "admin" },
        ]),
      ].sort(),
      "to equal",
      ["admin", "maintainer", "writer"],
    );
  });

  it("should not count approvals with unknown repository permissions", function () {
    const eligibleReviewers = getCurrentHumanApproval.getEligibleReviewerLogins(
      [{ login: "reviewer", permission: "unknown" }],
    );
    expect(
      getCurrentHumanApproval(
        [review("reviewer", "APPROVED")],
        headSha,
        eligibleReviewers,
      ),
      "to be",
      false,
    );
  });
});
