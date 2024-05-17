import React from 'react';
import { Page } from 'framework7-react';
import BackLinkNav from '@components/shared/BackLinkNav';
import { useRecoilValue, selector } from 'recoil';
import { groupsState } from '@atoms';
import Form from '@components/application_forms/Form';

const ApplicationFormsNewPage = ({ f7route, f7router }) => {
  const { group_id } = f7route.query;
  const groupsData = useRecoilValue(groupsState);
  const group = groupsData.groups.find((group) => group.id == group_id);

  return (
    <Page noToolbar>
      <BackLinkNav title={`${group?.title} 신청`} />
      <Form f7router={f7router} />
    </Page>
  );
};

export default React.memo(ApplicationFormsNewPage);
