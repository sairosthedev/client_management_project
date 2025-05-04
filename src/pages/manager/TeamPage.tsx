import React from 'react';
import TeamPageComponent from '../../components/TeamPageComponent';

const ManagerTeamPage: React.FC = () => {
  return (
    <TeamPageComponent
      role="project_manager"
      canEditMembers={false}
      canAssignTasks={true}
      canViewSensitiveInfo={true}
    />
  );
};

export default ManagerTeamPage; 