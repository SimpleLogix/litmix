import React from "react";
import { requestToken } from "../utils/RESTCalls";

type Props = {
  title: string;
  action: string;
  uploadOpenCallback?: () => void;
};

const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete your data?")) {
    // localStorage.clear();
    // window.location.reload();
    const x = await requestToken();
    console.log(x)
  }
};

const Header = ({ title, action, uploadOpenCallback }: Props) => {
  return (
    <div className="dashboard-header center">
      <div className="dashboard-title">{title}</div>
      <div className="dashboard-buttons">
        <button
          className="dashboard-header-action-button"
          onClick={uploadOpenCallback}
        >
          {action}
        </button>
        <button
          className="dashboard-header-delete-button"
          onClick={handleDelete}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/trash.svg`} alt="del" />
        </button>
      </div>
    </div>
  );
};

export default Header;
