import noop from "lodash/noop";
import { fromJS } from "immutable";
// api
// import { apiSearchTime, apiSearchId, apiDetailLink } from "../../api";
import { detailData, idData } from "../../demoData";

const dataReset = ({ setFun = noop, code = "", status = true }) => {
  setFun({
    type: "setDataList",
    payload: {
      isLoading: status,
      data: fromJS(),
      code: code,
      offset: Number(),
      totalCount: Number(),
    },
  });
};
const specialCodeCheck = (code = 0) => {
  switch (code) {
    case 4006:
      return true;
    default:
      return false;
  }
};
const fetchResult = ({ props }) => {
  const res = props.res;
  // const msg = res.data.error_msg;
  // const code = res.data.error_code;
  const msg = "SUCCESS";
  const code = 200;
  if (props.isId) {
    // const data = res.data.result.data ? res.data.result.data : [];
    const data = res;
    if (code === 4006) {
      props.dispatch({
        type: "getIDsuccess",
        payload: {
          DataRenderDoneStatus: false,
          IsNoDataLayerStatus: false,
          MSearchPopupStatus: false,
        },
      });
      dataReset({
        setFun: props.dispatch,
        code: code,
        status: specialCodeCheck(code),
      });
      return;
    } else if (data.length === 0 || msg !== "SUCCESS") {
      props.dispatch({
        type: "getIDsuccess",
        payload: {
          DataRenderDoneStatus: true,
          IsNoDataLayerStatus: true,
          MSearchPopupStatus: false,
        },
      });
      return;
    } else {
      props.dispatch({
        type: "setDataList",
        payload: {
          isLoading: false,
          // data: fromJS(data),
          data: data.get("data"),
          code: code,
          offset: 1,
          totalCount: 1,
        },
      });
      props.dispatch({
        type: "getIDfaile",
        payload: {
          DataRenderDoneStatus: true,
          MSearchPopupStatus: false,
        },
      });
    }
    return;
  }
  if (msg === "SUCCESS") {
    // const dataList = res.data.result.data.list ? res.data.result.data.list : [];
    // const totalCount = res.data.result.data.count
    //   ? res.data.result.data.count
    //   : Number();
    props.dispatch({
      type: "setDataList",
      payload: {
        isLoading: false,
        // data: fromJS(dataList),
        data: res.getIn(["data", "list"]),
        code: code,
        offset: props.offset,
        // totalCount: totalCount,
        totalCount: res.getIn(["data", "count"]),
      },
    });
  } else {
    dataReset({
      setFun: props.dispatch,
      code: code,
      status: specialCodeCheck(code),
    });
  }
};
// fetchSearchTimeData
export const fetchSearchTimeData = ({ props }) => {
  // const { offset = "0", count = "1000" } = props;
  dataReset({ setFun: props.dispatch });
  // const params = {
  //   token: props.getGameToken,
  //   begin: props.beginTime,
  //   end: props.endTime,
  //   offset: offset,
  //   count: count,
  // };
  const timeout = setTimeout(() => {
    fetchResult({ props: { ...props, res: detailData } });
    return () => clearTimeout(timeout);
  }, 100);
  // apiSearchTime(params)
  //   .then((res) => fetchResult({ props: { ...props, res: res } }))
  //   .catch((error) => console.log(error));
};
// fetchSearchIdData
export const fetchSearchIdData = ({ props }) => {
  // const params = {
  //   token: props.getGameToken,
  //   id: props.rounid,
  // };
  fetchResult({ props: { ...props, res: idData, isId: true } });
  // apiSearchId(params)
  //   .then((res) => fetchResult({ props: { ...props, res: res, isId: true } }))
  //   .catch((error) => console.log(error));
};
// fetchDetailLink
export const fetchDetailLink = ({
  getGameToken,
  rounid,
  langType = "",
  gamecode = "game_id",
}) => {
  // const params = {
  //   token: getGameToken,
  //   id: rounid,
  //   game_id: gamecode,
  // };
  // const windowOpen = window.open("about:blank", "redirect");
  // apiDetailLink(params)
  //   .then((res) => {
  //     const msg = res.data.error_msg;
  //     if (msg === "SUCCESS") {
  //       const link = res.data.result.data.link;
  //       const newUrl = `${link}&language=${langType}&gamecode=${gamecode}`;
  //       if (window.$APIAPP) {
  //         if (window.$APIAPP.openView) {
  //           window.$APIAPP.openView(newUrl);
  //         }
  //       }
  //       windowOpen.open(newUrl, "redirect");
  //     } else {
  //       windowOpen.open("", "redirect");
  //       console.log(msg);
  //     }
  //   })
  //   .catch((error) => console.log(error));
  window.open("about:blank", "redirect");
};
