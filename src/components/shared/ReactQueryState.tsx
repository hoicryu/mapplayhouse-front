import React from 'react';
import { Preloader } from 'framework7-react';

interface ReactQueryStateProps {
  data: any;
  status: 'loading' | 'error' | 'success' | 'idle';
  error: Error;
  isFetching?: boolean;
}

const ReactQueryState = ({ data, status, error, isFetching = false }: ReactQueryStateProps) => {
  if (status === 'loading' || isFetching)
    return (
      <div className="text-center p-10">
        <Preloader size={20} />
      </div>
    );
  if (status === 'error')
    return <div className="text-center p-10 text-theme-orange">Something went wrong {error.message}`</div>;
  if (!data) return <div className="text-center p-10">데이터가 없습니다.</div>;
  return null;
};

export default React.memo(ReactQueryState);
