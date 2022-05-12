import React,{ useEffect, useContext } from 'react';
import { ReducerContext } from "../Props";
import styled from "styled-components";
import { List } from "immutable";
// icons
import { AiOutlineExclamationCircle } from "react-icons/ai";
const StyledBottomAlertTips = styled.div`
  @keyframes fadeInOut {
    0% {transform: translate(-50%,0px);opacity:0;}
    10% {transform: translate(-50%,-40px);opacity:1;}
    90% {transform: translate(-50%,-40px);opacity:1;}
    100% {transform: translate(-50%,0px);opacity:0;}
  };
  @keyframes desktopfadeInOut {
    0% {transform: translate(-50%,0px);opacity:0;}
    10% {transform: translate(-50%,30px);opacity:1;}
    90% {transform: translate(-50%,30px);opacity:1;}
    100% {transform: translate(-50%,0px);opacity:0;}
  };
  position: fixed;
  opacity:0;
  left:50%;
  bottom:0;
  width:85%;
  transform: translate(-50%,0px);
  background-color: ${({ color })=> color };
  padding:11px 18px;
  border-radius:5px;
  box-sizing:border-box;
  display:flex;
  align-items:center;
  z-index:101;
  animation: fadeInOut 2.5s;
  .svg-AiOutlineExclamationCircle {
    color: #fff;
    width:18px;
    height:18px;
    margin-right:10px;
  }
  .text {
    color: #fff;
    font-size:14px;
  }
  ${({ RWD })=> RWD.isTablet&&`
    .svg-AiOutlineExclamationCircle {
      width:23px;
      height:23px;
    }
    .text {
      font-size:16px;
    }
  `}
  ${({ RWD })=> (!RWD.isMobile&&!RWD.isTablet)&&`
    bottom:unset;
    top:0;
    left:calc(50% + 180px);
    width:600px;
    animation: desktopfadeInOut 2.5s;
    .svg-AiOutlineExclamationCircle {
      width:23px;
      height:23px;
    }
    .text {
      font-size:16px;
    }
  `}
`;
export const BottomAlertTips = ({
  alertArrCount=0,
})=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  useEffect(()=>{
    (alertArrCount===0) && dispatch({type:'setAlertArr',payload:{
      data: List()
    }});
  },[alertArrCount, dispatch]);
  return <StyledBottomAlertTips color={state.alertText.color} RWD={{ isMobile:state.isMobile, isTablet:state.isTablet}}>
      <AiOutlineExclamationCircle className="svg-AiOutlineExclamationCircle"/>
      <span className="text">{state.alertText.text}</span>
    </StyledBottomAlertTips>
  };