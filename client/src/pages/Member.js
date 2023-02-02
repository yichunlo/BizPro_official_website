import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import localDb from '../config/localDb.json';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import axios from 'axios';
import numberToRank from '../utility/numberToRank.js';
import connectionSymbol from '../asset/img/connection_symbol_white300.svg';
import ReactPaginate from 'react-paginate';

/*
TODO:
- loading 符號
*/

function Member() {
  const [memberData, setMemberData] = useState(null);
  const [filteredMemberData, setFilteredMemberData] = useState(null);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [majorOptions, setMajorOptions] = useState([]);
  const [majorFilter, setMajorFilter] = useState([]);
  const [fieldFilter, setFieldFilter] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('');
  const [directSearch, setDirectSearch] = useState('');
  const [popupContent, setPopupContent] = useState({
    name: '',
    number: '',
    jobTitle: '',
    tags: [],
    exp: [],
  });
  const [totalPage, setTotalPage] = useState(0);
  const [nowPage, setNowPage] = useState(1);
  const [onePageMemberCount, setOnePageMemberCount] = useState(1);
  const [memberColumnCount, setMemberColumnCount] = useState(1);
  const headerWording = localDb.headerWording.member;

  useEffect(() => {
    let grade = [];
    let field = [];
    let major = [];
    let gradeOptionsTemp = [{ value: '0', label: '全部屆數' }];
    let fieldOptionsTemp = [];
    let majorOptionsTemp = [];
    const fetchData = async () => {
      await axios
        .get('http://localhost:5000/api/alumni/members')
        .then((res) => {
          const gridColumnCount = window
            .getComputedStyle(
              document.getElementsByClassName('member__items')[0]
            )
            .getPropertyValue('grid-template-columns')
            .split(' ').length;

          // set onePageMemberCount
          let onePageMemberCountTemp = 1;
          if (gridColumnCount === 1) {
            onePageMemberCountTemp = 10;
            setOnePageMemberCount(10);
          } else if (gridColumnCount === 2) {
            onePageMemberCountTemp = 12;
            setOnePageMemberCount(12);
          } else if (gridColumnCount === 3) {
            onePageMemberCountTemp = 18;
            setOnePageMemberCount(18);
          } else if (gridColumnCount === 4) {
            onePageMemberCountTemp = 20;
            setOnePageMemberCount(20);
          } else if (gridColumnCount === 5) {
            onePageMemberCountTemp = 20;
            setOnePageMemberCount(20);
          } else {
            onePageMemberCountTemp = gridColumnCount * 4;
            setOnePageMemberCount(gridColumnCount * 4);
          }

          // Set options
          res.data.map((member) => {
            if (!grade.includes(member.number)) {
              grade.push(member.number);
            }
            member.tags.map((tag) => {
              if (!field.includes(tag)) {
                field.push(tag);
              }
            });
            if (!major.includes(member.major)) {
              if (member.major !== 'Unknown') major.push(member.major);
            }
          });
          grade.map((item) => {
            gradeOptionsTemp.push({ value: item, label: item });
          });
          field.map((item) => {
            fieldOptionsTemp.push({ value: item, label: item });
          });
          major.map((item) => {
            majorOptionsTemp.push({
              value: item.replace('臺灣大學', ''),
              label: item.replace('臺灣大學', ''),
            });
          });

          setMemberData(res.data);
          setFilteredMemberData(res.data);
          setTotalPage(Math.ceil(res.data.length / onePageMemberCountTemp));
          setFieldOptions(fieldOptionsTemp);
          setGradeOptions(gradeOptionsTemp);
          setMajorOptions(majorOptionsTemp);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
    window.addEventListener('resize', () => {
      if (
        $('.member__popUp').css('display') === 'none' &&
        $('.member__popupLayer').css('display') === 'block'
      ) {
        $('.member__popUp').css('display', 'flex');
        $('.member__popUp').css('opacity', '1');
      }

      let column = window
        .getComputedStyle(document.getElementsByClassName('member__items')[0])
        .getPropertyValue('grid-template-columns')
        .split(' ').length;
      if (column !== memberColumnCount) {
        setMemberColumnCount(column);
      }
    });
    return;
  }, []);

  useEffect(() => {
    const gridColumnCount = window
      .getComputedStyle(document.getElementsByClassName('member__items')[0])
      .getPropertyValue('grid-template-columns')
      .split(' ').length;

    // set onePageMemberCount
    let onePageMemberCountTemp = 1;
    if (gridColumnCount === 1) {
      onePageMemberCountTemp = 10;
      setOnePageMemberCount(10);
    } else if (gridColumnCount === 2) {
      onePageMemberCountTemp = 12;
      setOnePageMemberCount(12);
    } else if (gridColumnCount === 3) {
      onePageMemberCountTemp = 18;
      setOnePageMemberCount(18);
    } else if (gridColumnCount === 4) {
      onePageMemberCountTemp = 20;
      setOnePageMemberCount(20);
    } else if (gridColumnCount === 5) {
      onePageMemberCountTemp = 20;
      setOnePageMemberCount(20);
    } else {
      onePageMemberCountTemp = gridColumnCount * 4;
      setOnePageMemberCount(gridColumnCount * 4);
    }
    if (filteredMemberData)
      setTotalPage(
        Math.ceil(filteredMemberData.length / onePageMemberCountTemp)
      );

    return;
  }, [memberColumnCount]);

  const MemberItem = (props) => (
    <div
      className="member__items--item"
      onClick={() => {
        setPopupContent(filteredMemberData[props.id]);
        setTimeout(() => {
          $('.member__popUp').css('display', 'flex');
          $('.member__popupLayer').css('display', 'block');
          $('.member__popUp').css('opacity', '1');
          $('.member__popupLayer').css('opacity', '1');
          $('body').css('overflow-y', 'hidden');
          $('#memberSection').css('z-index', '');
        }, 100);
      }}
    >
      <div className="item__container">
        <div className="item__container--img">
          <div className="mask">查看成員經歷</div>
          <img src={props.avatar} alt="avatar" className="item__img--img" />
        </div>
        <div className="item__container--content">
          <p className="item__content--title">
            {numberToRank(props.number)} {props.name}
          </p>
          <p className="item__content--subTitle">{props.jobTitle}</p>
        </div>
      </div>
      <Button
        variant="primary"
        onClick={() => {
          setPopupContent(memberData[props.id]);
          setTimeout(() => {
            $('.member__popUp').css('display', 'flex');
            $('.member__popupLayer').css('display', 'block');
            $('.member__popUp').css('opacity', '0');
            $('.member__popupLayer').css('opacity', '0');
          }, 100);
        }}
      >
        查看成員經歷
      </Button>
    </div>
  );
  const PopUp = ({ props }) => {
    return (
      <section className="member__popUp">
        <div className="member__popUp--img">
          <img src={props.avatar} alt="" />
        </div>
        <div className="member__popUp--content">
          <h3>
            {numberToRank(props.number)} {props.name}
          </h3>
          <p>{props.jobTitle}</p>
          <div className="content__tags">
            {props.tags.map((tag) => (
              <div className="content__tags--tag">{tag}</div>
            ))}
          </div>
          <ul>
            {props.exp.map((exp) => (
              <li>{exp}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const switchPage = (direction, certainPage) => {
    switch (direction) {
      case 'next':
        if (nowPage < totalPage) {
          document.getElementById('memberSection').scrollIntoView();
          setNowPage(nowPage + 1);
        }
        break;
      case 'prev':
        if (nowPage > 1) {
          document.getElementById('memberSection').scrollIntoView();
          setNowPage(nowPage - 1);
        }
        break;
      case 'last':
        document.getElementById('memberSection').scrollIntoView();
        setNowPage(totalPage);
        break;
      case 'first':
        document.getElementById('memberSection').scrollIntoView();
        setNowPage(1);
        break;
      case 'certainPage':
        document.getElementById('memberSection').scrollIntoView();
        setNowPage(certainPage);
        break;
      default:
        break;
    }
  };
  const startFilter = (major, field, grade) => {
    let filteredMemberDataTemp = memberData;

    // field filter

    if (field[0]) {
      filteredMemberDataTemp = filteredMemberDataTemp.filter((member) =>
        field.some((e) => member.tags.includes(e))
      );
    }

    //grade filter
    if (major[0]) {
      filteredMemberDataTemp = filteredMemberDataTemp.filter((member) => {
        return major.some((e) => member.major.includes(e));
      });
    }

    if (grade && grade !== '0') {
      filteredMemberDataTemp = filteredMemberDataTemp.filter(
        (member) => member.number === grade
      );
    }
    setNowPage(1);
    setTotalPage(Math.ceil(filteredMemberDataTemp.length / onePageMemberCount));
    setFilteredMemberData(filteredMemberDataTemp);

    // Set pagination to page 1
    $('.page-link').map((id, el) => {
      if (el.getAttribute('aria-label') === 'Page 1') {
        el.click();
      }
    });
  };
  return (
    <React.Fragment>
      <Header title={headerWording.title} content={headerWording.content} />
      <section className="member" id="memberSection">
        <img
          src={connectionSymbol}
          alt="connectionSymbol"
          className="connectionSymbolTop connectionSymbol"
        />
        <img
          src={connectionSymbol}
          alt="connectionSymbol"
          className="connectionSymbolBottom connectionSymbol"
        />
        <PopUp props={popupContent} />
        <div
          className="member__popupLayer"
          onClick={() => {
            $('.member__popUp').css('display', 'none');
            $('.member__popupLayer').css('display', 'none');
            $('body').css('overflow-y', 'scroll');
          }}
        />
        <div className="member__searchSection">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              for (const pair of formData.entries()) {
                setDirectSearch(pair[1]);
              }
            }}
          >
            <div className="member__searchSection--filter">
              <label className="filter__field--tag">條件篩選：</label>
              <div className="filterContainer">
                <div className="filter__major">
                  <Select
                    classNamePrefix="filter__field--selector"
                    placeholder="選擇科系（限臺大）"
                    isMulti
                    options={majorOptions}
                    onChange={(choice) => {
                      let tempArray = [];
                      choice.map((option) => {
                        tempArray.push(`${option.value}`);
                      });
                      setMajorFilter(tempArray);
                      startFilter(tempArray, fieldFilter, gradeFilter);
                    }}
                  />
                </div>
                <div className="filter__field">
                  <Select
                    classNamePrefix="filter__field--selector"
                    placeholder="選擇領域"
                    isMulti
                    options={fieldOptions}
                    onChange={(choice) => {
                      let tempArray = [];
                      choice.map((option) => {
                        tempArray.push(`${option.value}`);
                      });
                      setFieldFilter(tempArray);
                      startFilter(majorFilter, tempArray, gradeFilter);
                    }}
                  />
                </div>
                <div className="filter__grade">
                  <Select
                    classNamePrefix="filter__grade--selector"
                    placeholder="選擇屆數"
                    options={gradeOptions}
                    onChange={(choice) => {
                      setGradeFilter(choice.value);
                      startFilter(majorFilter, fieldFilter, choice.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="member__searchSection--search">
              <label className="search--directSearchLabel">直接搜尋：</label>
              <div className="searchContainer">
                <input
                  type="text"
                  name="search"
                  placeholder="直接搜尋"
                  className="search--directSearchInput"
                />
                <Button variant="primary" type="submit">
                  搜尋
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="member__items">
          {filteredMemberData?.map((member, i) => {
            if (
              (nowPage - 1) * onePageMemberCount <= i &&
              i < nowPage * onePageMemberCount
            ) {
              return (
                <MemberItem
                  name={`${member.name}`}
                  number={`${member.number}`}
                  jobTitle={`${member.jobTitle}`}
                  exp={`${member.exp}`}
                  tags={`${member.tags}`}
                  avatar={`${member.avatar}`}
                  key={i}
                  id={i}
                />
              );
            } else {
              return;
            }
          })}
        </div>
        <ReactPaginate
          nextLabel="›"
          onPageChange={(e) => {
            switchPage('certainPage', e.selected + 1);
          }}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          pageCount={totalPage}
          previousLabel="‹"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </section>
    </React.Fragment>
  );
}

export default Member;
