import React from "react";
import { Link } from "react-router-dom";

export default function SettingsNavigation(props) {
  return (
    <div>
      <div className="my-10">
        <nav className="hidden md:block">
          <ol className="flex">
            <li>
              <span>
                <Link to="/settings" >Account</Link>
              </span>
            </li>
            <li className="flex">
              <div >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8.59 16.59L13.17 12 8.59 7.41L10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
              <span >{props.text}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-3">
            <h1 className="text-3xl">{props.title}</h1>
        </div>
      </div>
    </div>
  );
}
