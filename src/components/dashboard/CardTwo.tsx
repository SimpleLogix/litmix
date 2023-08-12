import React from "react";

type Props = {};

const CardTwo = (props: Props) => {
  return (
    <div
      className="card center card-two"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/abstract.jpg)`,
      }}
    >
      
    </div>
  );
};

export default CardTwo;
