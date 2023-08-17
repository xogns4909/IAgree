import { useState, useCallback } from 'react';

const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  return [value, onChange, setValue];
};

export default useInput;
