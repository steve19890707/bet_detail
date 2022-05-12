import React,{ useState, useContext, useRef } from 'react';
import { ReducerContext } from "../Props";
import styled from 'styled-components';
import cx from "classnames";
import { colors } from "../../constants/colors";
import { language } from "../../constants/Language";
// icons
import { BiSearch } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { fetchSearchIdData } from "../Common/FetchApiData";
const StyledIdSearch = styled.div`
  margin-top:30px;
  .idSearch-title {
    font-size:15px;
    color:#fff;
  }
  .btn {
    text-align:center;
    font-size:14px;
    margin-top:15px;
    padding:12px 0;
    border-radius:5px;
    color:${colors.getIn(['main','text'])};
    background-color:${colors.getIn(['main','button'])};
    transition:.2s;
    &.focus {
      color:${colors.getIn(['main','bodyBackground'])};
      background-color:${colors.getIn(['main','selected'])};
      cursor: pointer;
    }
  }
  label {
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
  .close {
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
    cursor: pointer;
    svg {
      width:100%;
      height:100%;
      color:#fff;
    }
  }
  .input {
    width:100%;
    font-size:14px;
    margin-top:15px;
    padding:12px 40px;
    box-sizing:border-box;
    border-radius:5px;
    outline:none;
    background-color:${colors.getIn(['main','listBackground'])};
    border:1px solid ${colors.getIn(['main','buttonDarken'])};
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
      }
    }
  }
`;
export const IdSearch = ({ alertPop })=>{
  const inputRef = useRef(null);
  const [ state, dispatch ] = useContext(ReducerContext);
  const [ isFocus, setIsFocus ] = useState(false);
  const [ catchSelectdType, setCatchSelectdType ] = useState(state.selectedDateSearch.type);
  return <StyledIdSearch>
    <div className="idSearch-title">{language.getIn([state.langType,'numberSearch'])}</div>
    <label>
      <input 
        className="input"
        ref={inputRef}
        placeholder={language.getIn([state.langType,'searchPlaceholder'])}
        onFocus={()=>{
          dispatch({ type:'setSelectedDateSearch',payload:{
            type:'blur'
          }});
          if(state.selectedDateSearch.type !== 'blur') {
            setCatchSelectdType(state.selectedDateSearch.type);
          };
        }}
        onBlur={()=>{
          if(isFocus) {
            inputRef.current.focus();
          }else {
            dispatch({ type:'setSelectedDateSearch',payload:{
              type: catchSelectdType
            }});
          };
        }}
      />
      <BiSearch className="svg-BiSearch"
        onMouseOut={()=>setIsFocus(false)}
        onMouseOver={()=>setIsFocus(true)}
      />
      <div className="close" 
        onMouseOut={()=>setIsFocus(false)}
        onMouseOver={()=>setIsFocus(true)}
        onClick={()=>{ inputRef.current.value = ''; }}
      ><IoIosClose/></div>
    </label>
    <div className={cx("btn ga_quicksearch_order",{ focus : state.selectedDateSearch.type==='blur' })}
      onClick={()=>{
        if(inputRef.current.value===''){ return; };
        if(state.timeBusy || state.dataList.isLoading){
          alertPop({
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
  </StyledIdSearch>
};
