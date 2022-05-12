import React, { useState, useContext, useEffect } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
import cx from "classnames";
// icons
import { IoIosArrowDown } from "react-icons/io";
import { BsCheck } from "react-icons/bs";

const StyledPagesStatusSelected = styled.div`
  position: relative;
  padding: 11px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  background-color: ${colors.getIn(["main", "button"])};
  margin-left: 8px;
  .left {
    padding-right: 20px;
  }
  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: 0.5s fade;
  }
  .desktop-select {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    width: 100%;
    .list-style {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      font-size: 15px;
      color: ${colors.getIn(["main", "bodyBackground"])};
      height: 49px;
      border-bottom: 1px solid ${colors.getIn(["main", "selectedBorder"])};
      &:nth-child(1) {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 50px;
        border-bottom: unset;
      }
      &:hover {
        background-color: ${colors.getIn(["main", "selected"])};
        border-bottom: 1px solid ${colors.getIn(["main", "selected"])};
        font-weight: bold;
      }
    }
    .list-style .svg-BsCheck {
      position: absolute;
      top: 50%;
      left: 10px;
      width: 18px;
      height: 18px;
      transform: translateY(-50%);
    }
  }
  ${({ RWD }) =>
    !RWD.isMobile &&
    !RWD.isTablet &&
    `
    padding:0 12px;
    margin-left:0;
    height:100%;
    border-radius:4px;
    .left { padding-right:30px; }
    select { cursor: pointer; }
  `}
`;
const PagesStatusSelected = ({ alertPop }) => {
  const [state, dispatch] = useContext(ReducerContext);
  const [pagesStatusSelected, setPagesStatusSelected] = useState(false);
  const list = ["300", "500", "800", "1000"];
  const isDesktop = !state.isMobile && !state.isTablet;
  useEffect(() => {
    const handleClickOutside = (event) => {
      const pagesStatusId = document.getElementById("pagesStatus");
      if (pagesStatusId && !pagesStatusId.contains(event.target)) {
        setPagesStatusSelected(false);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <StyledPagesStatusSelected
      className={`ga_displaynum`}
      RWD={{ isMobile: state.isMobile, isTablet: state.isTablet }}
      onClick={() => {
        if (!isDesktop) {
          dispatch({
            type: "setMSelectorPopup",
            payload: {
              status: true,
              type: "pageCount",
              selectedCusDate: state.mSelectorPopup.selectedCusDate,
            },
          });
          return;
        }
        setPagesStatusSelected((prev) => !prev);
      }}
    >
      <div className="left ga_displaynum">{state.currentCount}</div>
      <IoIosArrowDown className="svg-IoIosArrowDown ga_displaynum" />
      {isDesktop && pagesStatusSelected && (
        <div className="desktop-select">
          {list.map((v, k) => {
            return (
              <div
                className={`list-style ga_displaynum_${v}`}
                key={k}
                onClick={() => {
                  if (state.timeBusy || state.dataList.isLoading) {
                    alertPop({
                      text: language.getIn([state.langType, "alert", "busy"]),
                      color: colors.getIn(["accent", "red"]),
                    });
                    dispatch({
                      type: "setCurrentCount",
                      payload: {
                        number: state.currentCount,
                      },
                    });
                  } else {
                    dispatch({
                      type: "setStatusSelected",
                      payload: {
                        dataRenderDone: false,
                        timeBusy: true,
                        currentCount: v,
                        currentOffset: "0",
                      },
                    });
                  }
                }}
              >
                {state.currentCount === v && (
                  <BsCheck className={`svg-BsCheck ga_displaynum_${v}`} />
                )}
                {v}
              </div>
            );
          })}
        </div>
      )}
    </StyledPagesStatusSelected>
  );
};
const StyledDataStatusSelected = styled.ul`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  li {
    width: 100%;
    padding: 11px 0;
    color: #fff;
    font-size: 13px;
    background-color: ${colors.getIn(["main", "button"])};
    animation: 0.5s fade;
    text-align: center;
    &:nth-child(1) {
      border-radius: 5px 0 0 5px;
    }
    &:nth-child(2) {
      border-left: 1px solid ${colors.getIn(["other", "line"])};
      border-right: 1px solid ${colors.getIn(["other", "line"])};
    }
    &:nth-child(3) {
      border-radius: 0 5px 5px 0;
    }
    &:nth-child(4) {
      padding: 0;
      background-color: unset;
    }
    &.selected {
      background-color: ${colors.getIn(["main", "selected"])};
      color: ${colors.getIn(["main", "bodyBackground"])};
    }
  }
  ${({ RWD }) =>
    RWD.isTablet &&
    `
    width:60%;
    li {
      font-size:14px;
    }
  `};
  ${({ RWD }) =>
    !RWD.isMobile &&
    !RWD.isTablet &&
    `
    position: relative;
    left:0;
    transform: unset;
    justify-content:flex-start;
    margin-top: 35px;
    li {
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0;
      width:90px;
      height:50px;
      cursor: pointer;
      &:nth-child(1) {
        border-radius:4px 0 0 4px;
      }
      &:nth-child(3) {
        border-radius:0 4px 4px 0;
      }
      &:nth-child(4) {
        position: absolute;
        right: 0;
      }
    }
  `}
`;
export const DataStatusSelected = ({ alertPop }) => {
  const [state, dispatch] = useContext(ReducerContext);
  const list = language.getIn([state.langType, "headerList"]).toJS();
  return (
    <StyledDataStatusSelected
      RWD={{ isMobile: state.isMobile, isTablet: state.isTablet }}
    >
      {list.map((v, k) => {
        const getGAClassname = (classname) => {
          switch (classname) {
            case "default":
              return `ga_winpoint_default`;
            case "isWin":
              return `ga_winpoint_win`;
            case "isLose":
              return `ga_winpoint_notwin`;
            default:
              break;
          }
        };
        return (
          <li
            key={k}
            className={cx(`${getGAClassname(v.type)}`, {
              selected: state.filterType === v.type,
            })}
            onClick={() =>
              dispatch({
                type: "setFilterType",
                payload: {
                  type: v.type,
                },
              })
            }
          >
            {v.name}
          </li>
        );
      })}
      <li className={`ga_displaynum`}>
        <PagesStatusSelected alertPop={alertPop} />
      </li>
    </StyledDataStatusSelected>
  );
};
