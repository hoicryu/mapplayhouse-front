import React from 'react';
import { Navbar, Page } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { groupsState } from '@atoms';

const GroupIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;
  const [groupsData, setGroups] = useRecoilState(groupsState);

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline innerClassName="bg-white" title="참여 신청" />
      {groupsData.isSuccess && (
        <div>
          {groupsData.groups.map((group) => (
            <div>{group.musical.title}</div>
          ))}
        </div>
      )}
    </Page>
  );
};
export default React.memo(GroupIndexPage);
