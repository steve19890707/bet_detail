import React,{ useContext } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
// icons
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const StyledPagenations = styled.div`
  padding-bottom:30px;
  .container {
    display:flex;
    width:100%;
    align-items:center;
    justify-content:center;
    .btn {
      position: relative;
      width:40px;
      height:40px;
      background-color:${colors.getIn(['main','button'])};
      svg {
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:50%;
        height:50%;
        fill:${colors.getIn(['main','text'])};
      }
      &.prev {
        border-radius:5px 0 0 5px;
      }
      &.next {
        border-radius:0 5px 5px 0;
      }
      &.isAble {
        svg {
          fill:#fff;
        }
      }
    }
    .ex-pages {
      display:flex;
      align-items:center;
      justify-content:center;
      height:40px;
      padding:0 15px;
      margin:0 1px;
      background-color:${colors.getIn(['main','button'])};
      span {
        font-size:14px;
        color:#fff;
        &:nth-child(1) {
          color: ${colors.getIn(['main','selected'])};
        }
        &:nth-child(2) {
          margin:0 10px;
        }
      }
    }
  }
  ${({ RWD })=> !RWD.isMobile&&`
    padding-bottom:35px;
    .container {
      .btn {
        width:45px;
        height:45px;
        svg { 
          width:40%;
          height:40%;
        }
        &.isAble {
          cursor: pointer;
        }
      }
      .ex-pages { 
        height:45px;
        span {
          font-size:15px;
        }
      }
    }
  `}
`;
export const Pagenations = ()=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const prevBtnDisable = state.pagenations.current===1;
  const nextBtnDisable = state.pagenations.current===state.pagenations.total;
  return <StyledPagenations RWD={{ isMobile:state.isMobile, isTablet:state.isTablet}}>
    <div className="container">
      <div className={cx("btn prev",{ isAble: !prevBtnDisable })}
        onClick={()=>{
          if(prevBtnDisable) { return; };
          dispatch({ type:'setDataRenderDone' ,payload:{
            status: false
          }});
          dispatch({ type:'setCurrentOffset', payload:{
            number: `${Number(state.currentOffset) - Number(state.currentCount)}`
          }});
        }}
      ><IoIosArrowBack/></div>
      <div className="ex-pages">
        <span>{state.pagenations.current}</span>
        <span>/</span>
        <span>{state.pagenations.total}</span>
      </div>
      <div className={cx("btn next",{ isAble: !nextBtnDisable })}
        onClick={()=>{
          if(nextBtnDisable) { return; };
          dispatch({ type:'setDataRenderDone' ,payload:{
            status: false
          }});
          dispatch({ type:'setCurrentOffset', payload:{
            number: `${Number(state.currentOffset) + Number(state.currentCount)}`
          }});
        }}
      ><IoIosArrowForward/></div>
    </div>
  </StyledPagenations>
};