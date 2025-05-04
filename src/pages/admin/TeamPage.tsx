import React from 'react';
import TeamPageComponent from '../../components/TeamPageComponent';

const AdminTeamPage: React.FC = () => {
  return (
    <TeamPageComponent
      role="admin"
      canEditMembers={true}
      canAssignTasks={true}
      canViewSensitiveInfo={true}
    />
  );
};

export default AdminTeamPage; 