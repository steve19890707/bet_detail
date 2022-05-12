import React,{ useContext, useState, useEffect } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
import { timeZone } from "../Common/TimeZone";
// icons
import { BiGlobe } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { IoIosArrowDown } from 'react-icons/io';
const StyledTZchange = styled.div`
  position: absolute;
  width:calc(100% - 80px);
  left:40px;
  bottom:60px;
  .main-content {
    position: relative;
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%;
    height:50px;
    border-radius:5px;
    background-color: ${colors.getIn(['main','button'])};
    cursor: pointer;
    &.active {
      background-color: ${colors.getIn(['main','selected'])};
      p { 
        color:${colors.getIn(['main','bodyBackground'])}; 
      }
      .svg-BiGlobe, .svg-IoIosArrowDown { 
        fill:${colors.getIn(['main','bodyBackground'])};
      }
    }
  }
  .main-content p {
    color:#fff;
    font-size:15px;
  }
  .svg-BiGlobe {
    position: absolute;
    top:50%;
    left:20px;
    fill:#fff;
    width:17px;
    height:17px;
    transform:translateY(-50%);
  }
  .svg-IoIosArrowDown {
    position: absolute;
    top:50%;
    right:20px;
    fill:#fff;
    width:17px;
    height:17px;
    transform:translateY(-50%);
  }
  .main-content .TZ-list {
    position: absolute;
    bottom:calc(100% + 2px);
    left:0;
    width:100%;
    .list-style {
      display:flex;
      align-items:center;
      justify-content:center;
      height:45px;
      background-color:#fff;
      &:nth-child(1) {
        border-top-left-radius:5px;
        border-top-right-radius:5px;
      }
      &:last-child {
        border-bottom-left-radius:5px;
        border-bottom-right-radius:5px;
      }
      &:hover {
        background-color:${colors.getIn(['main','selected'])};
      }
      &.active span {
        font-weight:bold;
        .svg-BsCheck {
          opacity:1;
        }
      }
    }
    .list-style span {
      position: relative;
      font-size:15px;
      color:${colors.getIn(['main','bodyBackground'])};
      .svg-BsCheck { 
        opacity:0;
        position: absolute;
        top:50%;
        left:0;
        width:18px;
        height:18px;
        transform: translate(calc(-100% - 12px),-50%);
        fill:${colors.getIn(['main','bodyBackground'])};
      }
    }
  }
`;
export const TZchange = ({ alertPop })=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const [ TZchangeSelected, setTZchangeSelected ] = useState(false);
  const [ callAlertStatus, setCallAlertStatus ] = useState(false);
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
    }
  };
  useEffect(()=>{
    if(callAlertStatus&&state.dataRenderDone){
      alertPop({
        text: language.getIn([state.langType,'alert','TZchange']),
        color: colors.getIn(['accent','green']),
      });
      setCallAlertStatus(false);
    };
  },[ callAlertStatus, state.dataRenderDone, state.langType, alertPop ]);
  useEffect(()=>{
    const handleClickOutside = (event)=> {
      const TZchangeId = document.getElementById('TZchange');
      if(TZchangeId && !TZchangeId.contains(event.target)){
        setTZchangeSelected(false);
      };
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[]);
  return <StyledTZchange className={`ga_timezone`}>
    <div className={cx("main-content ga_timezone", { active : TZchangeSelected })}
      onClick={()=>setTZchangeSelected(prev=>!prev)}
    >
      <p className={`ga_timezone`}>{checkTZ.getIn([0,'label'])}</p>
      <BiGlobe className="svg-BiGlobe ga_timezone"/>
      <IoIosArrowDown className="svg-IoIosArrowDown ga_timezone"/>
      {TZchangeSelected && <div className="TZ-list">
        {language.getIn([state.langType,'timeZone']).map((v,k)=>{
          return <div key={k} className={cx(`list-style ${getGAclassname(v.get('value'))}`,
            { active : v.get('value')===checkTZ.getIn([0,'value'])
          })}
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
                dispatch({ type:'setCurrentTZ', payload:{
                  number: v.get('value'),
                  beginTime: filterSearchType(v.get('value')).beginTime,
                  endTime: filterSearchType(v.get('value')).endTime
                }});
                setCallAlertStatus(true);
              }
          }}>
            <span className={`${getGAclassname(v.get('value'))}`}>
              <BsCheck className={`svg-BsCheck ${getGAclassname(v.get('value'))}`}/>
              {v.get('label')}
            </span>
          </div>})}
        </div>
      }
    </div>
  </StyledTZchange>
};