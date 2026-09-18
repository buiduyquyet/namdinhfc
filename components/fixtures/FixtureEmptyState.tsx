interface FixtureEmptyStateProps {
  title: string;
  message: string;
}

/** Khối thông báo khi một tab của trang Lịch thi đấu chưa có dữ liệu. */
const FixtureEmptyState = ({ title, message }: FixtureEmptyStateProps) => (
  <div className="text-center py-16">
    <p className="font-heading font-bold text-xl text-secondary mb-2">{title}</p>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default FixtureEmptyState;
