import React from 'react';

const DataSwitch = (props) => {
  return (
    <div className="data-switch">
      You are viewing&nbsp;
      <button className="data-switch__button" onClick={props.toggleData}>
        { props.when === 'now' ? "today's" : "yesterday's" }
      </button>&nbsp;data.
    </div>
  )
}

export default DataSwitch;

