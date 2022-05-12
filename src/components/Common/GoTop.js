import React from "react";
import styled from "styled-components";
import { colors } from "../../constants/colors";
import { IoIosArrowUp } from "react-icons/io";
const StyledGoTop = styled.div`
  position: fixed;
  right:0;
  bottom:30px;
  width:40px;
  height:40px;
  background-color: ${colors.getIn(['main','selected'])};
  border-radius:5px 0 0 5px;
  box-shadow:0 3px 5px rgba(0,0,0,0.2);
  z-index:2;
  -webkit-tap-highlight-color:transparent;
  cursor: pointer;
  svg {
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    color: ${colors.getIn(['main','bodyBackground'])};
    width:50%;
    height:50%;
  }
  ${({ RWD })=> RWD.isTablet&&`
    bottom:45px;
    width:45px;
    height:45px;
  `}
  ${({ RWD })=> (!RWD.isMobile&&!RWD.isTablet)&&`
    bottom:55px;
    width:45px;
    height:45px;
  `}
`;
export const GoTop = ({
  bodyRef=null,
  isMobile=true,
  isTablet=false
})=> {
  return <StyledGoTop 
    className={`ga_gotop`}
    RWD={{ isMobile: isMobile, isTablet: isTablet }}
    onClick={()=>{
      const interval = setInterval(() => {
        const isDesktop = !isMobile&&!isTablet;
        const height = isDesktop ? 70 : 110;
        const currentItem = Math.floor(bodyRef.current.state.scrollOffset / height);
        const upNum = Math.floor(currentItem / 3);
        bodyRef.current.scrollToItem(upNum,'auto');
        (upNum<=0) && clearInterval(interval);
      },30);
    }}
  ><IoIosArrowUp className={`ga_gotop`}/></StyledGoTop>
};