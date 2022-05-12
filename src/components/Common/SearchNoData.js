import React, { useContext } from 'react';
import { ReducerContext } from "../Props";
import styled from "styled-components";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
const StyledSearchNoData = styled.div`
  position: absolute;
  top:0;
  width:100%;
  height:100vh;
  background-color:${colors.getIn(['main','bodyBackground'])};
  z-index:${({zIndex})=>zIndex};
  display:flex;
  align-items:center;
  justify-content:center;
  .container {
    text-align:center;
  }
  .status-img {
    margin:0 auto;
    width:240px;
    height:240px;
    background:url('./empty.png')no-repeat;
    background-size:100%;
  }
  .main-title {
    margin-top:15px;
    color:#fff;
    font-size:18px;
  }
  .subtitle {
    margin-top:15px;
    font-size: 14px;
    color:${colors.getIn(['main','text'])};
  }
  .subtitle .keyword {
    color:${colors.getIn(['main','selected'])};
    margin:0 5px;
  }
  .back-btn {
    display:inline-block;
    font-size:14px;
    border-radius:5px;
    padding:10px 30px;
    margin-top:25px;
    color:${colors.getIn(['main','bodyBackground'])};
    background-color:${colors.getIn(['main','selected'])};
  }
  ${({ RWD })=> RWD.isTablet&&`
    .status-img {
      width:300px;
      height:300px;
    }
    .main-title {
      font-size:20px;
    }
    .subtitle {
      font-size:15px;
    }
    .back-btn {
      margin-top:30px;
      padding:12px 35px;
      font-size:16px;
    }
  `}

  ${({ RWD })=> (!RWD.isTablet&&!RWD.isMobile)&&`
    position: unset;
    height:calc(100vh - 245px);
    min-width:800px;
    max-width:1100px;
    margin:0 auto;
    align-items:flex-start;
    .status-img {
      width:300px;
      height:300px;
    }
    .main-title {
      margin-top:25px;
      font-size:20px;
    }
    .subtitle {
      font-size:15px;
    }
    .back-btn {
      margin-top:50px;
      padding:12px 35px;
      font-size:16px;
      cursor: pointer;
    }
  `}
`;
export const SearchNoData = ({ zIndex=3 })=>{
  const [ state, dispatch ] = useContext(ReducerContext);
  return <StyledSearchNoData zIndex={zIndex} RWD={{ isMobile:state.isMobile, isTablet:state.isTablet }}>
    <div className="container">
      <div className="status-img"/>
      <div className="main-title">{language.getIn([state.langType,'norecord'])}</div>
      <div className="subtitle">
        <span>{language.getIn([state.langType,'norecordSub']).split('|')[0]}</span>
        <span className="keyword">{state.inputCurrentVal}</span>
        <span>{language.getIn([state.langType,'norecordSub']).split('|')[1]}</span>
      </div>
      <div className="back-btn ga_order_home"
        onClick={()=>dispatch({ type:'setIsNoDataLayer', payload:{
          status: false
        }})}
      >{language.getIn([state.langType,'backHome'])}</div>
    </div>
  </StyledSearchNoData>
};