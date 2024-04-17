import React from 'react';
import { Page } from 'framework7-react';
import { getObject } from '@api';
import { useQuery } from 'react-query';
import { Group } from '@constants';
import BackLinkNav from '@components/shared/BackLinkNav';

const ApplicationFormsNewPage = ({ f7route, f7router }) => {
  const { group_id } = f7route.query;
  const { data: group, isError, isSuccess } = useQuery<Group>(
    `group_${group_id}`,
    getObject(group_id, { model_name: 'group' }),
  );

  return (
    <Page noToolbar>
      <BackLinkNav title={`${group?.title} 신청`} />
    </Page>
  );
};

export default React.memo(ApplicationFormsNewPage);
