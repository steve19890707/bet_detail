import React, { useState, useEffect, useContext } from "react";
import { ReducerContext } from "./Props";
import packageJson from "../../package.json";
import styled from "styled-components";
import { List } from "immutable";
// common
import { fetchSearchTimeData } from "./Common/FetchApiData";
import { LoaderPage, DesktopLoader } from "./Common/Loader";
import { BottomAlertTips } from "./Common/AlertTips";
import { SearchNoData } from "./Common/SearchNoData";
// components
import { Header } from "./Header";
import { Body } from "./Body/Index";
import { SearchPage } from "./MobileSearchPage/Index";
import { MobileSelectorPopup } from "./MobileSelectorPopup/Index";
import { Aside } from "./Aside/Index";
const StyledApp = styled.div`
  width: 100%;
  min-height: 100vh;
  @keyframes fade {
    0% {
      pointer-events: none;
    }
    99% {
      pointer-events: none;
    }
    100% {
      pointer-events: unset;
    }
  } ;
`;
const StyledDesktopContainer = styled.div`
  ${({ RWD }) =>
    !RWD.isMobile &&
    !RWD.isTablet &&
    `
    display:flex;
  `}
`;
export const App = () => {
  const [state, dispatch] = useContext(ReducerContext);
  const [alertArrCount, setAlertArrCount] = useState(0);
  const [callAlertStatus, setCallAlertStatus] = useState(false);
  const isDesktop = !state.isMobile && !state.isTablet;
  const verificationFailed = isDesktop && state.dataList.code === 4006;
  // pagenations count
  const pagenationsIsStatus = ({ totalCount, currentCount }) => {
    const status = totalCount / currentCount >= 1;
    return status;
  };
  const filterDataType = ({ type = "default", data = List() }) => {
    switch (type) {
      case "default":
        return data;
      case "isWin":
        return data.filter((v) => v.get("wins") > 0);
      case "isLose":
        return data.filter((v) => v.get("wins") <= 0);
      default:
        return data;
    }
  };
  const alertPop = ({ text = "", color = "" }) => {
    dispatch({
      type: "setAlertText",
      payload: {
        text: text,
        color: color,
      },
    });
    dispatch({
      type: "setAlertArr",
      payload: {
        data: state.alertArr.update((v) => v.push(v.size)),
      },
    });
    setAlertArrCount((prev) => {
      return (prev += 1);
    });
    const timeout = setTimeout(() => {
      setAlertArrCount((prev) => {
        return (prev -= 1);
      });
      return clearTimeout(timeout);
    }, 5000);
  };
  // get api data
  useEffect(() => {
    fetchSearchTimeData({
      props: {
        getGameToken: state.getGameToken,
        beginTime: state.sendTimeZone.begin,
        endTime: state.sendTimeZone.end,
        offset: state.currentOffset,
        count: state.currentCount,
        dispatch: dispatch,
      },
    });
  }, [
    state.getGameToken,
    state.sendTimeZone,
    state.currentOffset,
    state.currentCount,
    dispatch,
  ]);
  // data for layout
  useEffect(() => {
    !state.dataList.isLoading &&
      dispatch({
        type: "setShowDataList",
        payload: {
          data: filterDataType({
            type: state.filterType,
            data: state.dataList.data,
          }),
        },
      });
  }, [
    state.dataList.data,
    state.dataList.isLoading,
    state.filterType,
    dispatch,
  ]);
  // pagenations
  useEffect(() => {
    if (
      pagenationsIsStatus({
        totalCount: state.dataList.totalCount,
        currentCount: state.currentCount,
      })
    ) {
      dispatch({
        type: "setPagenations",
        payload: {
          status: true,
          current: Math.ceil(state.currentOffset / state.currentCount) + 1,
          total: Math.ceil(state.dataList.totalCount / state.currentCount),
        },
      });
    } else {
      dispatch({
        type: "setPagenations",
        payload: {
          status: false,
          current: 1,
          total: 0,
        },
      });
    }
  }, [
    state.dataList.totalCount,
    state.currentOffset,
    state.currentCount,
    dispatch,
  ]);
  // stop api data dense calling
  useEffect(() => {
    if (state.timeBusy) {
      const timeout = setTimeout(() => {
        dispatch({
          type: "setTimeBusy",
          payload: {
            status: false,
          },
        });
        return clearTimeout(timeout);
      }, 4000);
    }
  }, [state.timeBusy, state.setTimeBusy, dispatch]);
  return (
    <StyledDesktopContainer
      RWD={{
        isMobile: state.isMobile,
        isTablet: state.isTablet,
      }}
    >
      {isDesktop && <Aside alertPop={alertPop} />}
      <StyledApp data-version={packageJson.version}>
        {((!state.dataRenderDone && !isDesktop) || verificationFailed) && (
          <LoaderPage
            props={{
              langType: state.langType,
              code: state.dataList.code,
              isMobile: state.isMobile,
              isTablet: state.isTablet,
            }}
          />
        )}
        {/* for desktop start*/}
        {isDesktop && <Header alertPop={alertPop} isDesktop={isDesktop} />}
        {!state.dataRenderDone && isDesktop && (
          <DesktopLoader props={{ langType: state.langType }} />
        )}
        {/* for desktop end*/}
        {!state.dataList.isLoading && (
          <>
            {state.isMobile && (
              <Header
                alertPop={alertPop}
                callAlertStatus={callAlertStatus}
                setCallAlertStatus={setCallAlertStatus}
              />
            )}
            <Body />
          </>
        )}
        {state.isMobile && <SearchPage alertPop={alertPop} />}
        {state.isMobile && state.mSelectorPopup.status && (
          <MobileSelectorPopup
            alertPop={alertPop}
            setCallAlertStatus={setCallAlertStatus}
          />
        )}
        {state.isNoDataLayer && <SearchNoData zIndex={3} />}
        {state.alertArr.map((v, k) => {
          return (
            <BottomAlertTips
              key={k}
              alertArrCount={alertArrCount}
              alertText={state.alertText}
            />
          );
        })}
      </StyledApp>
    </StyledDesktopContainer>
  );
};
