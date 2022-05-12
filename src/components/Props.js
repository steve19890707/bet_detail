import React, { createContext, useReducer } from "react";
import device from "current-device";
import { getGameToken, urlLangType } from "../configs/initParams"; // setDocTitle
import { List } from "immutable";
import { timeZone } from "./Common/TimeZone";
import { App } from "./App";
const langType =
  urlLangType !== "zh-cn" &&
  urlLangType !== "th" &&
  urlLangType !== "en" &&
  urlLangType !== "vn"
    ? "en"
    : urlLangType;
// setDocTitle(urlLangType);
const ReducerContext = createContext();
export { ReducerContext };
const initState = {
  getGameToken: getGameToken,
  langType: langType,
  isMobile: !device.desktop(),
  isTablet: device.tablet(),
  alertArr: List(),
  alertText: {
    text: "",
    color: "",
  },
  currentTZ: "0",
  currentCount: "300",
  currentOffset: "0",
  customizedBeforeDay: "0",
  dataList: {
    isLoading: true,
    data: List(),
    code: "",
    offset: Number(),
    totalCount: Number(),
  },
  dataRenderDone: false,
  filterType: "default",
  sendTimeZone: {
    begin: timeZone.beforeThirty(),
    end: timeZone.now(),
  },
  showDataList: List(),
  isNoDataLayer: false,
  inputCurrentVal: "",
  pagenations: {
    status: false,
    current: 1,
    total: 0,
  },
  timeBusy: false,
  timeSearchType: {
    type: "beforeThirty",
    content: "",
  },
  selectedDateSearch: {
    type: "beforeThirty",
  },
  searchTypeCatch: {
    type: "beforeThirty",
  },
  // mobile state
  mSearchPopup: false,
  mSelectorPopup: {
    status: false,
    type: "",
    selectedCusDate: 0,
  },
};
const todoReducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "setAlertArr":
      return { ...state, alertArr: payload.data };
    case "setAlertText":
      return {
        ...state,
        alertText: {
          text: payload.text,
          color: payload.color,
        },
      };
    case "setStaticCurrentTZ":
      return {
        ...state,
        filterType: "default",
        currentTZ: payload.number,
        dataRenderDone: true,
      };
    case "setCurrentTZ":
      return {
        ...state,
        currentOffset: "0",
        filterType: "default",
        currentTZ: payload.number,
        sendTimeZone: {
          begin: payload.beginTime,
          end: payload.endTime,
        },
      };
    case "setCurrentCount":
      return { ...state, currentCount: payload.number };
    case "setCurrentOffset":
      return { ...state, currentOffset: payload.number };
    case "setDataList":
      return {
        ...state,
        dataList: {
          isLoading: payload.isLoading,
          data: payload.data,
          code: payload.code,
          offset: payload.offset,
          totalCount: payload.totalCount,
        },
      };
    case "setDataRenderDone":
      return { ...state, dataRenderDone: payload.status };
    case "setFilterType":
      return { ...state, filterType: payload.type };
    case "setPagenations":
      return {
        ...state,
        pagenations: {
          status: payload.status,
          current: payload.current,
          total: payload.total,
        },
      };
    case "setSendTimeZone":
      return {
        ...state,
        sendTimeZone: {
          begin: payload.begin,
          end: payload.end,
        },
      };
    case "setShowDataList":
      return { ...state, showDataList: payload.data };
    case "setIsNoDataLayer":
      return {
        ...state,
        isNoDataLayer: payload.status,
        selectedDateSearch: {
          type: state.searchTypeCatch.type,
        },
        timeSearchType: {
          type: state.searchTypeCatch.type,
          content: state.timeSearchType.content,
        },
      };
    case "setInputCurrentVal":
      return { ...state, inputCurrentVal: payload.text };
    case "setTimeBusy":
      return { ...state, timeBusy: payload.status };
    case "setTimeSearchType":
      return {
        ...state,
        timeSearchType: {
          type: payload.type,
          content: payload.content,
        },
      };
    case "setSelectedDateSearch":
      return {
        ...state,
        selectedDateSearch: {
          type: payload.type,
        },
      };
    case "setCustomizedBeforeDay":
      return { ...state, customizedBeforeDay: payload.day };
    // mobile
    case "setMSearchPopup":
      return { ...state, mSearchPopup: payload.status };
    case "setMSelectorPopup":
      return {
        ...state,
        mSelectorPopup: {
          status: payload.status,
          type: payload.type,
          selectedCusDate: payload.selectedCusDate,
        },
      };
    // for location action Collection
    case "SearchDataUpdate":
      return {
        ...state,
        filterType: payload.filterTypeType,
        currentOffset: payload.currentOffsetNumber,
        dataRenderDone: payload.dataRenderDoneStatus,
        sendTimeZone: {
          begin: payload.sendTimeZoneBegin,
          end: payload.sendTimeZoneEnd,
        },
        timeSearchType: {
          type: payload.timeSearchTypeType,
          content: payload.timeSearchTypeContent,
        },
        selectedDateSearch: {
          type: payload.selectedDateSearchType,
        },
        searchTypeCatch: {
          type: payload.selectedDateSearchType,
        },
      };
    case "mobileSearchPageDataUpdate":
      return {
        ...state,
        filterType: payload.filterTypeType,
        currentOffset: payload.currentOffsetNumber,
        mSearchPopup: payload.mSearchPopupStatus,
        dataRenderDone: payload.dataRenderDoneStatus,
        sendTimeZone: {
          begin: payload.sendTimeZoneBegin,
          end: payload.sendTimeZoneEnd,
        },
        timeSearchType: {
          type: payload.timeSearchTypeType,
          content: payload.timeSearchTypeContent,
        },
        selectedDateSearch: {
          type: payload.selectedDateSearchType,
        },
        searchTypeCatch: {
          type: payload.selectedDateSearchType,
        },
      };
    case "setIdSearch":
      return {
        ...state,
        timeBusy: payload.timeBusy,
        inputCurrentVal: payload.inputCurrentVal,
        dataRenderDone: payload.dataRenderDone,
        isNoDataLayer: payload.isNoDataLayer,
        selectedDateSearch: payload.selectedDateSearch,
        timeSearchType: payload.timeSearchType,
      };
    case "setStatusSelected":
      const isNewCurrentCount = payload.currentCount === state.currentCount;
      const isNewCurrentOffset = payload.currentOffset === state.currentOffset;
      if (isNewCurrentCount && isNewCurrentOffset) {
        return state;
      } else
        return {
          ...state,
          dataRenderDone: payload.dataRenderDone,
          timeBusy: payload.timeBusy,
          currentCount: payload.currentCount,
          currentOffset: payload.currentOffset,
        };
    // for api action Collection
    case "getIDsuccess":
      return {
        ...state,
        dataRenderDone: payload.DataRenderDoneStatus,
        isNoDataLayer: payload.IsNoDataLayerStatus,
        mSearchPopup: payload.MSearchPopupStatus,
      };
    case "getIDfaile":
      return {
        ...state,
        dataRenderDone: payload.DataRenderDoneStatus,
        mSearchPopup: payload.MSearchPopupStatus,
      };
    default:
      return state;
  }
};
export const Props = () => {
  const reducer = useReducer(todoReducer, initState);
  return (
    <ReducerContext.Provider value={reducer}>
      <App />
    </ReducerContext.Provider>
  );
};
