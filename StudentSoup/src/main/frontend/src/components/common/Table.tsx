import React, { useEffect } from 'react';
import {
  type TableProps,
  type TableHeadTextType,
  type BoardDataType,
} from '../../interfaces/BoardTypes';
import { Desktop, Mobile } from '../../mediaQuery';
import './table.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const Table = ({ headings, data, userInformation }: TableProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tableHeadText: TableHeadTextType = {
    title: '제목',
    nickname: '작성자',
    writeDate: '게시일',
    view: '조회수',
  };
  const dateFormatting = (item: BoardDataType) => {
    const date = new Date(item.writeDate);
    const dotDateFormat: string =
      String(date.getFullYear()).slice(2, 4) +
      '.' +
      String(date.getMonth() + 1 < 9 ? '0' + String(date.getMonth() + 1) : date.getMonth() + 1) +
      '.' +
      String(date.getDate() < 9 ? '0' + String(date.getDate()) : date.getDate()) +
      ' ' +
      String(date.getHours()) +
      ':' +
      String(date.getMinutes() <= 9 ? '0' + String(date.getMinutes()) : date.getMinutes());

    return dotDateFormat;
  };

  const renderCombinedData = (item: BoardDataType) => {
    const postDate = dateFormatting(item);

    return (
      <>
        <div key={`${item.boardId}-write-date`} className="write-data-wrap">
          <span>{item.nickname}</span>
          <span>조회수 {item.view}</span>
        </div>
        <span>{postDate}</span>
      </>
    );
  };

  const handleClickPostDetail = (boardId: any) => {
    console.log();
    navigate(`${location.pathname}/detail/${boardId}`, {
      state: { ...userInformation, boardId },
    });
  };

  return (
    <>
      <Desktop>
        <table className="custom-table">
          <thead>
            <tr>
              {headings.map((heading: string) => {
                return (
                  <th
                    key={heading}
                    className={`${heading.toLowerCase().replace(' ', '-')}-heading`}
                  >
                    {tableHeadText[heading]}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.boardId} onClick={() => handleClickPostDetail(item.boardId)}>
                {headings.map((heading: string) => {
                  if (headings.length > 2 && heading === 'title') {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {item[heading]}
                        <span className="customerservice-reviewCount">{item.reviewCount}</span>
                      </td>
                    );
                  } else if (heading === 'writeDate') {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {dateFormatting(item)}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {item[heading]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Desktop>
      <Mobile>
        <table className="custom-table">
          <thead>
            <tr>
              {headings.map((heading: string) => {
                if (headings.length <= 2) {
                  return (
                    <th
                      key={heading}
                      className={`${heading.toLowerCase().replace(' ', '-')}-heading`}
                    >
                      {tableHeadText[heading]}
                    </th>
                  );
                } else {
                  <></>;
                }
              })}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr
                key={item.boardId}
                className={headings.length <= 2 ? 'notice-data' : 'customer-service-data'}
                onClick={() => handleClickPostDetail(item.boardId)}
              >
                {headings.map((heading: string) => {
                  if (headings.length <= 2 && heading === 'title') {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {item[heading]}
                      </td>
                    );
                  } else if (headings.length <= 2 && heading === 'writeDate') {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {dateFormatting(item)}
                      </td>
                    );
                  } else if (headings.length > 2 && heading === 'title') {
                    return (
                      <td
                        key={`${item.boardId}-${heading}`}
                        className={`${heading.toLowerCase().replace(' ', '-')}-data`}
                      >
                        {item[heading]}
                        <span className="customerservice-reviewCount">{item.reviewCount}</span>
                      </td>
                    );
                  } else if (headings.length > 2 && heading === 'writeDate') {
                    return (
                      <td key={`${item.boardId}-${heading}`} className="combined-data">
                        {renderCombinedData(item)}
                      </td>
                    );
                  } else if (headings.length > 2 && ['nickname', 'view'].includes(heading)) {
                    return null;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Mobile>
    </>
  );
};

export default Table;
