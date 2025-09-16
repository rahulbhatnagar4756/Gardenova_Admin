import "./header.css";

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Kasagardem's Control Center</h1>
      <div className="header-actions">
        <button className="notification-btn" aria-label="Notifications">
          🔔
        </button>
        <div className="user-profile">
          <div className="user-avatar">👤</div>
        </div>
      </div>
    </header>
  );
};
