import React from 'react';
import { Navbar, Page } from 'framework7-react';
import { useRecoilValue } from 'recoil';
import { groupsState } from '@atoms';
import { Group, PageRouteProps } from '@constants';
import GroupCard from '@components/groups/GroupCard';

const GroupIndexPage = ({ f7router }: PageRouteProps) => {
  const groupsData = useRecoilValue(groupsState);

  return (
    <Page name="groups">
      <Navbar noHairline innerClassName="bg-white" title="참여 신청" />
      {groupsData.isSuccess && (
        <div className="p-4 group-index-box">
          {groupsData.groups.map((group: Group) => (
            <GroupCard group={group} key={`group-${group.id}`} f7router={f7router} />
          ))}
        </div>
    </Page>
  );
};
export default React.memo(GroupIndexPage);
