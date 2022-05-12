import React, { useState, useEffect, useRef, useContext } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import numeral from "numeral";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// icons
import { IoIosArrowForward } from "react-icons/io";
// common
import { GoTop } from "../Common/GoTop";
import { Pagenations } from "../Common/Pagenations";
// api
import { fetchDetailLink } from "../Common/FetchApiData";
const StyledDesktopCreateDataList = styled.div`
  position: relative;
  -webkit-overflow-scrolling: touch;
  height: calc(100vh - 245px);
  min-height: 555px;
  width: 100%;
  max-width: 1140px;
  min-width: 800px;
  padding: 0 20px;
  margin: 0 auto;
  box-sizing: border-box;
  ${({ RWD, isNoDataLayer }) =>
    !RWD.isMobile &&
    !RWD.isTablet &&
    `
    ${isNoDataLayer && `display:none`};
  `}
  .data-list {
    display: flex;
    align-items: center;
    width: 100%;
    height: 70px;
    background-color: ${colors.getIn(["main", "listBackground"])};
    box-sizing: border-box;
    border-bottom: 1px solid ${colors.getIn(["other", "line"])};
    animation: 0.5s fade;
    cursor: pointer;
    &:hover {
      background-color: ${colors.getIn(["main", "border"])};
    }
    .main-title {
      width: 185px;
      color: #fff;
      font-size: 16px;
      box-sizing: border-box;
      padding-left: 40px;
    }
    .date {
      text-align: center;
      width: 170px;
      color: ${colors.getIn(["main", "text"])};
      font-size: 15px;
    }
    .bonus-tag {
      width: 200px;
      padding-left: 65px;
      box-sizing: border-box;
      .typeTag {
        display: inline-block;
        font-size: 13px;
        color: #fff;
        padding: 5px 9px;
        border-radius: 3px;
        &.freegame {
          background-color: ${colors.getIn(["accent", "blue"])};
        }
        &.bonus {
          background-color: ${colors.getIn(["accent", "purple"])};
        }
        &.singlerowbet {
          background-color: ${colors.getIn(["accent", "green"])};
        }
      }
    }
    .roundid {
      width: 280px;
      font-size: 15px;
      color: #fff;
    }
    .wins {
      text-align: right;
      width: 100px;
      color: #fff;
      font-size: 16px;
      &.isWin {
        color: ${colors.getIn(["accent", "green"])};
      }
    }
    .arrow {
      width: 125px;
      box-sizing: border-box;
      padding-right: 20px;
      text-align: right;
      .svg-IoIosArrowForward {
        width: 20px;
        height: 20px;
        fill: #fff;
      }
    }
  }
  .padd {
    height: 35px;
  }
  .layout {
    &:nth-child(1) .data-list {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    &:last-child .data-list {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      border-bottom: none;
    }
  }
  .norecord {
    padding-top: 45px;
    text-align: center;
    font-size: 18px;
    color: ${colors.getIn(["main", "text"])};
  }
`;
export const DesktopCreateDataList = ({
  filterNameset,
  timeShowFilter,
  filterTypeTag,
  filterCA01Type,
}) => {
  const scrollRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);
  const [state, dispatch] = useContext(ReducerContext);
  const CreateList = ({ index, style, data }) => {
    const isLast = index + 1 === state.showDataList.size;
    return (
      <div className="layout" style={style}>
        <div
          className="data-list"
          onClick={() => {
            fetchDetailLink({
              getGameToken: state.getGameToken,
              rounid: data.getIn([index, "roundid"]),
              langType: state.langType,
              gamecode: data.getIn([index, "gamecode"]),
            });
          }}
        >
          <div className="main-title">
            {filterNameset(
              data.getIn([index, "nameset"]),
              data.getIn([index, "gamename"])
            )}
            {data.getIn([index, "tabletype"]) !== "" &&
              filterCA01Type(data.getIn([index, "tabletype"]))}
          </div>
          <div className="date">
            {timeShowFilter(data.getIn([index, "createtime"]), true)}
          </div>
          <div className="bonus-tag">
            {filterTypeTag(data.getIn([index, "detail"]))}
          </div>
          <div className="roundid">{data.getIn([index, "roundid"])}</div>
          <div
            className={cx("wins", { isWin: data.getIn([index, "wins"]) >= 0 })}
          >
            {data.getIn([index, "wins"]) > 0 && `+`}
            {numeral(data.getIn([index, "wins"])).format("0.00")}
          </div>
          <div className="arrow">
            <IoIosArrowForward className="svg-IoIosArrowForward" />
          </div>
        </div>
        {isLast && <div className="padd" />}
        {state.pagenations.status && isLast && <Pagenations />}
      </div>
    );
  };
  useEffect(() => {
    dispatch({
      type: "setDataRenderDone",
      payload: {
        status: true,
      },
    });
  }, [dispatch]);
  return (
    <StyledDesktopCreateDataList
      RWD={{
        isMobile: state.isMobile,
        isTablet: state.isTablet,
      }}
      isNoDataLayer={state.isNoDataLayer}
    >
      {state.dataRenderDone && state.showDataList.size > 0 && (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={scrollRef}
              height={height}
              width={width}
              itemCount={state.showDataList.size}
              itemData={state.showDataList}
              itemSize={70}
              onScroll={(e) => {
                e.scrollOffset > 0 ? setIsScroll(true) : setIsScroll(false);
              }}
            >
              {CreateList}
            </List>
          )}
        </AutoSizer>
      )}
      {state.dataRenderDone && state.showDataList.size === 0 && (
        <div className="norecord">
          {language.getIn([state.langType, "dataList", "norecord"])}
        </div>
      )}
      {isScroll && (
        <GoTop
          bodyRef={scrollRef}
          isMobile={state.isMobile}
          isTablet={state.isTablet}
        />
      )}
    </StyledDesktopCreateDataList>
  );
};
