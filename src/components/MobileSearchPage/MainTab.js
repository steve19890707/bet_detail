import React,{ useState, useContext, useRef } from 'react';
import { ReducerContext } from "../Props";
import styled from "styled-components";
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// icons
import { BiSearch } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
// common
import { fetchSearchIdData } from "../Common/FetchApiData";
import { timeZone } from "../Common/TimeZone";
const StyledMainTab = styled.div`
  width:100%;
  box-sizing:border-box;
  padding:30px 25px 0 25px;
  .title {
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
    border:1px solid ${colors.getIn(['main','listBackground'])};
    background-color:${colors.getIn(['main','bodyBackground'])};
    height:45px;
    margin-top:15px;
    transition:.2s;
    span {
      color:#fff;
      font-size:14px;
      transition:.2s;
    }
    &.active {
      border:1px solid ${colors.getIn(['main','selected'])};
      span {
        color:${colors.getIn(['main','selected'])};
      }
    }
    &.blur {
      border:1px solid transparent;
      background-color:${colors.getIn(['main','listBackground'])};
      span {
        color:${colors.getIn(['main','textDeep'])};
      }
    }
  }
  .id-search {
    margin-top:30px;
  }
  .id-search .btn {
    text-align:center;
    font-size:14px;
    margin:15px 0;
    padding:12px 0;
    border-radius:5px;
    color:${colors.getIn(['main','text'])};
    background-color:${colors.getIn(['main','button'])};
    transition:.2s;
    &.focus {
      color:${colors.getIn(['main','bodyBackground'])};
      background-color:${colors.getIn(['main','selected'])};
    }
  }
  .id-search label {
    width:100%;
    position: relative;
  }
  .svg-BiSearch {
    position: absolute;
    top:50%;
    left:15px;
    width:18px;
    height:18px;
    transform:translateY(-50%);
    fill:${colors.getIn(['main','textDeep'])};
  }
  .id-search .close {
    opacity:0;
    position: absolute;
    top:50%;
    right:15px;
    width:18px;
    height:18px;
    transform:translateY(-50%);
    border-radius:50%;
    background-color:${colors.getIn(['main','button'])};
    transition:.2s;
    z-index:-1;
    svg {
      width:100%;
      height:100%;
      color:#fff;
    }
  }
  .id-search input {
    width:100%;
    font-size:14px;
    margin-top:15px;
    padding:12px 40px;
    box-sizing:border-box;
    border-radius:5px;
    outline:none;
    background-color:${colors.getIn(['main','bodyBackground'])};
    border:1px solid ${colors.getIn(['main','listBackground'])};
    color:${colors.getIn(['main','textDeep'])};
    transition:.2s;
    &::placeholder {
      color:${colors.getIn(['main','textDeep'])};
    }
    &:focus {
      color:#fff;
      border:1px solid #fff;
      &::placeholder {
        color:#fff;
      }
      ~.svg-BiSearch {
        fill:#fff;
      }
      ~.close {
        opacity:1;
        z-index:2;
      }
    }
  }
  ${({ RWD })=> RWD.isTablet&&`
    padding:60px 0 0 0;
    margin:0 auto;
    width:320px;
  `}
`;
export const MainTab = ({ props })=> {
  const inputRef = useRef(null);
  const [ state, dispatch ] = useContext(ReducerContext);
  const [ catchSelectdType, setCatchSelectdType ] = useState(state.selectedDateSearch.type);
  const getApiData = ({ type='',val=0, currentTZ=0 })=>{
    const checkTimeType = ({ type='', currentTZ=0 })=>{
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
        default:
          time.beginTime = timeZone.beforeThirty();
          time.endTime = timeZone.now();
          break;
      };
      return time;
    };
    if(state.timeBusy){
      props.alertPop({
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
      dispatch({ type:'setMSelectorPopup', payload:{
        status: false,
        type:'',
        selectedCusDate: 0
      }});
      props.setDataUpdate({
        beginTime: checkTimeType({ type:type, val:val, currentTZ: currentTZ }).beginTime,
        endTime: checkTimeType({ type:type, val:val, currentTZ: currentTZ }).endTime,
        type: type,
        dateContent: val
      });
    };
  };
  return <StyledMainTab RWD={{ isMobile:state.isMobile, isTablet:state.isTablet}}>
    <div className="date-search">
      <div className="title">{language.getIn([state.langType,'dateSearch'])}</div>
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
        onClick={()=>dispatch({ type:'setMSelectorPopup', payload:{
          status: true,
          type:'customized',
          selectedCusDate: state.mSelectorPopup.selectedCusDate
        }})}
      >
        <span className={`ga_quicksearch_custom`}>{language.getIn([state.langType,'customized'])}</span>
      </div>
    </div>
    <div className="id-search">
      <div className="title">{language.getIn([state.langType,'numberSearch'])}</div>
      <label>
        <input className="input" 
          ref={inputRef}
          placeholder={language.getIn([state.langType,'searchPlaceholder'])}
          onFocus={()=>{
            setCatchSelectdType(state.selectedDateSearch.type);
            dispatch({ type:'setSelectedDateSearch',payload:{
              type:'blur'
            }});
          }}
          onBlur={()=>dispatch({ type:'setSelectedDateSearch',payload:{
            type: catchSelectdType
          }})}
        />
        <BiSearch className="svg-BiSearch"/>
        <div className="close" onClick={()=>{ inputRef.current.value = ''; }}><IoIosClose/></div>
      </label>
      <div className={cx("btn ga_quicksearch_order",{ focus : state.selectedDateSearch.type==='blur' })}
        onClick={()=>{
          if(inputRef.current.value===''){ return; };
          if(state.timeBusy || state.dataList.isLoading){
            props.alertPop({
              text: language.getIn([state.langType,'alert','busy']),
              color: colors.getIn(['accent','red']),
            });
          }else {
            dispatch({ type:'setIdSearch', payload:{
              timeBusy: true,
              inputCurrentVal: inputRef.current.value,
              dataRenderDone: false,
              isNoDataLayer: false,
              selectedDateSearch: 'singleSearch',
              timeSearchType: {
                type:'singleSearch',
                content: state.timeSearchType.content
              }
            }});
            fetchSearchIdData({ props: {
              getGameToken: state.getGameToken,
              rounid: inputRef.current.value,
              dispatch: dispatch
            }});
            inputRef.current.value = '';
          }
        }}
      >{language.getIn([state.langType,'btnSearch'])}</div>
    </div>
  </StyledMainTab>
};