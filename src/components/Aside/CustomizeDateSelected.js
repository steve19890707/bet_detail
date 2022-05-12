import React,{ useContext } from "react";
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// icons
import { BsCheck } from "react-icons/bs";
// common
import { timeZone } from "../Common/TimeZone";
const StyledCustomizeDateSelected = styled.ul`
  position: absolute;
  top:calc(100% + 4px);
  width:100%;
  z-index:2;
  li {
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%;
    height:44px;
    background-color:#fff;
    border-bottom:1px solid ${colors.getIn(['main','selectedBorder'])};
    transition:.1s;
    .text {
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
    &:nth-child(1) {
      border-radius:5px 5px 0 0;
    }
    &:last-child {
      border-radius:0 0 5px 5px;
    }
    &:hover {
      background-color: ${colors.getIn(['main','selected'])};
    }
    &.active {
      .text .svg-BsCheck {
        opacity:1;
      }
    }
  }
`;
export const CustomizeDateSelected = ({ props })=>{
  const { selectedCusDate, onChangeFun } = props;
  const [ state ] = useContext(ReducerContext);
  const dateList = language.getIn([state.langType,'cusDate']);
  return <StyledCustomizeDateSelected>
    {dateList.map((v,k)=>{
      if(k===0) {
        return null;
      }else return <li key={k} 
        className={cx(`ga_customdate_${v.get('value')}`,{ active: selectedCusDate===k })}
        onClick={()=>onChangeFun(k)}
      >
        <div className={`text ga_customdate_${v.get('value')}`}>
          <BsCheck className={`svg-BsCheck ga_customdate_${v.get('value')}`}/>
          {v.get('label')} {timeZone.getCusDateShow(v.get('value'),state.currentTZ)}
        </div>
      </li>
    })}
  </StyledCustomizeDateSelected>
};