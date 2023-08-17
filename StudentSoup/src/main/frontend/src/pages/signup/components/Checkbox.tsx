import React, { useEffect, useState } from 'react';
import './checkbox.scss';

const Checkbox = ({ id, name, onChange, subTitle, title, checkItems, value }: any) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.checked);
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (checkItems.includes(name)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [checkItems]);

  return (
    <label className="terms-wrap">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        value={value}
        onChange={e => onCheck(e)}
      />
      <span>[{subTitle}]</span>
      <div>{title}</div>
    </label>
  );
};

export default Checkbox;
