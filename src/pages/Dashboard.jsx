import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Dashboard = ({ supabase, session }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to MyShopTools Dashboard</h1>
      {user && <p className="mb-4">Logged in as: {user.email}</p>}
      <Button onClick={handleLogout}>Logout</Button>
      {/* Add more dashboard components here */}
    </div>
  );
};

export default Dashboard;