import React from 'react';
import { Row, Col, Navbar, Page } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { groupsState } from '@atoms';
import { IMAGE_API_URL } from '@api';
import { Group } from '@constants';

const GroupIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;
  const [groupsData, setGroups] = useRecoilState(groupsState);

  return (
    <Page noToolbar={!is_main} ptr>
      <Navbar noHairline innerClassName="bg-white" title="참여 신청" />
      {groupsData.isSuccess && (
        <div className="p-4 group-index-box">
          {groupsData.groups.map((group: Group) => (
            <Row noGap className="items-center w-100 mt-3">
              <Col width="30">
                <div className="">
                  <img
                    className="rounded-xl w-full object-cover aspect-ratio-4_5"
                    src={IMAGE_API_URL + group.musical.image_path}
                    alt=""
                  />
                </div>
              </Col>
              <Col width="70">
                <div className="ml-4 flex flex-col">
                  <span>{group.musical_alias}</span>
                  <span>{group.submit_end_at}</span>
                  <span>{group.audition_date}</span>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </Page>
  );
};
export default React.memo(GroupIndexPage);
