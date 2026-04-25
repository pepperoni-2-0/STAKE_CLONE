import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, balance, addBalance, showDepositModal, setShowDepositModal } = useWallet();

  const depositAmounts = [500, 1000, 1500, 2000, 5000];

  const handleDeposit = (amount) => {
    addBalance(amount);
    setShowDepositModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <a href="/" className="logo">NEXUS</a>
          </div>
          
          <div className="navbar-center">
            <div className="balance-group">
              <div className="balance-square">
                <span className="balance-amount">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button 
                className="balance-add-btn" 
                onClick={() => user ? setShowDepositModal(true) : navigate('/login')}
              >
                Add
              </button>
            </div>
          </div>

          <div className="navbar-right">
            {user ? (
              <div className="user-profile-group">
                <span className="user-greeting">Hi, {user.username}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="deposit-modal" onClick={e => e.stopPropagation()}>
            <h3>Add Funds</h3>
            <p>Select an amount to add to your wallet</p>
            <div className="deposit-grid">
              {depositAmounts.map(amount => (
                <button key={amount} onClick={() => handleDeposit(amount)}>
                  ${amount}
                </button>
              ))}
            </div>
            <button className="close-modal" onClick={() => setShowDepositModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
