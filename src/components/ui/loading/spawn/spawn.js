import React from "react";
import { useSelector } from "react-redux";
import "./spawn.scss";

const SpawnLoading = () => {
  const isSpawnActive = useSelector((state) => state.app.isSpawnActive);
  const isBounceActive = useSelector((state) => state.app.isBounceActive);

  if (!isSpawnActive || isBounceActive) return <></>;
  return (
    <div className="loader-spawn active">
        <div className="spawn-loading">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        </div>
    </div>
  )
}

export default SpawnLoading;
