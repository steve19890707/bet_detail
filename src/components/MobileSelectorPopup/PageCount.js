import React,{ useContext } from "react";
import { ReducerContext } from "../Props";
import cx from "classnames";
import { language } from "../../constants/Language";
import { colors } from "../../constants/colors";

export const PageCount = ({ props })=> {
  const [ state, dispatch ] = useContext(ReducerContext);
  const { alertPop, StyledSelector } = props;
  const List = [ '300','500','800','1000' ];
  return <StyledSelector>
    {List.map((v,k)=>{
      return <div key={k}
        className={cx(`list-style ga_displaynum_${v}`,{
          active : state.currentCount===v
        })}
        onClick={()=>{
          if(state.timeBusy || state.dataList.isLoading){
            alertPop({ 
              text: language.getIn([state.langType,'alert','busy']),
              color: colors.getIn(['accent','red'])
            });
            dispatch({ type:'setCurrentCount', payload:{
              number: state.currentCount
            }});
          }else {
            dispatch({ type:'setStatusSelected' ,payload:{
              dataRenderDone: false,
              timeBusy: true,
              currentCount: v,
              currentOffset: '0'
            }});
            dispatch({ type:'setMSelectorPopup', payload:{
              status: false,
              type:'',
              selectedCusDate: state.mSelectorPopup.selectedCusDate
            }});
          };
        }}
      >
        <div className={`text ga_displaynum_${v}`}>{v}</div>
        <div className={`circle ga_displaynum_${v}`} />
      </div>
    })}
  </StyledSelector>
};
