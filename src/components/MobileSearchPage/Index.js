import React,{ useContext } from 'react';
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// icons
import { BiLeftArrowAlt } from 'react-icons/bi';
// component
import { MainTab } from "./MainTab";
const StyledSearchPage = styled.div`
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100vh;
  overflow:auto;
  background-color:${colors.getIn(['main','bodyBackground'])};
  z-index:100;
  transform:translateX(100%);
  transition:.2s;
  &.active {
    transform:translateX(0%);
  }
  header {
    position: relative;
    width:100%;
    height:55px;
    padding:15px 0;
    box-sizing:border-box;
    background-color:${colors.getIn(['main','bodyBackground'])};
    border-bottom:1px solid ${colors.getIn(['main','border'])};
    .title {
      font-size:17px;
      color:#fff;
      text-align:center;
    }
  }
  header .go-back {
    position:absolute;
    width:30px;
    height:30px;
    top:50%;
    left:25px;
    transform:translateY(-50%);
    .content {
      position: relative;
      width:100%;
      height:100%;
      background-color:${colors.getIn(['main','button'])};
      border-radius:50%;
    }
    .svg-BiLeftArrowAlt {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      fill:#fff;
      width:20px;
      height:20px;
    }
  }
  ${({ RWD })=> RWD.isTablet&&`
    header {
      height:75px;
      padding:23px 0;
      .title {
        font-size:20px;
      }
    }
    header .go-back {
      left:30px;
    }
  `};
`;
export const SearchPage = ({ alertPop })=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const setDataUpdate = ({
    beginTime='',
    endTime='',
    type='',
    dateContent=''
  })=>{
    dispatch({ type:'mobileSearchPageDataUpdate', payload:{
      filterTypeType:'default',
      currentOffsetNumber:'0',
      sendTimeZoneBegin: beginTime,
      sendTimeZoneEnd: endTime,
      timeSearchTypeType: type,
      timeSearchTypeContent: dateContent,
      mSearchPopupStatus: false,
      dataRenderDoneStatus:false,
      selectedDateSearchType: type
    }});
  };
  return <StyledSearchPage className={cx({ active : state.mSearchPopup })}
    RWD={{ isMobile:state.isMobile, isTablet:state.isTablet}}>
    <header>
      <div className="go-back"
        onClick={()=>dispatch({ type:'setMSearchPopup', payload:{
          status: false
        }})}
      >
        <div className="content">
          <BiLeftArrowAlt className="svg-BiLeftArrowAlt"/>
        </div>
      </div>
      <div className="title">{language.getIn([state.langType,'recordSearch'])}</div>
    </header>
    <MainTab props={{ alertPop, setDataUpdate }}/>
  </StyledSearchPage>
};