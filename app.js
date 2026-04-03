const { useState, useEffect, useMemo } = React;

// Initial Mock Data
const initialTransactions = [
  { id: 1, date: '2023-10-01', amount: 4500, category: 'Salary', type: 'income' },
  { id: 2, date: '2023-10-02', amount: 120, category: 'Groceries', type: 'expense' },
  { id: 3, date: '2023-10-05', amount: 60, category: 'Internet Bill', type: 'expense' },
  { id: 4, date: '2023-10-08', amount: 200, category: 'Freelance', type: 'income' },
  { id: 5, date: '2023-10-10', amount: 180, category: 'Utilities', type: 'expense' },
];

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="role-switcher">
      <div 
        className="role-bg" 
        style={{ transform: role === 'admin' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      <button 
        className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
        onClick={() => setRole('viewer')}
      >
        Viewer
      </button>
      <button 
        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
        onClick={() => setRole('admin')}
      >
        Admin
      </button>
    </div>
  );
}

function SummaryCards({ transactions }) {
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') acc.income += Number(curr.amount);
        else acc.expenses += Number(curr.amount);
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expenses;

  return (
    <div className="summary-grid">
      <div className="summary-card glass">
        <div className="card-header">
          <span>Total Balance</span>
          <div className="card-icon blue"><i data-lucide="wallet"></i></div>
        </div>
        <div className="card-amount">${balance.toLocaleString()}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+2.5% from last month</div>
      </div>
      <div className="summary-card glass">
        <div className="card-header">
          <span>Total Income</span>
          <div className="card-icon green"><i data-lucide="trending-up"></i></div>
        </div>
        <div className="card-amount">${totals.income.toLocaleString()}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+12% from last month</div>
      </div>
      <div className="summary-card glass">
        <div className="card-header">
          <span>Total Expenses</span>
          <div className="card-icon red"><i data-lucide="trending-down"></i></div>
        </div>
        <div className="card-amount">${totals.expenses.toLocaleString()}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>-5% from last month</div>
      </div>
    </div>
  );
}

function TransactionsTable({ transactions, role, onAddClick }) {
  return (
    <div className="table-section glass">
      <div className="table-header" style={{ padding: '1.5rem 1.5rem 0' }}>
        <h2 className="table-title">Recent Transactions</h2>
        {role === 'admin' && (
          <button className="add-btn" onClick={onAddClick}>
            <i data-lucide="plus" style={{width: '18px', height: '18px'}}></i>
            Add Transaction
          </button>
        )}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ fontWeight: 500 }}>{t.category}</td>
                <td>
                  <span className={`badge ${t.type}`}>{t.type}</span>
                </td>
                <td style={{ textAlign: 'right' }} className={`amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;
    onAdd({
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount)
    });
    setFormData({ ...formData, amount: '', category: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal glass">
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input 
              type="text" 
              placeholder="e.g. Groceries, Salary, etc." 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              placeholder="0.00"
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState('viewer');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Re-initialize lucide icons whenever components update
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [transactions, role, isModalOpen]);

  const handleAddTransaction = (newTx) => {
    // Add new tx to the top
    setTransactions([newTx, ...transactions]);
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="card-icon" style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
            <i data-lucide="bar-chart-2"></i>
          </div>
          <h1 className="title">FinanceFlow</h1>
        </div>
        <RoleSwitcher role={role} setRole={setRole} />
      </header>
      
      <SummaryCards transactions={transactions} />
      
      <TransactionsTable 
        transactions={transactions} 
        role={role} 
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
