import React, { useContext } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
// components
import { TimeZoneSelector } from "./TimeZoneSelector";
import { Customized } from "./Customized";
import { PageCount } from "./PageCount";
const StyledMobileSelectorPopup = styled.div`
  position:fixed;
  z-index:101;
  top:0;
  width:100%;
  height:100vh;
  .background {
    position: absolute;
    z-index:1;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(36, 40, 48, 0.9);
  }
`;
const StyledSelector = styled.div`
  position: absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  z-index:2;
  width:90%;
  max-width:320px;
  margin:0 auto;
  .list-style {
    display:flex;
    align-items:center;
    justify-content:space-between;
    background-color:#fff;
    border-bottom:1px solid #d0d1d7;
    box-sizing:border-box;
    padding:13px 15px;
    &:nth-child(1) {
      border-top-left-radius:5px;
      border-top-right-radius:5px;
    }
    &:last-child {
      border-bottom-left-radius:5px;
      border-bottom-right-radius:5px;
      border-bottom:none;
    }
    &.active {
      .text {
        color:#24292f;
      }
      .circle {
        border: 1px solid #24292f;
        &:before {
          opacity:1;
        }
      }
    }
  }
  .list-style .text {
    font-size:15px;
    color: #888e9e;
  }
  .list-style .circle {
    position: relative;
    border-radius:50px;
    width:16px;
    height:16px;
    border: 1px solid #888e9e;
    &:before {
      content:'';
      opacity:0;
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      width:10px;
      height:10px;
      border-radius:50px;
      background-color:#24292f;
    }
  }
`;
export const MobileSelectorPopup = ({ 
  alertPop,
  setCallAlertStatus
 })=>{
  const [ state, dispatch ] = useContext(ReducerContext);
  return <StyledMobileSelectorPopup>
    {state.mSelectorPopup.type==='timeZone' && 
      <TimeZoneSelector props={{
        alertPop,
        setCallAlertStatus,
        StyledSelector
      }}/> 
    }
    {state.mSelectorPopup.type==='customized' &&
      <Customized props={{
        alertPop,
        StyledSelector
      }}/> 
    }
    {state.mSelectorPopup.type==='pageCount' &&
      <PageCount props={{
        alertPop,
        StyledSelector
      }}/> 
    }
    <div className="background"
      onClick={()=>dispatch({ type:'setMSelectorPopup', payload:{
        status: false,
        type:'',
        selectedCusDate: state.mSelectorPopup.selectedCusDate
      }})}
    />
  </StyledMobileSelectorPopup>
};