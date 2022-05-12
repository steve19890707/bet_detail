import React from 'react';
import styled from "styled-components";
import { colors } from "../../constants/colors";
// spinners
import { ClipLoader } from "react-spinners";
// language
import { language } from '../../constants/Language';
const StyledLoader = styled.div`
  position:fixed;
  top:0;
  left:0;
  width:100%;
  min-height:100vh;
  z-index:101;
  background-color: ${colors.getIn(['main','bodyBackground'])};
  .cover {
    position: absolute;
    top:160px;
    left:50%;
    transform:translateX(-50%);
    text-align:center;
    p {
      margin-top:30px;
      color:#fff;
      font-size:18px;
    }
    .verification-img {
      width:220px;
      height:220px;
      background:url('./error.png')no-repeat;
      background-size:100%;
    }
    .verification-sub {
      margin-top:15px;
      font-size:14px;
      color:#888d9f;
    }
  }
  ${({ RWD })=> RWD.isTablet&&`
    .cover p {
      font-size:20px;
    }
    .cover .verification-img {
      width:330px;
      height:330px;
    }
    .cover .verification-sub {
      margin-top:10px;
      font-size:15px;
    }
  `}
  ${({ RWD })=> (!RWD.isTablet&&!RWD.isMobile)&&`
    .cover p {
      font-size:22px;
    }
    .cover .verification-img {
      width:330px;
      height:330px;
    }
    .cover .verification-sub {
      margin-top:15px;
      font-size:16px;
    }
  `};
`;
export const LoaderPage = ({ props })=> {
  const { langType, code, isMobile, isTablet } = props;
  const CodeFilter = ({ code }) =>{
    switch (code) {
      case 4006: 
        return <>
          <div className="verification-img"/>
          <p>{language.getIn([langType,'loader','verificationTitle'])}</p>
          <div className="verification-sub">
            {language.getIn([langType,'loader','verification'])}
          </div>
        </>
      default:
        return <>
          <ClipLoader
            size={45}
            color="#f4c000"
          />
          <p>{language.getIn([langType,'loader','title'])}</p>
        </>
    }
  };
  return <StyledLoader RWD={{ isMobile, isTablet }}>
    <div className="cover">
      <CodeFilter code={code}/>
    </div>
  </StyledLoader>
};
const StyledDesktopLoader = styled.div`
  max-width:1100px;
  min-width:800px;
  margin:0 auto;
  padding:0 20px;
  text-align:center;
  p {
    margin-top:30px;
    color:#fff;
    font-size:18px;
  }
`;
export const DesktopLoader = ({ props })=>{
  const { langType } = props;
  return <StyledDesktopLoader>
    <ClipLoader
      size={45}
      color="#f4c000"
    />
    <p>{language.getIn([langType,'loader','title'])}</p>
  </StyledDesktopLoader>
};