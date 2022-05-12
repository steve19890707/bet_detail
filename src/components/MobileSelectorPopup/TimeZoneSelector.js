import React,{ useContext } from "react";
import { ReducerContext } from "../Props";
import cx from "classnames";
import { language } from "../../constants/Language";
import { colors } from "../../constants/colors";
import { timeZone } from "../Common/TimeZone";

export const TimeZoneSelector = ({ props })=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const { alertPop, setCallAlertStatus, StyledSelector } = props;
  const List = language.getIn([state.langType,'timeZone']);
  const checkTZ = language.getIn([state.langType,'timeZone'])
    .filter(v=>v.get('value')===state.currentTZ);
  const getGAclassname = (classname)=> {
    switch (classname) {
      case '0':
        return 'ga_timezone_eastern';
      case '12':
        return 'ga_timezone_beijing';
      case '4':
        return 'ga_timezone_london';
      default:
        break;
    };
  };
  return <StyledSelector>
    {List.map((v,k)=>{
      return <div key={k}
        className={cx(`list-style ${getGAclassname(v.get('value'))}`
        ,{ active : checkTZ.getIn([0,'value'])===v.get('value') })}
        onClick={()=>{
          if(state.timeBusy || state.dataList.isLoading){
            alertPop({
              text: language.getIn([state.langType,'alert','busy']),
              color: colors.getIn(['accent','red']),
            });
          }else {
            dispatch({ type:'setTimeBusy', payload:{
              status: true
            }});
            dispatch({ type:'setDataRenderDone', payload:{
              status: false
            }});
            if(state.timeSearchType.type==='singleSearch'){
              dispatch({ type:'setStaticCurrentTZ', payload:{
                number: v.get('value')
              }});
              setCallAlertStatus(true);
              return;
            };
            const filterSearchType = ( currentTZ=0 )=>{
              const time = { beginTime:'', endTime:'' };
              switch ( state.timeSearchType.type ) {
                case 'beforeThirty':
                  time.beginTime = state.sendTimeZone.begin;
                  time.endTime = state.sendTimeZone.end;
                  break;
                case 'today':
                  time.beginTime = timeZone.getTodayBegin(currentTZ);
                  time.endTime = timeZone.getTodayEnd(currentTZ);
                  break;
                case 'customized':
                  time.beginTime = timeZone.getCusDateBegin(
                    state.customizedBeforeDay,
                    currentTZ);
                  time.endTime = timeZone.getCusDateEnd(
                    state.customizedBeforeDay,
                    currentTZ);
                  break;
                default:
                  time.beginTime = state.sendTimeZone.begin;
                  time.endTime = state.sendTimeZone.end;
                  break;
              };
              return time;
            };
            setCallAlertStatus(true);
            dispatch({ type:'setCurrentTZ', payload:{
              number: v.get('value'),
              beginTime: filterSearchType(v.get('value')).beginTime,
              endTime: filterSearchType(v.get('value')).endTime
            }});
            dispatch({ type:'setMSelectorPopup', payload:{
              status: false,
              type:'',
              selectedCusDate: state.mSelectorPopup.selectedCusDate
            }});
          };
        }}
      >
        <div className={`text ${getGAclassname(v.get('value'))}`}>{v.get('label')}</div>
        <div className={`circle ${getGAclassname(v.get('value'))}`} />
      </div>
    })}
  </StyledSelector>
};