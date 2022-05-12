export const getGameToken = new URL(window.location).searchParams.get(
  "gametoken"
)
  ? new URL(window.location).searchParams.get("gametoken")
  : null;

export const urlLangType = new URL(window.location).searchParams.get("language")
  ? new URL(window.location).searchParams.get("language")
  : null;

export const setDocTitle = (urlLangType) => {
  let docTitle = "";
  switch (urlLangType) {
    case "zh-cn":
      docTitle = `玩家注单查询`;
      break;
    case "th":
      docTitle = `การวิจัยการเดิมพันของผู้เล่น`;
      break;
    case "vn":
      docTitle = `Lịch sử đơn cược`;
      break;
    default:
      docTitle = `Player Betting Research`;
      break;
  }
  return (document.title = docTitle);
};
