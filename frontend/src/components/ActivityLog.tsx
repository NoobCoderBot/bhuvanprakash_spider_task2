interface Activity {
  _id: string;
  action: string;
  timestamp: string;
  userId: { username: string };
}

const ActivityLog = ({ activities }: { activities: Activity[] }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Activity Log</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500">No activity yet.</p>
      ) : (
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          {activities.map((a) => (
            <li key={a._id}>
              <strong>{a.userId.username}</strong> {a.action} (
              {new Date(a.timestamp).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
