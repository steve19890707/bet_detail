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
const StyledMobileCreateDataList = styled.div`
  width: calc(100% - 40px);
  margin: 0 auto;
  height: calc(100vh - 200px);
  .data-list {
    box-sizing: border-box;
    padding: 15px 17px;
    border-radius: 5px;
    background-color: ${colors.getIn(["main", "listBackground"])};
    margin-bottom: 15px;
    animation: 0.5s fade;
  }
  .layout {
    &:last-child .data-list {
      margin-bottom: 0;
    }
  }
  .padd {
    height: 25px;
  }
  .data-list .top-area {
    position: relative;
    display: flex;
    align-items: flex-end;
    padding-bottom: 10px;
    border-bottom: 1px solid ${colors.getIn(["main", "border"])};
    .typeTag {
      font-size: 12px;
      color: #fff;
      padding: 4px 8px;
      border-radius: 2px;
      margin-left: 20px;
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
    .svg-IoIosArrowForward {
      position: absolute;
      right: 5px;
      top: calc(50% - 5px);
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      fill: #fff;
    }
  }
  .data-list .top-area .captions {
    .main-title {
      color: #fff;
      font-size: 15px;
    }
    .date {
      color: ${colors.getIn(["main", "text"])};
      font-size: 12px;
    }
  }
  .data-list .bottom-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    .roundid {
      font-size: 14px;
      color: #fff;
    }
    .wins {
      color: #fff;
      font-size: 16px;
      &.isWin {
        color: ${colors.getIn(["accent", "green"])};
      }
    }
  }
  .norecord {
    padding-top: 45px;
    text-align: center;
    font-size: 16px;
    color: ${colors.getIn(["main", "text"])};
  }
  ${({ RWD }) =>
    RWD.isTablet &&
    `
    width:calc(100% - 70px);
    .data-list { 
      padding:15px 25px;
      margin-bottom:25px;
    }
    .layout {
      &:last-child .data-list{
        margin-bottom:0;
      }
    }
    .padd { height:35px; }
    .data-list .top-area {
      padding-bottom: 16px;
    }
    .data-list .top-area .svg-IoIosArrowForward {
      width:22px;
      height:22px;
    }
    .data-list .top-area .captions {
      .main-title {
        font-size:16px;
      }
      .date {
        padding-top:2px;
        font-size:13px;
      }
    }
    .data-list .bottom-area {
      padding-top:12px;
      .roundid { 
        font-size:15px;
      }
      .wins {
        font-size:18px;
      }
    }
  `};
`;
export const MobileCreateDataList = ({
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
          <div className="top-area">
            <div className="captions">
              <div className="main-title">
                {filterNameset(
                  data.getIn([index, "nameset"]),
                  data.getIn([index, "gamename"])
                )}
                {data.getIn([index, "tabletype"]) !== "" &&
                  filterCA01Type(data.getIn([index, "tabletype"]))}
              </div>
              <div className="date">
                {timeShowFilter(data.getIn([index, "createtime"]))}
              </div>
            </div>
            {filterTypeTag(data.getIn([index, "detail"]))}
            <IoIosArrowForward className="svg-IoIosArrowForward" />
          </div>
          <div className="bottom-area">
            <div className="roundid">{data.getIn([index, "roundid"])}</div>
            <div
              className={cx("wins", {
                isWin: data.getIn([index, "wins"]) >= 0,
              })}
            >
              {data.getIn([index, "wins"]) > 0 && `+`}
              {numeral(data.getIn([index, "wins"])).format("0.00")}
            </div>
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
    <StyledMobileCreateDataList
      RWD={{
        isMobile: state.isMobile,
        isTablet: state.isTablet,
      }}
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
              itemSize={state.isTablet ? 151 : 126}
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
    </StyledMobileCreateDataList>
  );
};
