import React from 'react';
import { Page } from 'framework7-react';
import BackLinkNav from '@components/shared/BackLinkNav';
import { useRecoilValue, selector } from 'recoil';
import { groupsState } from '@atoms';
import Form from '@components/application_forms/Form';
import { Group, Term, Objects } from '@constants';
import { useQuery } from 'react-query';
import { getObjects } from '@api';

const ApplicationFormsNewPage = ({ f7route, f7router }) => {
  const { group_id } = f7route.query;
  const groupsData = useRecoilValue(groupsState);
  const group: Group = groupsData.groups.find((group) => group.id == group_id);
  const {
    data: terms,
    isError,
    isSuccess,
  } = useQuery<Objects<Term>, Error>('terms', getObjects({ model_name: 'term', q: { _type_eq: 'application' } }), {});

  return (
    <Page noToolbar>
      <BackLinkNav title={`${group?.title} 신청`} />
      <Form f7router={f7router} group={group} terms={terms?.objects} />
    </Page>
  );
};

export default React.memo(ApplicationFormsNewPage);
