import React from "react";

const Dashboard = async () => {
  const user = await fetch("http://localhost:3000/api/user");
  const userData = await user.json();
  return <div>Dashboard Dashboard{userData}</div>;
};

export default Dashboard;
