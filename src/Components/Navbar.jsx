import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="/" className="logo">NEXUS</a>
        </div>
        
        <div className="navbar-center">
          <div className="balance-group">
            <div className="balance-square">
              <span className="balance-amount">$2,450.00</span>
            </div>
            <button className="balance-add-btn">Add</button>
          </div>
        </div>

        <div className="navbar-right">
          <button className="login-btn">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
