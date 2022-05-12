import React,{ useContext, useEffect } from "react";
import { ReducerContext } from "./Props";
import styled from "styled-components";
// icons
import { BsGear } from "react-icons/bs";
import { BiGlobe } from "react-icons/bi";
// language
import { language } from "../constants/Language";
// colors
import { colors } from "../constants/colors";
// components
import { timeZone } from "./Common/TimeZone";
import { DataStatusSelected } from "./Common/DataStatusSelected";
const StyledHeader = styled.div`
  position: fixed;
  top:0;
  left:0;
  width:100%;
  z-index:99;
  background-color:${colors.getIn(['main','listBackground'])};
  /* top-area */
  .top-area {
    position: relative;
    height: 55px;
    padding: 15px 0;
    box-sizing:border-box;
    border-bottom:1px solid ${colors.getIn(['main','border'])};
    .title {
      text-align:center;
      font-size:17px;
      color:#fff;
    }
  }
  .svg-BsGear {
    position: absolute;
    top:50%;
    left:25px;
    width:22px;
    height:22px;
    fill:#fff;
    transform:translateY(-50%);
    animation:.5s fade;
  }
  .svg-BiGlobe {
    position: absolute;
    top:50%;
    right:25px;
    width:22px;
    height:22px;
    fill:#fff;
    transform:translateY(-50%);
  }
  /* bottom-area */
  .bottom-area {
    position: relative;
    width:calc(100% - 40px);
    height:104px;
    margin:0 auto;
    display:flex;
    justify-content:center;
    &:before {
      content:'';
      position: absolute;
      z-index:1;
      background-color:${colors.getIn(['main','bodyBackground'])};
      width:calc(100% + 40px);
      height:40px;
      bottom:0;
      left:50%;
      transform:translate(-50%,100%);
    }
  }
  .show-status {
    transform:translateY(30px);
    text-align:center;
    span {
      color:#fff;
      font-size:14px;
    }
  }
  ${({ RWD })=> RWD.isTablet&&`
    .top-area {
      height:75px;
      padding:25px 0;
    }
    .top-area .title {
      font-size:20px;
    }
    .svg-BsGear { 
      left:35px;
    }
    .svg-BiGlobe {
      right:35px;
    }
    .bottom-area {
      width: calc(100% - 70px);
      &:before {
        width: calc(100% + 70px);
      }
    }
    .show-status span {
      font-size:15px;
    }
  `};
`;
const StyledDesktopHeader = styled.div`
  max-width:1100px;
  min-width:800px;
  margin:0 auto;
  padding:55px 20px 35px 20px;
  z-index:2;
  background-color:${colors.getIn(['main','bodyBackground'])};
  .show-TZ {
    display:flex;
    align-items:center;
    width:100%;
    height:70px;
    border-radius:5px;
    padding:0 25px;
    box-sizing:border-box;
    color:#fff;
    background-color:${colors.getIn(['main','listBackground'])};
  }
`;
export const Header = ({ 
  alertPop,
  isDesktop=false,
  callAlertStatus=false,
  setCallAlertStatus
 })=>{
  const [ state, dispatch ] = useContext(ReducerContext);
  const getCrrentTZ = ()=>{
    switch (state.currentTZ){
      case `0`:
        return language.getIn([state.langType,'timeZone',0,'label']);
      case `12`:
        return language.getIn([state.langType,'timeZone',1,'label']);
      case `4`:
        return language.getIn([state.langType,'timeZone',2,'label']);
      default:
        return language.getIn([state.langType,'timeZone',0,'label']);
    };
  };
  const getFetchDataType = () =>{
    switch (state.timeSearchType.type){
      case 'beforeThirty':
        return language.getIn([state.langType,'beforeThirty']);
      case 'today':
        return language.getIn([state.langType,'today']);
      case 'singleSearch':
        return language.getIn([state.langType,'singleSearch']);
      case 'customized':
        return timeZone.getCusDateShow(
          state.timeSearchType.content, state.currentTZ);
      default:
        return language.getIn([state.langType,'beforeThirty']);
    };
  };
  useEffect(()=>{
    if(callAlertStatus&&state.dataRenderDone){
      alertPop({
        text: language.getIn([state.langType,'alert','TZchange']),
        color: colors.getIn(['accent','green']),
      });
      setCallAlertStatus(false);
    };
  },[callAlertStatus, state.dataRenderDone, state.langType, alertPop, setCallAlertStatus]);
  return <>
  {isDesktop? 
    <StyledDesktopHeader>
      <div className="show-TZ">
        <span>{getCrrentTZ()}：</span>
        <span>{getFetchDataType()}</span>
      </div>
      {state.timeSearchType.type!=='singleSearch' &&
        <DataStatusSelected alertPop={alertPop} />}
    </StyledDesktopHeader> :
    <StyledHeader RWD={{ isMobile:state.isMobile, isTablet:state.isTablet}}>
      <div className="top-area">
        <BsGear className="svg-BsGear ga_funcbtn_filter"
          onClick={()=>dispatch({ type:'setMSearchPopup', payload:{
            status: !state.mSearchPopup
          }})}
        />
        <div className="title">{language.getIn([state.langType,
          'header','title'])}</div>
        <BiGlobe className="svg-BiGlobe ga_timezone"
          onClick={()=>dispatch({ type:'setMSelectorPopup', payload:{
            status: true,
            type:'timeZone',
            selectedCusDate: state.mSelectorPopup.selectedCusDate
          }})}
        />
      </div>
      {!state.isNoDataLayer&&<div className="bottom-area">
        <div className="show-status">
          <span>{getCrrentTZ()}：</span>
          <span>{getFetchDataType()}</span>
        </div>
        {state.timeSearchType.type!=='singleSearch' &&
          <DataStatusSelected alertPop={alertPop} />}
      </div>}
    </StyledHeader>}
  </>
};