import { useAuth } from "../context/AuthContext";
import "./sidebar.css";

const initials = (name) => name?.slice(0, 2).toUpperCase() || "?";

const Sidebar = ({ users, selectedUser, onSelectUser, onlineUsers }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-brand">Thread</h1>
      </div>

      <div className="sidebar-list">
        {users.length === 0 && (
          <p className="sidebar-empty">No other users yet. Invite someone to join.</p>
        )}
        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          return (
            <button
              key={u._id}
              className={`sidebar-item ${selectedUser?._id === u._id ? "active" : ""}`}
              onClick={() => onSelectUser(u)}
            >
              <span className="sidebar-avatar" style={{ background: u.avatarColor }}>
                {initials(u.username)}
                {isOnline && <span className="sidebar-online-dot" />}
              </span>
              <span className="sidebar-item-text">
                <span className="sidebar-item-name">{u.username}</span>
                <span className="sidebar-item-status">{isOnline ? "Online" : "Offline"}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-avatar" style={{ background: user.avatarColor }}>
          {initials(user.username)}
        </span>
        <span className="sidebar-item-name">{user.username}</span>
        <button className="sidebar-logout" onClick={logout} title="Log out">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
