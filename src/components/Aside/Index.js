import React,{ useState, useContext, useEffect } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// common
import { timeZone } from "../Common/TimeZone";
// components
import { CustomizeDateSelected } from "./CustomizeDateSelected";
import { IdSearch } from "./IdSearch";
import { TZchange } from "./TZchange";
const StyledAside = styled.div`
  position: relative;
  min-width:360px;
  height:100vh;
  min-height:800px;
  z-index:100;
  background-color: ${colors.getIn(['main','listBackground'])};
  box-sizing:border-box;
  padding:0 40px;
  .content {
    width:100%;
    padding-top:60px;
  }
  .date-search {
    padding-top:60px;
  }
  .main-title {
    text-align:center;
    font-size:24px;
    color:#fff;
  }
  .date-title {
    font-size:15px;
    color:#fff;
  }
  .src {
    position: relative;
    display:flex;
    align-items:center;
    justify-content:center;
    box-sizing:border-box;
    border-radius:5px;
    border:1px solid ${colors.getIn(['main','border'])};
    background-color:${colors.getIn(['main','listBackground'])};
    height:45px;
    margin-top:15px;
    transition:.2s;
    cursor: pointer;
    span {
      color:#fff;
      font-size:15px;
      transition:.2s;
    }
    &.active {
      border:1px solid ${colors.getIn(['main','selected'])};
      background-color:${colors.getIn(['main','selected'])};
      span {
        color:${colors.getIn(['main','bodyBackground'])};
        font-weight:bold;
      }
    }
    &.blur {
      border:1px solid transparent;
      background-color:${colors.getIn(['main','buttonDarken'])};
      span {
        color:${colors.getIn(['main','textDeep'])};
      }
    }
    .cusDate-select {
      position: absolute;
      z-index:2;
      width:100%;
      height:100%;
      opacity:0;
    }
  }
`;
export const Aside = ({ alertPop })=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const [ selectedCusDate, setSelectedCusDate ] = useState(0);
  const [ dateSearchSelected, setDateSearchSelected ] = useState(false);
  const setDataUpdate = ({
    beginTime='',
    endTime='',
    type='',
    dateContent='',
    selectedCusDate=0,
  })=>{
    dispatch({ type:'SearchDataUpdate', payload:{
      filterTypeType:'default',
      currentOffsetNumber:'0',
      sendTimeZoneBegin: beginTime,
      sendTimeZoneEnd: endTime,
      timeSearchTypeType: type,
      timeSearchTypeContent: dateContent,
      dataRenderDoneStatus:false,
      selectedDateSearchType: type
    }});
    setSelectedCusDate(selectedCusDate);
  };
  const getApiData = ({ type='',val=0, currentTZ=0 })=>{
    const checkTimeType = ({ type='', val=0, currentTZ=0 })=>{
      const time = { beginTime:'', endTime:'' };
      switch ( type ) {
        case 'beforeThirty':
          time.beginTime = timeZone.beforeThirty();
          time.endTime = timeZone.now();
          break;
        case 'today':
          time.beginTime = timeZone.getTodayBegin(currentTZ);
          time.endTime = timeZone.getTodayEnd(currentTZ);
          break;
        case 'customized':
          time.beginTime = timeZone.getCusDateBegin(val,currentTZ);
          time.endTime = timeZone.getCusDateEnd(val,currentTZ);
          break;
        default:
          time.beginTime = timeZone.beforeThirty();
          time.endTime = timeZone.now();
          break;
      };
      return time;
    };
    if(state.timeBusy || state.dataList.isLoading){
      alertPop({
        text: language.getIn([state.langType,'alert','busy']),
        color: colors.getIn(['accent','red']),
      });
    }else {
      dispatch({ type:'setTimeBusy', payload:{
        status: true
      }});
      dispatch({ type:'setIsNoDataLayer', payload:{
        status: false
      }});
      dispatch({ type:'setCustomizedBeforeDay', payload:{
        day: val
      }});
      setDataUpdate({
        beginTime: checkTimeType({ type:type, val:val, currentTZ: currentTZ }).beginTime,
        endTime: checkTimeType({ type:type, val:val, currentTZ: currentTZ }).endTime,
        type: type,
        dateContent: val,
        selectedCusDate: val
      }); 
    };
  }
  useEffect(()=>{
    const handleClickOutside = (event)=> {
      const dateSearchId = document.getElementById('dateSearch');
      if(dateSearchId && !dateSearchId.contains(event.target)){
        setDateSearchSelected(false);
      };
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[])
  return <StyledAside>
    <div className="content">
      <div className="main-title">{language.getIn([state.langType,'header','title'])}</div>
      <div className="date-search">
        <div className="date-title">{language.getIn([state.langType,'dateSearch'])}</div>
        <div className={cx('src ga_quicksearch_30',{ active : state.selectedDateSearch.type==='beforeThirty' },
          { blur : state.selectedDateSearch.type==='blur' })}
          onClick={()=> getApiData({ type:'beforeThirty' })}
        >
          <span className={`ga_quicksearch_30`}>{language.getIn([state.langType,'beforeThirty'])}</span>
        </div>
        <div className={cx('src ga_quicksearch_today',{ active : state.selectedDateSearch.type==='today' },
          { blur : state.selectedDateSearch.type==='blur' })}
          onClick={()=> getApiData({ type:'today', currentTZ: state.currentTZ })}
        >
          <span className={`ga_quicksearch_today`}>{language.getIn([state.langType,'today'])}</span>
        </div>
        <div className={cx('src ga_quicksearch_custom',{ active : state.selectedDateSearch.type==='customized' },
          { blur : state.selectedDateSearch.type==='blur' })}
          onClick={()=>setDateSearchSelected(prev=>!prev)}
        >
          <span className={`ga_quicksearch_custom`}>{language.getIn([state.langType,'customized'])}</span>
          {dateSearchSelected &&
            <CustomizeDateSelected props={{ 
              selectedCusDate,
              onChangeFun: e=>getApiData({ type:'customized', val: e, currentTZ: state.currentTZ })
            }}/>}
        </div>
      </div>
      <IdSearch alertPop={alertPop}/>
    </div>
    <TZchange alertPop={alertPop}/>
  </StyledAside>
};