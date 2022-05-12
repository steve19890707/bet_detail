import React, { useContext } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import moment from "moment-timezone";
import { language } from "../../constants/Language";
// components
import { MobileCreateDataList } from "./Mobile";
import { DesktopCreateDataList } from "./Desktop";
const StyledBody = styled.div`
  ${({ RWD }) =>
    RWD.isMobile &&
    `
    padding-top:200px;
  `}
  ${({ RWD }) =>
    RWD.isTablet &&
    `
    padding-top:220px;
  `}
  ${({ RWD }) =>
    !RWD.isMobile &&
    !RWD.isTablet &&
    `
    padding-top:0px;
  `}
`;
const StyledTabletype = styled.span`
  color: #f4c000;
`;
export const Body = () => {
  const [state] = useContext(ReducerContext);
  const filterNameset = (value, enName = "") => {
    const getNameset = value.filter((v) => v.get("lang") === state.langType);
    const name = getNameset.getIn([0, "name"])
      ? getNameset.getIn([0, "name"])
      : enName;
    return name;
  };
  // 特例
  const filterCA01Type = (tabletype = "") => {
    let type = "none";
    switch (tabletype) {
      case "1":
        type = "百家乐";
        break;
      case "2":
        type = "轮盘";
        break;
      case "3":
        type = "骰宝";
        break;
      case "4":
        type = "龙虎";
        break;
      default:
        break;
    }
    return (
      <>
        {type !== "none" && "-"}
        {type !== "none" && <StyledTabletype>{type}</StyledTabletype>}
      </>
    );
  };
  const timeShowFilter = (time, desktop = false) => {
    const creattime = time.split("T");
    const creattime2 = creattime[1].split("-");
    const isCurrentTime = moment(`${creattime[0]} ${creattime2[0]}`);
    const transformTZ = moment(isCurrentTime)
      .add(state.currentTZ, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    const desktopTransformTZ = moment(isCurrentTime)
      .add(state.currentTZ, "hours")
      .format("YYYY/MM/DD HH:mm:ss");
    return desktop ? desktopTransformTZ : transformTZ;
  };
  const filterTypeTag = (value) => {
    return value.map((v, k) => {
      const keyTitle = Object.keys(v.toJS())[0];
      if (keyTitle === "freegame" && v.get(keyTitle) > 0) {
        return (
          <div className="typeTag freegame" key={k}>
            {language.getIn([state.langType, "dataList", "freegame"])}
          </div>
        );
      } else if (keyTitle === "bonus" && v.get(keyTitle) > 0) {
        return (
          <div className="typeTag bonus" key={k}>
            {language.getIn([state.langType, "dataList", "bonus"])}
          </div>
        );
      } else if (keyTitle === "singlerowbet" && v.get(keyTitle) > 0) {
        return (
          <div className="typeTag singlerowbet" key={k}>
            {language.getIn([state.langType, "dataList", "singlerowbet"])}
          </div>
        );
      } else return null;
    });
  };
  return (
    <StyledBody RWD={{ isMobile: state.isMobile, isTablet: state.isTablet }}>
      {state.isMobile && (
        <MobileCreateDataList
          filterNameset={filterNameset}
          timeShowFilter={timeShowFilter}
          filterTypeTag={filterTypeTag}
          filterCA01Type={filterCA01Type}
        />
      )}
      {!state.isMobile && !state.isTablet && (
        <DesktopCreateDataList
          filterNameset={filterNameset}
          timeShowFilter={timeShowFilter}
          filterTypeTag={filterTypeTag}
          filterCA01Type={filterCA01Type}
        />
      )}
    </StyledBody>
  );
};
