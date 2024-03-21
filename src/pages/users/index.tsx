import React, { useRef } from 'react';
import { IMAGE_API_URL, getInfiniteObjects } from '@api';
import { Navbar, Page, List, ListItem, ListInput } from 'framework7-react';
import { useInfiniteQuery, useQueryClient } from 'react-query';

const UserIndexPage = ({ f7route }) => {
  const { is_main } = f7route.query;
  const itemSearchForm = useRef(null);
  const allowInfinite = useRef(true);
  const queryClient = useQueryClient();
  const USER_INF_KEY = 'users/infinite';

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    USER_INF_KEY,
    getInfiniteObjects({
      model_name: 'user',
      q: { s: ['created_at desc'] },
    }),
    {
      getNextPageParam: (lastPage) => lastPage.next_cursor,
    },
  );

  const loadMore = async (_) => {
    if (!allowInfinite.current) return;
    allowInfinite.current = false;
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      allowInfinite.current = true;
    }
  };

  const onRefresh = async (done) => {
    queryClient.removeQueries(USER_INF_KEY);
    await refetch();
    allowInfinite.current = true;
    done();
  };

  return (
    <Page
      infinite
      noToolbar={!is_main}
      infinitePreloader={isFetchingNextPage}
      onInfinite={loadMore}
      onPtrRefresh={onRefresh}
      ptr
    >
      <Navbar backLink={!is_main} title="전문가" />

      <div className="m-3">
        <form className="item-list-form" action="/items" method="GET" ref={itemSearchForm}>
          <div className="float-left">{/* 총 <b>{currency(totalCount)}</b>명 전문가 */}</div>
          <ListInput
            type="select"
            className="float-right border rounded px-2 text-center mx-1 list-none leading-9"
            name="sort"
            onChange={onRefresh}
          >
            {_.map(i18next.t('sort').item, (v, k) => (
              <option value={k} key={k}>
                {v}
              </option>
            ))}
          </ListInput>
        </form>
      </div>

      {data && (
        <>
          <List mediaList noHairlines>
            <ul>
              {data.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.objects.map((user) => (
                    <ListItem
                      key={user.id}
                      mediaItem
                      link={`/users/${user.id}`}
                      title={`${user.id} ${user.name}`}
                      subtitle={user.email}
                      // style={{ top: `${vlData.topPosition}px` }}
                      className="w-full"
                    >
                      <img slot="media" src={IMAGE_API_URL + user.image_path} className="w-20 rounded" />
                    </ListItem>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </List>
        </>
      )}
    </Page>
  );
};
export default React.memo(UserIndexPage);
