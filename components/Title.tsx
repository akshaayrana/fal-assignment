import React from "react";

const Title = ({ text }: { text: string }) => {
  return <h2 className="text-xl font-semibold my-5">{text}</h2>;
};

export default Title;
