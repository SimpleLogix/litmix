import React from "react";

type Props = {};

const CardFive = (props: Props) => {
  return (
    <div className="card center card-five">
      <div
        className="card-background"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/dae.jpg)`,
        }}
      ></div>
      <div className="content">
        
      </div>
    </div>
  );
};

export default CardFive;
