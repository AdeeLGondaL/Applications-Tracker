import { FocusThisWeek } from "applume";
import { noop } from "./_fixtures";

export const ActionQueue = () => (
  <FocusThisWeek
    overdueCount={2}
    dueSoonCount={4}
    interviewCount={3}
    missingDocsCount={5}
    onReviewUrgent={noop}
    onReviewInterviews={noop}
    onReviewDocuments={noop}
    onAddUniversity={noop}
    onAddJob={noop}
    onImport={noop}
    onCalendarSync={noop}
  />
);

export const QueueOnly = () => (
  <div style={{ maxWidth: 720 }}>
    <FocusThisWeek
      showQuickActions={false}
      overdueCount={0}
      dueSoonCount={2}
      interviewCount={1}
      missingDocsCount={0}
      onReviewUrgent={noop}
      onReviewInterviews={noop}
      onReviewDocuments={noop}
    />
  </div>
);
