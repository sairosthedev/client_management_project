import React from 'react';
import TeamPageComponent from '../../components/TeamPageComponent';

const DeveloperTeamPage: React.FC = () => {
  return (
    <TeamPageComponent
      role="developer"
      canEditMembers={false}
      canAssignTasks={false}
      canViewSensitiveInfo={false}
    />
  );
};

export default DeveloperTeamPage; 