import React, { useContext } from "react";
import { ReducerContext } from "../Props";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
import { timeZone } from "../Common/TimeZone";

export const Customized = ({ props }) => {
  const [state, dispatch] = useContext(ReducerContext);
  const { alertPop, StyledSelector } = props;
  const List = language
    .getIn([state.langType, "cusDate"])
    .filter((v, k) => k !== 0);
  return (
    <StyledSelector>
      {List.map((v, k) => {
        const optionContent = `${v.get("label")} ${timeZone.getCusDateShow(
          v.get("value"),
          state.currentTZ
        )}`;
        return (
          <div
            key={k}
            className={cx(`list-style ga_customdate_${v.get("value")}`, {
              active: v.get("value") === state.mSelectorPopup.selectedCusDate,
            })}
            onClick={() => {
              if (state.timeBusy) {
                alertPop({
                  text: language.getIn([state.langType, "alert", "busy"]),
                  color: colors.getIn(["accent", "red"]),
                });
              } else {
                dispatch({
                  type: "setTimeBusy",
                  payload: {
                    status: true,
                  },
                });
                dispatch({
                  type: "setIsNoDataLayer",
                  payload: {
                    status: false,
                  },
                });
                dispatch({
                  type: "mobileSearchPageDataUpdate",
                  payload: {
                    filterTypeType: "default",
                    currentOffsetNumber: "0",
                    sendTimeZoneBegin: timeZone.getCusDateBegin(
                      v.get("value"),
                      state.currentTZ
                    ),
                    sendTimeZoneEnd: timeZone.getCusDateEnd(
                      v.get("value"),
                      state.currentTZ
                    ),
                    timeSearchTypeType: "customized",
                    timeSearchTypeContent: v.get("value"),
                    mSearchPopupStatus: false,
                    dataRenderDoneStatus: false,
                    selectedDateSearchType: "customized",
                  },
                });
                dispatch({
                  type: "setMSelectorPopup",
                  payload: {
                    status: false,
                    type: "",
                    selectedCusDate: v.get("value"),
                  },
                });
              }
            }}
          >
            <div className={`text ga_customdate_${v.get("value")}`}>
              {optionContent}
            </div>
            <div className={`circle ga_customdate_${v.get("value")}`} />
          </div>
        );
      })}
    </StyledSelector>
  );
};
