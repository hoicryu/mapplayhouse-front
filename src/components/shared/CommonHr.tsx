import React from 'react';

interface CommonHrProps {
  hrClassName?: string;
}

const CommonHr = ({ hrClassName = '' }: CommonHrProps) => (
  <hr className={`border-2 border-theme-gray-light bg-theme-gray-light ${hrClassName}`} />
);

export default React.memo(CommonHr);
