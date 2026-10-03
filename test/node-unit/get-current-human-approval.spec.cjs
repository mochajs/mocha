"use strict";

const getCurrentHumanApproval = require("../../scripts/get-current-human-approval.cjs");

const headSha = "current-head";
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
      getCurrentHumanApproval([review("reviewer", "APPROVED")], headSha),
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
      ),
      "to be",
      false,
    );
  });
});
