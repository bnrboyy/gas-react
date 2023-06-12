import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import "./bounce.scss";


const BounceLoading = () => {
  const isBounceActive = useSelector(state => state.app.isBounceActive)
  if (!isBounceActive) return <Fragment></Fragment>;
  const text = "Loading-Settings";
  const arr = text.split("")
  return (
    <div id="loader-bounce" className="active">
      <div className="loader-bounce-body ">
        <div className="text-loading w-100">
          <div id="loading" className="Bbox">
            {arr.map((t, index) => (
              <Fragment key={index}>
                {(index === 1 )? (
                  <div className="loadingCircle Bbox"  > 
                    <div className="loadingInner Bbox">
                      <div className="loadingCore Bbox"></div>
                    </div>
                  </div>
                ):(<span className="letter" >{t}</span>)}
              </Fragment>
            ))}
          </div>
        </div>


        <div className="animation-container">
          <div className="lightning-container">
            <div className="lightning white"></div>
            <div className="lightning red"></div>
          </div>
          <div className="boom-container">
            <div className="shape circle big white"></div>
            <div className="shape circle white"></div>
            <div className="shape triangle big yellow"></div>
            <div className="shape disc white"></div>
            <div className="shape triangle blue"></div>
          </div>
          <div className="boom-container second">
            <div className="shape circle big white"></div>
            <div className="shape circle white"></div>
            <div className="shape disc white"></div>
            <div className="shape triangle blue"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BounceLoading;
